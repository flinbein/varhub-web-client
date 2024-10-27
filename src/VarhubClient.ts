import { parse, serialize, type XJData } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";

/**
 * Events of {@link VarhubClient }
 * @event
 * */
export type VarhubClientEvents = {
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
	message: XJData[]
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
	 * client.on("error", () => {
	 *   console.log("client can not be connected" );
	 *   console.assert(client.closed);
	 * })
	 * ```
	 */
	error: []
}

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
export class VarhubClient {
	readonly #ws: WebSocket;
	
	readonly #selfEvents = new EventEmitter<VarhubClientEvents>();
	readonly #readyPromise: Promise<void>;
	#ready = false;
	#closed = false;
	
	/** @hidden */
	constructor(ws: WebSocket) {
		this.#ws = ws;
		ws.binaryType = "arraybuffer";
		if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
			throw new Error("websocket is closed");
		}
		if (ws.readyState === WebSocket.CONNECTING) {
			ws.addEventListener("open", () => {
				this.#ready = true;
				this.#closed = false;
				this.#selfEvents.emitWithTry("open");
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
			this.#selfEvents.emitWithTry("message", ...parse(event.data));
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
			this.#selfEvents.emitWithTry("error");
		})
		this.#readyPromise.catch(() => {})
	}
	
	/**
	 * Promise like for events "open", "error"
	 * ### Using in async context
	 * @example
	 * ```typescript
	 * const client = varhub.join(roomId);
	 * try {
	 *   await client;
	 *   console.log("client connected");
	 * } catch (error) {
	 *   console.log("connection error");
	 * }
	 * ```
	 * @example
	 * ```typescript
	 * const [client] = await varhub.join(roomId);
	 * ```
	 * ### Using in sync context
	 * @example
	 * ```typescript
	 * varhub.join(roomId).then(([client]) => {
	 *   console.log("client connected");
	 * });
	 * ```
	 * @param onfulfilled
	 * @param onrejected
	 */
	then<R1 = [this], R2 = never>(
		onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
		onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
	): PromiseLike<R1 | R2> {
		return this.#readyPromise.then(() => [this] as [this]).then(onfulfilled, onrejected);
	};
	
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
	send(...data: XJData[]): this {
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
	on<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
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
	once<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
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
	off<T extends keyof VarhubClientEvents>(event: T, handler: (this: typeof this, ...args: VarhubClientEvents[T]) => void): this{
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