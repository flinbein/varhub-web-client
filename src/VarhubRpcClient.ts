import { parse, serialize, type XJData } from "@flinbein/xjmapper";
import { EventBox, type EventSubscriber } from "./EventBox.js";
import type { RoomJoinOptions, Varhub } from "./Varhub.js";
import { resolve } from "node:dns";


type VarhubClientEvents<MESSAGES extends Record<string, XJData[]>> = {
	message: {[key in keyof MESSAGES]: [eventName: key, ...eventParams: MESSAGES[key]]}[keyof MESSAGES]
	close: [reason: string|null]
	ready: []
	error: [Error]
}

export class VarhubRpcClient<
	METHODS extends Record<string, any> = Record<string, (...args: XJData[]) => XJData>,
	MESSAGES extends Record<string, any[]> = Record<string, XJData[]>
> implements Disposable, AsyncDisposable {
	readonly #ws: WebSocket;
	readonly #responseEventTarget = new EventTarget();
	readonly #messagesEventBox = new EventBox<MESSAGES, typeof this>(this);
	readonly #selfEventBox = new EventBox<VarhubClientEvents<MESSAGES>, typeof this>(this);
	
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
	
	#error: Error | undefined
	#ready = false;
	#closed = false;
	readonly #readyPromise: Promise<this>;
	
	constructor(ws: WebSocket) {
		if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
			throw new Error("websocket is closed");
		}
		ws.binaryType = "arraybuffer"
		this.#ws = ws;
		if (ws.readyState === WebSocket.CONNECTING) {
			this.#readyPromise = new Promise((resolve, reject) => {
				this.once("ready", () => resolve(this));
				this.once("close", (error) => reject(error));
			});
			ws.addEventListener("open", () => {
				this.#ready = true;
				this.#selfEventBox.dispatch("ready", []);
			});
		} else {
			this.#ready = true;
			this.#readyPromise = Promise.resolve(this);
		}
		this.#readyPromise.catch(() => {});
		
		ws.binaryType = "arraybuffer";
		ws.addEventListener("close", (event) => {
			this.#closed = true;
			this.#ready = false;
			this.#selfEventBox.dispatch("close", [event.reason]);
		});
		ws.addEventListener("message", (event) => {
			const binData = new Uint8Array(event.data as ArrayBuffer);
			const [code = undefined, ...args] = parse(binData);
			if (code === "$rpcEvent") {
				this.#selfEventBox.dispatch("message", args as any);
				if (args.length >= 1) {
					const [eventType, ...eventData] = args;
					if (typeof eventType === "string") {
						this.#messagesEventBox.dispatch(eventType, eventData as any);
					}
				}
			} else if (code === "$rpcResult") {
				const [callId = undefined, errorCode = undefined, response = undefined] = args;
				if (typeof callId !== "number" && typeof callId !== "string") return;
				this.#responseEventTarget.dispatchEvent(new CustomEvent(callId as any, {detail: [errorCode, response]}));
			}
		});
	}
	
	/**
	 * Promise wait for ready status.
	 */
	get waitForReady(): Promise<this>{
		return this.#readyPromise;
	}
	
	get error(): Error | undefined {return this.#error }
	get ready(): boolean {return this.#ready }
	get closed(): boolean {return this.#closed }
	
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
			const binData = serialize("$rpc", currentCallId, method, ...data as any);
			const onResponse = (event: Event) => {
				if (!(event instanceof CustomEvent)) return;
				const eventData = event.detail;
				if (!Array.isArray(eventData)) return;
				const [type, response] = eventData;
				clear(type === 0 ? resolve: reject, response);
			}
			const onClose = (reason: string | null) => {
				clear(reject, new Error(reason ?? "connection closed"));
			}
			const clear = <T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>) => {
				this.#responseEventTarget.removeEventListener(currentCallId as any, onResponse);
				this.off("close", onClose);
				fn(...args);
			}
			this.#responseEventTarget.addEventListener(currentCallId as any, onResponse, {once: true});
			this.once("close", onClose);
			
			this.#ws.send(binData);
		});
	}
	
	close(reason?: string): void {
		this.#closed = true;
		this.#ready = false;
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
	
	[Symbol.dispose](){
		if (this.#ws.readyState === WebSocket.CLOSED) return;
		this.#ws.close();
	}
	
	[Symbol.asyncDispose](){
		if (this.#ws.readyState === WebSocket.CLOSED) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.#ws.close();
			this.#ws.addEventListener("close", () => resolve());
		});
	}
}