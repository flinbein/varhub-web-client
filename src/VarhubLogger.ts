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
	readonly #id: string;
	#ws: WebSocket;
	#selfEventBox = new EventBox<VarhubLoggerEvents, typeof this>(this);
	
	#error: Error | undefined
	readonly #hub: Varhub

	constructor(ws: WebSocket, hub: Varhub, id: string) {
		this.#ws = ws;
		this.#hub = hub;
		this.#id = id;
		
		this.#ws.addEventListener("close", (event) => {
			this.#selfEventBox.dispatch("close", [event.reason]);
		}, { once: true });
		
		ws.addEventListener("message", (event) => {
			const binData = new Uint8Array(event.data as ArrayBuffer);
			const parsedData = parse(binData);
			this.#selfEventBox.dispatch("message", parsedData as any);
		});
	}
	
	get id(): string {return this.#id }
	get error(): Error | undefined {return this.#error }
	get hub(): Varhub {return this.#hub }
	
	get online(): boolean {
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