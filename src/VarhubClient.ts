import { parse, serialize, XJData } from "@flinbein/xjmapper";
import type { RoomJoinOptions, Varhub } from "./Varhub.js";


interface EventSubscriber<T extends Record<string, unknown[]>, THIS extends unknown> {
	on<E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E]) => void): void
	once<E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E]) => void): void
	off<E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E]) => void): void
}

class EventBox<T extends Record<keyof unknown, unknown[]>, THIS extends unknown> {
	#eventTarget = new EventTarget();
	#fnMap = new WeakMap<(...args: any) => void, (...args: any) => void>()
	#source: THIS;
	constructor(thisSource: THIS) {
		this.#source = thisSource;
	}
	dispatch<E extends keyof T>(type: E, detail: T[E]): void {
		this.#eventTarget.dispatchEvent(new CustomEvent(type as any, {detail}))
	}
	subscriber: EventSubscriber<T, THIS> = {
		on: <E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E] & any[]) => void) => {
			let eventHandler = this.#fnMap.get(handler);
			if (!eventHandler) {
				eventHandler = (event: CustomEvent) => {
					handler.apply(this.#source, event.detail);
				}
				this.#fnMap.set(handler, eventHandler);
			}
			this.#eventTarget.addEventListener(eventName as any, eventHandler);
		},
		once: <E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E] & any[]) => void) => {
			let eventHandler = this.#fnMap.get(handler);
			if (!eventHandler) {
				eventHandler = (event: CustomEvent) => {
					handler.apply(this.#source, event.detail)
				}
				this.#fnMap.set(handler, eventHandler);
			}
			this.#eventTarget.addEventListener(eventName as any, eventHandler as any, {once: true});
		},
		off: <E extends keyof T>(eventName: E, handler: (this: THIS, ...args: T[E] & any[]) => void) => {
			let eventHandler = this.#fnMap.get(handler);
			if (!eventHandler) return;
			this.#eventTarget.removeEventListener(eventName as any, eventHandler);
		},
	};
}

type VarhubClientEvents<MESSAGES extends Record<string, XJData[]>> = {
	message: {[key in keyof MESSAGES]: [key, ...MESSAGES[key]]}[keyof MESSAGES]
	close: [reason: string|null]
}

export class VarhubClient<
	METHODS extends Record<string, any> = Record<string, (...args: XJData[]) => XJData>,
	MESSAGES extends Record<string, any[]> = Record<string, XJData[]>
