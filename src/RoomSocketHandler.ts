import { parse, serialize, XJData } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";

/**
 * {@link RoomSocketHandler} events
 * @group Events
 * */
export type RoomSocketHandlerEvents = {
	connection: [connection: Connection, ...args: XJData[]];
	connectionOpen: [connection: Connection];
	connectionClose: [connection: Connection, reason: string | null, wasOnline: boolean];
	connectionMessage: [connection: Connection, ...args: XJData[]];
	error: [];
	init: [];
	close: [];
}

/**
 * Client-side room handler.
 * It allows you to handle room events and send messages to connected clients.
 * @example
 * ```typescript
 * import {Varhub} from "@flinbein/varhub-web-client";
 *
 * const hub = new Varhub("https://example.com/varhub/");
 * const room: RoomSocketHandler = hub.createRoomSocket();
 * await room;
 * console.log(room.id);
 * ```
 */
export class RoomSocketHandler {
	#ws: WebSocket;
	#id: string|null = null;
	#integrity: string|null = null;
	#wsEventBox = new EventEmitter<any>();
	#selfEventBox = new EventEmitter<RoomSocketHandlerEvents>();
	#publicMessage: string|null = null;
	#initResolver = Promise.withResolvers<void>();
	#ready = false;
	#closed = false;
	#connectionsLayer: ConnectionsLayer;
	
