import { parse, serialize, type XJData } from "@flinbein/xjmapper";
import { EventBox, type EventSubscriber } from "./EventBox.js";
import type { RoomJoinOptions, Varhub } from "./Varhub.js";


type VarhubLoggerEvents = {
	message: [roomId: string, eventType: string, ...eventData: XJData[]]
	close: [reason: string]
	ready: []
	error: [Error]
}

export class VarhubLogger {
	#ws: WebSocket;
	#selfEventBox = new EventBox<VarhubLoggerEvents, typeof this>(this);
	
	#error: Error | undefined
	readonly #readyPromise: Promise<this>;
	readonly #hub: Varhub

	constructor(ws: WebSocket, hub: Varhub) {
		this.#ws = ws;
		this.#hub = hub;
		
		this.#ws.addEventListener("open", () => {
			this.#selfEventBox.dispatch("ready", []);
		}, { once: true });
		this.#ws.addEventListener("close", (event) => {
			this.#selfEventBox.dispatch("close", [event.reason]);
		}, { once: true });
		this.#ws.addEventListener("error", () => {
			this.#error = new Error(`websocket error`);
			this.#selfEventBox.dispatch("error", [this.#error]);
		}, { once: true });
		
		this.#readyPromise = new Promise((resolve, reject) => {
			this.once("ready", () => resolve(this));
			this.once("close", (error) => reject(error));
		});
		
		ws.addEventListener("message", (event) => {
			const binData = new Uint8Array(event.data as ArrayBuffer);
			const parsedData = parse(binData);
			this.#selfEventBox.dispatch("message", parsedData as any);
		});
	}
	
	get waitForReady(): Promise<this>{
		return this.#readyPromise;
	}
	
	get error(): Error | undefined {return this.#error }
	get hub(): Varhub {return this.#hub }
	
	get ready(): boolean {
		return this.#ws.readyState === WebSocket.OPEN;
	}

	close(reason?: string): void {
		this.#ws.close(4000, reason);
	}
	
	/**
	 * Subscribe on logger event
	 * @see {VarhubLogger#on}
	 * @param event
	 * @param handler
	 */
	on<T extends keyof VarhubLoggerEvents>(event: T, handler: (this: typeof this, ...args: VarhubLoggerEvents[T]) => void): this{
		this.#selfEventBox.subscriber.on(event, handler);
		return this;
	}
	/**
	 * Subscribe on logger event once
	 * @see {VarhubLogger#on}
	 * @param event
	 * @param handler
	 */
	once<T extends keyof VarhubLoggerEvents>(event: T, handler: (this: typeof this, ...args: VarhubLoggerEvents[T]) => void): this{
		this.#selfEventBox.subscriber.once(event, handler);
		return this;
	}
	
	/**
	 * Unsubscribe from logger event
	 * @see {VarhubLogger#on}
	 * @param event
	 * @param handler required!
	 */
	off<T extends keyof VarhubLoggerEvents>(event: T, handler: (this: typeof this, ...args: VarhubLoggerEvents[T]) => void): this{
		this.#selfEventBox.subscriber.off(event, handler);
		return this;
	}
}