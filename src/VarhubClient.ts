import { parse, serialize, XJData } from "@flinbein/xjmapper";
import type { RoomJoinOptions, Varhub } from "./Varhub.js";


interface EventSubscriber<T extends Record<string, unknown[]>> {
	on<E extends keyof T>(eventName: E, handler: (...args: T[E]) => void): void
	once<E extends keyof T>(eventName: E, handler: (...args: T[E]) => void): void
	off<E extends keyof T>(eventName: E, handler: (...args: T[E]) => void): void
}
interface EventBox<T extends Record<string, unknown[]>> {
	dispatch<E extends keyof T>(type: E, detail: T[E]): void,
	subscriber: EventSubscriber<T>
}

function createEventBox<T extends Record<string, unknown[]>>(): EventBox<T> {
	const target = new EventTarget();
	const targetMap = new WeakMap<(...args: any) => void, (...args: any) => void>()
	return {
		dispatch<E extends keyof T>(type: E, detail: T[E]){
			target.dispatchEvent(new CustomEvent(type as any, {detail}))
		},
		subscriber: {
			on(event: string, handler: (...args: any) => void) {
				let eventHandler = targetMap.get(handler);
				if (!eventHandler) {
					eventHandler = (event: CustomEvent) => {
						handler(...event.detail);
					}
					targetMap.set(handler, eventHandler);
				}
				target.addEventListener(event, eventHandler as any);
			},
			once(event: string, handler: (...args: any) => void) {
				let eventHandler = targetMap.get(handler);
				if (!eventHandler) {
					eventHandler = (event: CustomEvent) => {
						handler(...event.detail)
					}
					targetMap.set(handler, eventHandler);
				}
				target.addEventListener(event, eventHandler as any, {once: true});
			},
			off(event: string, handler: (...args: any) => void) {
				let eventHandler = targetMap.get(handler);
				if (!eventHandler) return;
				target.removeEventListener(event, eventHandler);
			},
		} as any
	}
}

type VarhubClientEvents<MESSAGES extends Record<string, XJData[]>> = {
	message: {[key in keyof MESSAGES]: [key, ...MESSAGES[key]]}[keyof MESSAGES]
	close: [reason: string|null]
}

export class VarhubClient<
	METHODS extends Record<string, any> = Record<string, (...args: XJData[]) => XJData>,
	MESSAGES extends Record<string, any> = Record<string, XJData[]>
> {
	#ws: WebSocket;
	#responseEventTarget = new EventTarget();
	#messagesEventBox = createEventBox<MESSAGES>();
	#selfEventBox = createEventBox<VarhubClientEvents<MESSAGES>>();

	messages = this.#messagesEventBox.subscriber;

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

	on<T extends keyof VarhubClientEvents<MESSAGES>>(event: T, handler: (...args: VarhubClientEvents<MESSAGES>[T]) => void): this{
		this.#selfEventBox.subscriber.on(event, handler);
		return this;
	}

	once<T extends keyof VarhubClientEvents<MESSAGES>>(event: T, handler: (...args: VarhubClientEvents<MESSAGES>[T]) => void): this{
		this.#selfEventBox.subscriber.once(event, handler);
		return this;
	}

	off<T extends keyof VarhubClientEvents<MESSAGES>>(event: T, handler: (...args: VarhubClientEvents<MESSAGES>[T]) => void): this{
		this.#selfEventBox.subscriber.off(event, handler);
		return this;
	}
}