import { parse, serialize, type XJData } from "@flinbein/xjmapper";
import { EventBox, type EventSubscriber } from "./EventBox.js";
import type { RoomJoinOptions, Varhub } from "./Varhub.js";
import { resolve } from "node:dns";


export type VarhubClientEvents = {
	message: XJData[]
	close: [reason: string|null]
	open: []
	error: []
}

export class VarhubClient {
	readonly #ws: WebSocket;
	
	readonly #selfEventBox = new EventBox<VarhubClientEvents, typeof this>(this);
	readonly #readyPromise: Promise<void>;
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
				this.#closed = false;
				this.#selfEventBox.dispatch("open", []);
			})
			this.#readyPromise = new Promise<void>((resolve, reject) => {
				this.on("open", () => {resolve()});
				this.on("close", () => {reject()});
			})
		} else {
			this.#ready = true;
			this.#readyPromise = Promise.resolve();
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
		this.#readyPromise.catch(() => {})
	}
	
	then<R1 = [this], R2 = never>(
		onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
		onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
	): PromiseLike<R1 | R2> {
		return this.#readyPromise.then(() => [this] as [this]).then(onfulfilled, onrejected);
	};
	
	get ready(): boolean { return this.#ready }
	get closed(): boolean { return this.#closed }
	
	send(...data: XJData[]){
		const rawData = serialize(...data);
		this.#ws.send(rawData);
	}
	
	/**
	 * subscribe on client event
	 * @param event "message", "open" or "close"
	 * @param handler event handler
	 */
	on<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
		this.#selfEventBox.subscriber.on(event, handler);
		return this;
	}
	/**
	 * Subscribe on client event once
	 * @see {VarhubClient#on}
	 * @param event
	 * @param handler
	 */
	once<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
		this.#selfEventBox.subscriber.once(event, handler);
		return this;
	}
	
	/**
	 * Unsubscribe from client event
	 * @see {VarhubClient#on}
	 * @param event
	 * @param handler required!
	 */
	off<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
		this.#selfEventBox.subscriber.off(event, handler);
		return this;
	}
	
	close(reason?: string|null){
		if (this.#ws.readyState === WebSocket.CLOSED || this.#ws.readyState === WebSocket.CLOSING) return;
		this.#ws.close(4000, reason ?? undefined);
	}
	
	[Symbol.dispose](){
		this.close("disposed");
	}
	
	[Symbol.asyncDispose](){
		if (this.#ws.readyState === WebSocket.CLOSED) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.#ws.close(4000, "disposed");
			this.#ws.addEventListener("close", () => resolve());
		});
	}
}