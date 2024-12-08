import { parse, serialize, type XJData } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";
import type {RoomDesc} from "./RoomSocketHandler.js";

/**
 * Events of {@link VarhubClient }
 * @event
 * */
export type VarhubClientEvents<DESC extends RoomDesc> = {
	/**
	 * client received a message from the room
	 * @example
	 * ```typescript
	 * client.on("message", (...data: XJData[]) => {
	 *   console.log("client received:", data);
	 *   console.assert(client.ready);
	 * })
	 * ```
	 */
	message: DESC extends {roomMessage: infer R extends any[]} ? R : XJData[]
	/**
	 * client's connection closed
	 * @example
	 * ```typescript
	 * client.on("close", (reason: string|null, wasOnline: boolean) => {
	 *   console.log("client closed by reason:", reason);
	 *   console.assert(client.closed);
	 * })
	 * ```
	 */
	close: [reason: string|null, wasOnline: boolean]
	/**
	 * client's connection successfully opened
	 * @example
	 * ```typescript
	 * client.on("open", () => {
	 *   console.log("client ready now!");
	 *   console.assert(client.ready);
	 * })
	 * ```
	 */
	open: []
	/**
	 * client connection was closed while trying to connect
	 * @example
	 * ```typescript
	 * client.on("error", (asyncError) => {
	 *   console.log("client can not be connected because:", await asyncError );
	 *   console.assert(client.closed);
	 * })
	 * ```
	 */
	error: [asyncError: Promise<any>]
}

const getNoError = async () => undefined;

/**
 * Represents a user-controlled connection to the room;
 * @example
 * ```typescript
 * import { Varhub } from "@flinbein/varhub-web-client";
 *
 * const hub = new Varhub("https://example.com");
 * const client: VarhubClient = hub.join(roomId);
 * await client;
 * client.send("some message");
 * ```
 */
export class VarhubClient<DESC extends Record<keyof RoomDesc, any> extends DESC ? RoomDesc : never = {}> {
	readonly #ws: WebSocket;
	
	readonly #selfEvents = new EventEmitter<VarhubClientEvents<DESC>>();
	#resolver = Promise.withResolvers<this>();
	#ready = false;
	#closed = false;
	
	/** @hidden */
	constructor(ws: WebSocket, getErrorLog: () => Promise<any> = getNoError) {
		this.#ws = ws;
		this.#resolver.promise.catch(() => {});
		ws.binaryType = "arraybuffer";
		if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
			throw new Error("websocket is closed");
		}
		if (ws.readyState === WebSocket.CONNECTING) {
			ws.addEventListener("open", () => {
				this.#ready = true;
				this.#closed = false;
				this.#selfEvents.emitWithTry("open");
				this.#resolver.resolve(this);
			})
		} else {
			this.#ready = true;
			this.#resolver.resolve(this);
		}
		ws.addEventListener("message", (event) => {
			this.#selfEvents.emitWithTry("message", ...parse(event.data) as any);
		})
		ws.addEventListener("close", (event) => {
			const wasReady = this.#ready;
			this.#ready = false;
			this.#closed = true;
			this.#selfEvents.emitWithTry("close", event.reason, wasReady);
		})
		ws.addEventListener("error", () => {
			this.#ready = false;
			this.#closed = true;
			const errorPromise = getErrorLog ? getErrorLog() : Promise.resolve(undefined);
			this.#selfEvents.emitWithTry("error", errorPromise);
			this.#resolver.reject(new Error("websocket closed", {cause: errorPromise}));
		})
	}
	
	get promise(): Promise<this> {
		return this.#resolver.promise;
	}
	
	/**
	 * client is successfully joined to the room.
	 */
	get ready(): boolean { return this.#ready }
	
	/**
	 * client's connection is closed
	 */
	get closed(): boolean { return this.#closed }
	
	/**
	 * send data to room handler
	 * @param data any serializable arguments
	 */
	send(...data: DESC extends {clientMessage: infer R extends any[]} ? R : XJData[]): this {
		const rawData = serialize(...data);
		this.#ws.send(rawData);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof VarhubClientEvents} T
	 * subscribe on client event
	 * @param {keyof VarhubClientEvents} event "message", "open", "close" or "error"
	 * @param {(...args: VarhubClientEvents[T]) => void} handler event handler
	 */
	on<T extends keyof VarhubClientEvents<DESC>>(event: T, handler: (this: this, ...args: VarhubClientEvents<DESC>[T]) => void): this{
		this.#selfEvents.on.call(this, event, handler as any);
		return this;
	}
	/**
	 * @event
	 * @template {keyof VarhubClientEvents} T
	 * Subscribe on client event once
	 * @see {VarhubClient#on}
	 * @param {keyof VarhubClientEvents} event
	 * @param {(...args: VarhubClientEvents[T]) => void} handler
	 */
	once<T extends keyof VarhubClientEvents<DESC>>(event: T, handler: (this: this, ...args: VarhubClientEvents<DESC>[T]) => void): this{
		this.#selfEvents.once.call(this, event, handler as any);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof VarhubClientEvents} T
	 * Unsubscribe from client event
	 * @see {VarhubClient#on}
	 * @param {keyof VarhubClientEvents} event
	 * @param {(...args: VarhubClientEvents[T]) => void} handler
	 */
	off<T extends keyof VarhubClientEvents<DESC>>(event: T, handler: (this: this, ...args: VarhubClientEvents<DESC>[T]) => void): this{
		this.#selfEvents.off.call(this, event, handler as any);
		return this;
	}
	
	/**
	 * close client's connection
	 * @param reason
	 */
	close(reason?: string|null): void {
		if (this.#ws.readyState === WebSocket.CLOSED || this.#ws.readyState === WebSocket.CLOSING) return;
		this.#ws.close(4000, reason ?? undefined);
	}
	
	[Symbol.dispose](): void {
		this.close("disposed");
	}
	
	[Symbol.asyncDispose](): Promise<void> {
		if (this.#ws.readyState === WebSocket.CLOSED) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.#ws.close(4000, "disposed");
			this.#ws.addEventListener("close", () => resolve());
		});
	}
}