	/** @hidden */
	constructor(ws: WebSocket) {
		this.#ws = ws;
		this.#initResolver.promise.catch(() => {});
		ws.binaryType = "arraybuffer";
		this.#connectionsLayer = new ConnectionsLayer(this.#selfEventBox, this.#action);
		ws.addEventListener("message", (event: MessageEvent) => {
			const [eventName, ...params] = parse(event.data);
			this.#wsEventBox.emitWithTry(String(eventName), ...params);
		});
		ws.addEventListener("close", (event) => {
			this.#closed = true;
			this.#ready = false;
			this.#selfEventBox.emitWithTry("close");
			this.#initResolver.reject(new Error(event.reason));
		})
		ws.addEventListener("error", () => {
			this.#closed = true;
			this.#ready = false;
			this.#selfEventBox.emitWithTry("error");
			this.#initResolver.reject(new Error("unknown websocket error"));
		})
		this.#wsEventBox.on("connectionEnter", (conId, ...args) => {
			this.#connectionsLayer.onEnter(conId, ...args);
		});
		this.#wsEventBox.on("connectionJoin", (conId) => {
			this.#connectionsLayer.onJoin(conId);
		});
		this.#wsEventBox.on("connectionClosed", (conId, wasOnline, message) => {
			this.#connectionsLayer.onClose(conId, wasOnline, message);
		});
		this.#wsEventBox.on("connectionMessage", (conId, ...args) => {
			this.#connectionsLayer.onMessage(conId, ...args);
		});
		this.#wsEventBox.on("init", (roomId: string, publicMessage?: string, integrity?: string) => {
			this.#id = roomId;
			this.#publicMessage = publicMessage ?? null;
			this.#integrity = integrity ?? null;
			this.#initResolver.resolve();
			this.#ready = true;
			this.#selfEventBox.emitWithTry("init");
		});
	}
	
	/**
	 * Promise like for events "init", "error"
	 * ### Using in async context
	 * @example
	 * ```typescript
	 * const room = varhub.createRoomSocket();
	 * try {
	 *   await room;
	 *   console.log("room ready");
	 * } catch (error) {
	 *   console.log("room error");
	 * }
	 * ```
	 * @example
	 * ```typescript
	 * const [room] = await varhub.createRoomSocket();
	 * ```
	 * ### Using in sync context
	 * @example
	 * ```typescript
	 * varhub.createRoomSocket().then(([room]) => {
	 *   console.log("room ready", room.id);
	 * });
	 * ```
	 * @param onfulfilled
	 * @param onrejected
	 */
	
	then<R1 = [this], R2 = never>(
		onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
		onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
	): PromiseLike<R1 | R2> {
		return this.#initResolver.promise.then(() => [this] as [this]).then(onfulfilled, onrejected);
	};
	
	/**
	 * get all connections
	 * @param [filter] filter connections, optional.
	 * @param {boolean} [filter.ready] get only ready (or not ready) connections.
	 * @param {boolean} [filter.deferred] get only deferred (or not deferred) connections.
	 * @param {boolean} [filter.closed] get only closed (or not closed) connections.
	 * @return connections found
	 */
	getConnections(filter?: {ready?: boolean, deferred?: boolean, closed?: boolean}): Set<Connection>{
		return this.#connectionsLayer.getConnections(filter);
	}
	
	/**
	 * room is created and `room.id` is defined
	 */
	get ready(): boolean { return this.#ready; }
	/**
	 * room is closed
	 */
	get closed(): boolean { return this.#closed; }
	
	/**
	 * public message of the room.
	 */
	get message(){
		return this.#publicMessage;
	}
	
	/**
	 * change public message of the room. Set null to make room private.
	 * @param value
	 */
	set message(msg: string|null) {
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("websocket is not ready");
		const oldMsg = this.#publicMessage;
		if (oldMsg === msg) return;
		this.#publicMessage = msg;
		this.#action("publicMessage", msg);
	}
	
	#action = (cmd: string, ...args: any) => {
		this.#ws.send(serialize(cmd, ...args));
	}
	
	/**
	 * room id
	 */
	get id(): string | null {
		return this.#id;
	}
	
	/**
	 * room integrity
	 */
	get integrity(): string | null {
		return this.#integrity;
	}
	
	/**
	 * send message to all ready connections.
	 */
	broadcast(...msg: any[]) {
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("websocket is not ready");
		this.#ws.send(serialize("broadcast", ...msg));
		return this;
	}
	
	/**
	 * destroy this room.
	 */
	destroy() {
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("websocket is not ready");
		this.#ws.send(serialize("destroy"));
		this.#ws.close();
	}
	
	/**
	 * @event
	 * @template {keyof RoomSocketHandlerEvents} T
	 * subscribe on event
	 * @param {keyof RoomSocketHandlerEvents} event "init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"
	 * @param {(...args: RoomSocketHandlerEvents[T]) => void} handler event handler
	 * @see RoomSocketHandlerEvents
	 */
	on<T extends keyof RoomSocketHandlerEvents>(event: T, handler: (this: typeof this, ...args: RoomSocketHandlerEvents[T]) => void): this{
		this.#selfEventBox.on.call(this, event, handler as any);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof RoomSocketHandlerEvents} T
	 * subscribe on event once
	 * @param {keyof RoomSocketHandlerEvents} event "init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"
	 * @param {(...args: RoomSocketHandlerEvents[T]) => void} handler event handler
	 * @see RoomSocketHandlerEvents
	 */
	once<T extends keyof RoomSocketHandlerEvents>(event: T, handler: (this: typeof this, ...args: RoomSocketHandlerEvents[T]) => void): this{
		this.#selfEventBox.once.call(this, event, handler as any);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof RoomSocketHandlerEvents} T
	 * unsubscribe from event
	 * @param {keyof RoomSocketHandlerEvents} event "init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"
	 * @param {(...args: RoomSocketHandlerEvents[T]) => void} handler event handler
	 * @see RoomSocketHandlerEvents
	 */
	off<T extends keyof RoomSocketHandlerEvents>(event: T, handler: (this: typeof this, ...args: RoomSocketHandlerEvents[T]) => void): this{
		this.#selfEventBox.off.call(this, event, handler as any);
		return this;
	}
	
	/**
	 * destroy this room
	 */
	[Symbol.dispose](){
		if (this.#ws.readyState === WebSocket.CLOSED) return;
		this.#ws.close();
	}
	
	/**
	 * destroy this room and wait for websocket to close
	 */
	[Symbol.asyncDispose](){
		if (this.#ws.readyState === WebSocket.CLOSED) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.#ws.addEventListener("close", () => resolve());
			this.#ws.addEventListener("error", () => resolve());
			this.#ws.close();
		});
	}
}

/** @hidden */
class ConnectionsLayer {
	connections: Map<number, Connection> = new Map();
	readyConnections: WeakSet<Connection> = new Set();
	connectionEmitters: WeakMap<Connection, EventEmitter<any>> = new WeakMap();
	
	constructor(public roomEmitter: EventEmitter<any>, public roomAction: (...args: any) => void) {
	
	}
	
	onEnter(id: number, ...parameters: XJData[]): Connection {
		const connection = new Connection(id, parameters, this);
		this.connections.set(id, connection);
		this.roomEmitter.emitWithTry("connection", connection, ...parameters);
		if (!connection.deferred) connection.open();
		return connection;
	}
	
	onJoin(conId: number){
		const connection = this.connections.get(conId);
		if (!connection) return;
		if (this.readyConnections.has(connection)) return;
		this.readyConnections.add(connection);
		this.getConnectionEmitter(connection).emitWithTry("open");
		this.roomEmitter.emitWithTry("connectionOpen", connection);
	}
	
	onClose(conId: number, wasOnline: boolean, message: string|null){
		const connection = this.connections.get(conId);
		if (!connection) return;
		this.connections.delete(conId);
		this.readyConnections.delete(connection);
		this.getConnectionEmitter(connection).emitWithTry("close", message, wasOnline);
		this.roomEmitter.emitWithTry("connectionClose", connection, message, wasOnline);
	}
	
	onMessage(conId: number, ...msg: XJData[]){
		const connection = this.connections.get(conId);
		if (!connection) return;
		this.getConnectionEmitter(connection).emitWithTry("message", ...msg);
		this.roomEmitter.emitWithTry("connectionMessage", connection, ...msg);
	}
	
	getConnections(options?: {ready?: boolean, deferred?: boolean, closed?: boolean}): Set<Connection>{
		const connectionsList = [...this.connections.values()];
		return new Set(connectionsList.filter((con) => {
			if (options) for (let key of Object.keys(options)) {
				if ((con as any)[key] !== (options as any)[key]) return false;
			}
			return true;
		}));
	}
	
	isReady(conId: number) {
		const con = this.connections.get(conId);
		return con ? this.readyConnections.has(con) : false;
	}
	
	join(conId: number){
		this.onJoin(conId);
		this.roomAction("join", conId);
	}
	
	isClosed(conId: number) {
		return !this.connections.has(conId);
	}
	
	send(id: number, ...args: XJData[]) {
		this.roomAction("send", id, ...args);
	}
	
	close(id: number, reason?: string|null) {
		const connection = this.connections.get(id);
		const wasOnline = connection && this.readyConnections.has(connection);
		this.onClose(id, Boolean(wasOnline), reason ?? null);
		this.roomAction("kick", id, reason ?? null);
	}
	
	getConnectionEmitter(con: Connection){
		let emitter = this.connectionEmitters.get(con);
		if (!emitter) {
			emitter = new EventEmitter();
			this.connectionEmitters.set(con, emitter);
		}
		return emitter;
	}
}

/**
 * Events of {@link Connection}
 * @event
 * */
export type ConnectionEvents = {
	/**
	 * connection successfully opened
	 * @example
	 * ```typescript
	 * connection.on("open", () => {
	 *   console.log("connection opened!");
	 *   console.assert(connection.ready);
	 * });
	 * connection.open();
	 * ```
	 */
	open: [];
	/**
	 * connection closed
	 * @example
	 * ```typescript
	 * connection.on("close", (reason: string|null, wasOpen: boolean) => {
	 *   console.log("connection closed by reason:", reason);
	 *   console.assert(connection.closed);
	 * })
	 * ```
	 */
	close: [reason: string|null, wasOnline: boolean];
	/**
	 * received message from connection
	 * @example
	 * ```typescript
	 * connection.on("message", (...data) => {
	 *   console.log("received from connection:", data);
	 *   console.assert(connection.ready);
	 * })
	 * ```
	 */
	message: XJData[];
}

/**
 * Handler of room connection
 * @group Classes
 */
class Connection {
	#id: number;
	#parameters: XJData[];
	#handle: ConnectionsLayer
	#subscriber
	#initResolver = Promise.withResolvers<void>();
	#deferred = false;

	/** @hidden */
	constructor(id: number, parameters: XJData[], handle: ConnectionsLayer){
		this.#id = id;
		this.#handle = handle;
		this.#parameters = parameters;
		const subscriber = this.#subscriber = this.#handle.getConnectionEmitter(this);
		subscriber.on("open", () => this.#initResolver.resolve())
		subscriber.on("close", (reason) => this.#initResolver.reject(reason));
		this.#initResolver.promise.catch(() => {});
	}
	
	/**
	 * Promise like for events "open", "error"
	 * ### Using in async context
	 * @example
	 * ```typescript
	 * try {
	 *   await connection;
	 *   console.log("client connected");
	 * } catch (error) {
	 *   console.log("connection error");
	 * }
	 * ```
	 * ### Using in sync context
	 * @example
	 * ```
	 * connection.then(([connection]) => {
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
		return this.#initResolver.promise.then(() => [this] as [this]).then(onfulfilled, onrejected);
	};
	
	/**
	 * get the parameters with which the connection was initialized
	 */
	get parameters() {
		return this.#parameters;
	}
	
	/**
	 * connection is deferred
	 */
	get deferred() {
		return this.#deferred && !this.ready && !this.closed;
	}
	
	/**
	 * defer connection establishment.
	 * Use this method if you need to perform an asynchronous check to get permission to connect.
	 * @example
	 * ```typescript
	 * room.on("connection", (connection, ...args) => {
	 *   void connection.defer(checkConnection, ...args);
	 *   console.assert(connection.deferred);
	 *   console.assert(!connection.ready);
	 *   console.assert(!connection.closed);
	 * })
	 * async function checkConnection(connection, ...args) {
	 *   const permitted: boolean = await checkConnectionPermits(connection, args);
	 *   if (!permitted) connection.close("not permitted"); // or throw error
	 * }
	 * ```
	 * @param handler
	 * - If the handler completes or resolves successfully, the connection will be opened.
	 * - If the handler throws or rejects an error, the connection will be closed with this error.
	 * - You can close the connection earlier by calling `connection.close(reason)`.
	 * - You can open the connection earlier by calling `connection.open()`.
	 * @param args additional arguments for handler
	 * @returns the result of handler or throws error
	 */
	defer<T, A extends any[]>(handler: (this: this, connection: this, ...args: A) => T, ...args: A): T {
		this.#deferred = true;
		try {
			const result = handler.call(this, this, ...args);
			if (result && typeof result === "object" && "then" in result && typeof result.then === "function") {
				return result.then(
					(val: any) => {
						if (this.deferred) this.open();
						return val;
					},
					(error: any) => {
						if (this.deferred) this.close(error == null ? error : String(error));
						throw error;
					}
				);
			}
			return result;
		} catch (e) {
			this.close(e == null ? null : String(e));
			throw e;
		}
	}
	
	/**
	 * connection open
	 */
	get ready(){
		return this.#handle.isReady(this.#id)
	}
	
	/**
	 * connection closed
	 */
	get closed(){
		return this.#handle.isClosed(this.#id);
	}
	
	/**
	 * Allow the connection to connect
	 *
	 * The connection is connected automatically if it has not been deferred.
	 */
	open(){
		this.#handle.join(this.#id);
		return this;
	}
	
	/**
	 * send data to connection
	 * @param data any serializable arguments
	 */
	send(...data: XJData[]){
		this.#handle.send(this.#id, ...data);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof ConnectionEvents} T
	 * subscribe on event
	 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
	 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
	 */
	on<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this {
		this.#subscriber.on(eventName, handler);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof ConnectionEvents} T
	 * subscribe on event once
	 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
	 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
	 */
	once<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this {
		this.#subscriber.once(eventName, handler);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof ConnectionEvents} T
	 * unsubscribe from event
	 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
	 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
	 */
	off<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this {
		this.#subscriber.off(eventName, handler);
		return this;
	}
	
	/**
	 * close client's connection
	 * @param reason
	 */
	close(reason?: string|null){
		this.#handle.close(this.#id, reason);
	}

	toString(){
		return "Connection("+this.#id+")";
	}

	valueOf() {
		return this.#id;
	}
}
export type { Connection };