> {
	#ws: WebSocket;
	#responseEventTarget = new EventTarget();
	#messagesEventBox = new EventBox<MESSAGES, typeof this>(this);
	#selfEventBox = new EventBox<VarhubClientEvents<MESSAGES>, typeof this>(this);
	
	/**
	 * Use this object to subscribe on room events
	 *
	 * room:
	 * ```typescript
	 * 	import room from "varhub:room";
	 * 	room.broadcast("greet", "hello players!");
	 * 	room.send(playerName, "greet", "hello player!")
	 * ```
	 *
	 * web:
	 * ```typescript
	 * 	client.messages.on("greet", (message) => {
	 * 		console.log(message);
	 * 	});
	 * ```
	 * Use `client.messages.once(eventName, handler)` to subscribe on event
	 *
	 * Use `client.messages.once(eventName, handler)` to subscribe once
	 *
	 * Use `client.messages.off(eventName, handler)` to unsubscribe
	 *
	 * handler is required
	 */
	messages: EventSubscriber<MESSAGES, typeof this> = this.#messagesEventBox.subscriber;
	
	/**
	 * Use this object to call room methods
	 *
	 * room:
	 * ```typescript
	 * 	export function getGreetMessage(this:{player: string}){
	 * 		return "Hello "+ this.player + "!"
	 * 	}
	 * ```
	 *
	 * web:
	 * ```typescript
	 * 	const message = await client.methods.getGreetMessage();
	 * 	// `Hello ${client.name}!`
	 * ```
	 */
	methods: {[K in keyof METHODS]: (...args: Parameters<METHODS[K]>) => Promise<ReturnType<METHODS[K]>>} = new Proxy(
		Object.freeze(Object.create(null)),
		{
			get: (ignored, method) => (...args: any) => this.call(method as any, ...args),
		}
	);

	readonly #hub: Varhub
	readonly #roomId: string
	readonly #name: string
	readonly #params: unknown
	readonly #roomIntegrity: string | undefined

	constructor(ws: WebSocket, hub: Varhub, roomId: string, name: string, options: RoomJoinOptions) {
		this.#ws = ws;
		this.#hub = hub
		this.#roomId = roomId
		this.#name = name
		this.#roomIntegrity = options?.integrity
		this.#params = options?.params
		ws.binaryType = "arraybuffer";
		ws.addEventListener("close", (event) => {
			this.#selfEventBox.dispatch("close", [event.reason]);
		});
		ws.addEventListener("message", (event) => {
			const binData = new Uint8Array(event.data as ArrayBuffer);
			const [type, ...parsedData] = parse(binData);
			if (type === 2) {
				this.#selfEventBox.dispatch("message", parsedData as any);
				if (parsedData.length >= 1) {
					const [eventType, ...eventData] = parsedData;
					if (typeof eventType === "string") {
						this.#messagesEventBox.dispatch(eventType, eventData as any);
					}
				}
			} else {
				const [callId, response] = parsedData;
				if (typeof callId !== "number" && typeof callId !== "string") return;
				this.#responseEventTarget.dispatchEvent(new CustomEvent(callId as any, {detail: [type, response]}));
			}
		});
	}
	
	get hub(): Varhub {return this.#hub }
	get roomId(): string {return this.#roomId }
	get name(): string {return this.#name }
	get roomIntegrity(): string | undefined {return this.#roomIntegrity }
	get params(): unknown {return this.#params }

	get online(): boolean {
		return this.#ws.readyState === WebSocket.OPEN;
	}

	#callId = 0;
	
	/**
	 * call method directly
	 *
	 * room:
	 * ```typescript
	 * 	export function getGreetMessage(this:{player: string}){
	 * 		return "Hello "+ this.player + "!"
	 * 	}
	 * ```
	 *
	 * web:
	 * ```typescript
	 * 	const message = await client.call("getGreetMessage");
	 * 	// `Hello ${client.name}!`
	 * ```
	 * @param method name of method
	 * @param data arguments
	 * @returns Promise with call result
	 */
	async call<T extends keyof METHODS>(method: T & string, ...data: Parameters<METHODS[T]>): Promise<Awaited<ReturnType<METHODS[T]>>>{
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("connection status");
		return new Promise<any>((resolve, reject) => {
			const currentCallId = this.#callId++;
			const binData = serialize(currentCallId, method, ...data as any);
			const onResponse = (event: Event) => {
				if (!(event instanceof CustomEvent)) return;
				const eventData = event.detail;
				if (!Array.isArray(eventData)) return;
				const [type, response] = eventData;
				clearEvents();
				if (type === 0) resolve(response);
				else reject(response);
			}
			const onClose = (reason: string | null) => {
				clearEvents();
				reject(new Error(reason ?? "connection closed"));
			}
			const clearEvents = () => {
				this.#responseEventTarget.removeEventListener(currentCallId as any, onResponse);
				this.off("close", onClose);
			}
			this.#responseEventTarget.addEventListener(currentCallId as any, onResponse, {once: true});
			this.once("close", onClose);

			this.#ws.send(binData);
		});
	}

	close(reason?: string): void {
		this.#ws.close(4000, reason);
	}
	
	/**
	 * subscribe on client event
	 *
	 * room:
	 * ```typescript
	 * 	import room from "varhub:room";
	 * 	room.broadcast("greet", "hello players!");
	 * 	room.send(playerName, "greet", "hello player!")
	 * 	room.kick(playerName, "kicked")
	 * ```
	 *
	 * web:
	 * ```typescript
	 * 	client.on("message", (eventName, ...eventData) => {
	 * 		console.log(eventName, eventData);
	 * 		// greet ["hello players!"]
	 * 		// greet ["hello player!"]
	 * 	});
	 * 	client.on("close", (reason) => {
	 * 		console.log("disconnected by reason:", reason);
	 * 		// disconnected by reason: kicked
	 * 	})
	 * ```
	 *
	 * @param event "message" or "close"
	 * @param handler event handler
	 */
	on<T extends keyof VarhubClientEvents<MESSAGES>>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents<MESSAGES>[T]) => void): this{
		this.#selfEventBox.subscriber.on(event, handler);
		return this;
	}
	/**
	 * Subscribe on client event once
	 * @see {VarhubClient#on}
	 * @param event
	 * @param handler
	 */
	once<T extends keyof VarhubClientEvents<MESSAGES>>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents<MESSAGES>[T]) => void): this{
		this.#selfEventBox.subscriber.once(event, handler);
		return this;
	}
	
	/**
	 * Unsubscribe from client event
	 * @see {VarhubClient#on}
	 * @param event
	 * @param handler required!
	 */
	off<T extends keyof VarhubClientEvents<MESSAGES>>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents<MESSAGES>[T]) => void): this{
		this.#selfEventBox.subscriber.off(event, handler);
		return this;
	}
}