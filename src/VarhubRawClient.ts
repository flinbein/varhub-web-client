import { parse, serialize, type XJData } from "@flinbein/xjmapper";
import { EventBox, type EventSubscriber } from "./EventBox.js";
import type { RoomJoinOptions, Varhub } from "./Varhub.js";
import { resolve } from "node:dns";


type VarhubClientEvents = {
	message: XJData[]
	close: [reason: string|null]
	ready: []
	error: []
}

export class VarhubRawClient {
	readonly #ws: WebSocket;
	
	readonly #selfEventBox = new EventBox<VarhubClientEvents, typeof this>(this);
	readonly #readyPromise: Promise<this>;
	#ready = false;
	#closed = false;
	
	constructor(ws: WebSocket) {
		this.#ws = ws;
		ws.binaryType = "arraybuffer";
		if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
			throw new Error("websocket is closed");
		}
		if (ws.readyState === WebSocket.CONNECTING) {
			ws.addEventListener("open", (event) => {
				this.#ready = true;
				this.#closed = true;
				this.#selfEventBox.dispatch("ready", []);
			})
			this.#readyPromise = new Promise((resolve, reject) => {
				this.on("ready", () => {resolve(this)});
				this.on("close", () => {reject()});
			})
		} else {
			this.#ready = true;
			this.#readyPromise = Promise.resolve(this);
		}
		ws.addEventListener("message", (event) => {
			this.#selfEventBox.dispatch("message", [...parse(event.data)]);
		})
		ws.addEventListener("close", (event) => {
			this.#ready = false;
			this.#closed = true;
			this.#selfEventBox.dispatch("close", [event.reason]);
		})
		ws.addEventListener("error", (event) => {
			this.#ready = false;
			this.#closed = true;
			this.#selfEventBox.dispatch("error", []);
		})
	}
	
	get ready(): boolean { return this.#ready }
	get closed(): boolean { return this.#closed }
	
	/**
	 * Promise wait for ready status.
	 */
	get waitForReady(): Promise<this>{
		return this.#readyPromise;
	}
	
	send(...data: XJData[]){
		const rawData = serialize(...data);
		this.#ws.send(rawData);
	}
	
	/**
	 * subscribe on client event
	 * @param event "message", "ready" or "close"
	 * @param handler event handler
	 */
	on<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
		this.#selfEventBox.subscriber.on(event, handler);
		return this;
	}
	/**
	 * Subscribe on client event once
	 * @see {VarhubRawClient#on}
	 * @param event
	 * @param handler
	 */
	once<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
		this.#selfEventBox.subscriber.once(event, handler);
		return this;
	}
	
	/**
	 * Unsubscribe from client event
	 * @see {VarhubRawClient#on}
	 * @param event
	 * @param handler required!
	 */
	off<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
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