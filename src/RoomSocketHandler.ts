import { parse, serialize, XJData } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";

const enum ROOM_EVENT {
	INIT = 0,
	MESSAGE_CHANGE = 1,
	CONNECTION_JOIN = 2,
	CONNECTION_ENTER = 3,
	CONNECTION_MESSAGE = 4,
	CONNECTION_CLOSED = 5,
}
const enum ROOM_ACTION {
	JOIN = 0,
	KICK = 1,
	PUBLIC_MESSAGE = 2,
	DESTROY = 3,
	SEND = 4,
	BROADCAST = 5,
}

export type RoomDesc = {
	data?: any,
	parameters?: XJData[],
	clientMessage?: XJData[],
	roomMessage?: XJData[],
}

type OverrideKeys<A, B> = {[K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never }
type RoomValidator = {
	parameters?: ((params: XJData[]) => XJData[] | undefined | null | false) | ((params: XJData[]) => params is XJData[]),
	clientMessage?: ((params: XJData[]) => XJData[] | undefined | null | false) | ((params: XJData[]) => params is XJData[])
}
type ApplyRoomValidator<DESC extends RoomDesc, VAL extends RoomValidator> = (
	Pick<VAL, keyof RoomValidator & keyof VAL> extends infer P ?
	{
		[K in keyof P]: P[K] extends (args: XJData[]) => args is (infer R extends XJData[]) ? R : P[K] extends (args: XJData[]) => (infer R) ? Extract<R, any[]> : never
	} extends infer T ?
	OverrideKeys<DESC, T>
	: never : never
)

/**
 * {@link RoomSocketHandler} events
 * @group Events
 * */
export type RoomSocketHandlerEvents<DESC extends RoomDesc = {}> = {
	/**
	 * new connection initialized
	 * @example
	 * ```ts
	 * room.on("connection", (connection, ...params) => {
	 *   connection.open(); // need to open before call con.send()
	 *   console.log("someone connected with params", params);
	 *   connection.send("Welcome!");
	 * })
	 * ```
	 * After the event is processed, the connection will be automatically opened (if {@link Connection#close} or {@link Connection#defer} was not called).
	 * */
	connection: [connection: Connection<DESC>, ...args: DESC extends {parameters: infer T extends any[]} ? T : XJData[]];
	/**
	 * connection successfully opened
	 * @example
	 * ```ts
	 * room.on("connectionOpen", (con) => {
	 *   con.send("Welcome!");
	 * })
	 * ```
	 * */
	connectionOpen: [connection: Connection<DESC>];
	/**
	 * connection closed
	 * @example
	 * ```ts
	 * room.on("connectionClose", (con, reason, wasOpen) => {
	 *   console.log("connection closed by reason:", reason);
	 * })
	 * ```
	 * */
	connectionClose: [connection: Connection<DESC>, reason: string | null, wasOnline: boolean];
	/**
	 * received a message from connection
	 * @example
	 * ```ts
	 * room.on("connectionMessage", (con, ...data) => {
	 *   console.log("got message:", data);
	 * })
	 * ```
	 * */
	connectionMessage: [connection: Connection<DESC>, ...args: DESC extends {clientMessage: infer T extends any[]} ? T : XJData[]];
	/**
	 * error creating room
	 * @example
	 * ```typescript
	 * client.on("error", (asyncError) => {
	 *   console.log("room can not be created because:", await asyncError );
	 *   console.assert(room.closed);
	 * })
	 * ```
	 */
	error: [asyncError: Promise<any>];
	ready: [];
	close: [];
}

export namespace RoomSocketHandler {
	export type ConnectionOf<T extends RoomSocketHandler> = T extends RoomSocketHandler<infer R> ? Connection<R> : never;
	export type DataOf<T extends RoomSocketHandler> = T extends RoomSocketHandler<infer R> ? R["data"] : never;
	export type ParametersOf<T extends RoomSocketHandler> = T extends RoomSocketHandler<infer R> ? R["parameters"] : never;
	export type RoomMessageOf<T extends RoomSocketHandler> = T extends RoomSocketHandler<infer R> ? R["roomMessage"] : never;
	export type ClientMessageOf<T extends RoomSocketHandler> = T extends RoomSocketHandler<infer R> ? R["clientMessage"] : never;
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
 * await room.promise;
 * console.log(room.id);
 * ```
 */
export class RoomSocketHandler<DESC extends Record<keyof RoomDesc, any> extends DESC ? RoomDesc : never = {}> {
	#ws: WebSocket;
	#id: string|null = null;
	#integrity: string|null = null;
	#wsEvents = new EventEmitter<any>();
	#selfEvents = new EventEmitter<RoomSocketHandlerEvents>();
	#publicMessage: string|null = null;
	#initResolver = Promise.withResolvers<this>();
	#ready = false;
	#closed = false;
	#connectionsLayer: ConnectionsLayer;
	
	/** @hidden */
	constructor(ws: WebSocket, getErrorLog?: () => Promise<any>) {
		this.#ws = ws;
		this.#initResolver.promise.catch(() => {});
		ws.binaryType = "arraybuffer";
		this.#connectionsLayer = new ConnectionsLayer(this.#selfEvents, this.#action, this.#runWithContext);
		ws.addEventListener("message", (event: MessageEvent) => {
			const [eventName, ...params] = parse(event.data);
			this.#wsEvents.emitWithTry(eventName as any, ...params);
		});
		ws.addEventListener("close", (event) => {
			this.#closed = true;
			this.#ready = false;
			this.#selfEvents.emitWithTry("close");
		})
		ws.addEventListener("error", () => {
			this.#closed = true;
			this.#ready = false;
			const errorPromise = getErrorLog ? getErrorLog() : Promise.resolve(undefined);
			this.#selfEvents.emitWithTry("error", errorPromise);
			this.#initResolver.reject(new Error("websocket closed", {cause: errorPromise}));
		})
		this.#wsEvents.on(ROOM_EVENT.CONNECTION_ENTER, (conId, ...args) => {
			if (!this.#parametersValidator) return this.#connectionsLayer.onEnter(conId, ...args);
			try {
				const validateResult = this.#parametersValidator(args);
				if (!validateResult) return this.#connectionsLayer.roomAction(ROOM_ACTION.KICK, conId, "invalid parameters");
				this.#connectionsLayer.onEnter(conId, ...(Array.isArray(validateResult) ? validateResult : args));
			} catch {
				this.#connectionsLayer.roomAction(ROOM_ACTION.KICK, conId, "invalid parameters");
			}
		});
		this.#wsEvents.on(ROOM_EVENT.CONNECTION_JOIN, (conId) => {
			this.#connectionsLayer.onJoin(conId);
		});
		this.#wsEvents.on(ROOM_EVENT.CONNECTION_CLOSED, (conId, wasOnline, message) => {
			this.#connectionsLayer.onClose(conId, wasOnline, message);
		});
		this.#wsEvents.on(ROOM_EVENT.CONNECTION_MESSAGE, (conId, ...args) => {
			if (!this.#clientMessageValidator) return this.#connectionsLayer.onMessage(conId, ...args);
			try {
				const validateResult = this.#clientMessageValidator(args);
				if (!validateResult) return this.#connectionsLayer.close(conId, "invalid message");
				this.#connectionsLayer.onMessage(conId, ...(Array.isArray(validateResult) ? validateResult : args));
			} catch {
				this.#connectionsLayer.close(conId, "invalid message");
			}
		});
		this.#wsEvents.on(ROOM_EVENT.INIT, (roomId: string, publicMessage?: string, integrity?: string) => {
			this.#id = roomId;
			this.#publicMessage = publicMessage ?? null;
			this.#integrity = integrity ?? null;
			this.#initResolver.resolve(this);
			this.#ready = true;
			this.#selfEvents.emitWithTry("ready");
		});
	}
	
	withType<
		PARTIAL_DESC extends Record<keyof RoomDesc, any> extends PARTIAL_DESC ? RoomDesc : never = {}
	>(): OverrideKeys<DESC, PARTIAL_DESC> extends infer T extends (Record<keyof RoomDesc, any> extends T ? RoomDesc : never) ? RoomSocketHandler<T> : never {
		return this as any;
	}
	
	#clientMessageValidator?: RoomValidator["clientMessage"];
	#parametersValidator?: RoomValidator["parameters"];
	validate<V extends RoomValidator>(
		{clientMessage, parameters}: V
	): ApplyRoomValidator<DESC, V> extends infer T extends (Record<keyof RoomDesc, any> extends T ? RoomDesc : never) ? RoomSocketHandler<T> : never {
		this.#clientMessageValidator = clientMessage;
		this.#parametersValidator = parameters;
		return this as any;
	}
	
	get promise() {
		return this.#initResolver.promise;
	}
	
	/**
	 * get all connections
	 * @param [filter] filter connections, optional.
	 * @param {boolean} [filter.ready] get only ready (or not ready) connections.
	 * @param {boolean} [filter.deferred] get only deferred (or not deferred) connections.
	 * @param {boolean} [filter.closed] get only closed (or not closed) connections.
	 * @return connections found
	 */
	getConnections(filter?: {ready?: boolean, deferred?: boolean, closed?: boolean}): Set<Connection<DESC>>{
		return this.#connectionsLayer.getConnections(filter);
	}
	
	#context: any = undefined;
	#runWithContext = <T extends (...args: any) => any>(value: any, fn: T, ...args: Parameters<T>): ReturnType<T> => {
		try {
			this.#context = value;
			return fn(...args);
		} finally {
			this.#context = undefined;
		}
	}
	
	/**
	 * Get current {@link Connection} in scope or throws error.
	 * Use this method in room event handlers or RPC methods.
	 * `useConnection` allowed to be called only in sync code.
	 * ```javascript
	 * export async function remoteMethod(){
	 *   const con = room.useConnection(); // OK
	 *   await something();
	 *   const con = room.useConnection(); // throws
	 * }
	 * ```
	 * @returns Connection
	 */
	useConnection(): Connection<DESC> {
		if (this.#context?.connection == null) throw new Error("useContext error: context is undefined");
		return this.#context?.connection;
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
	 * @param msg
	 */
	set message(msg: string|null) {
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("websocket is not ready");
		const oldMsg = this.#publicMessage;
		if (oldMsg === msg) return;
		this.#publicMessage = msg;
		this.#action(ROOM_ACTION.PUBLIC_MESSAGE, msg);
	}
	
	#action = (cmd: ROOM_ACTION, ...args: any) => {
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
		this.#action(ROOM_ACTION.BROADCAST, ...msg);
		return this;
	}
	
	/**
	 * destroy this room.
	 */
	destroy() {
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("websocket is not ready");
		this.#action(ROOM_ACTION.DESTROY);
		this.#ws.close();
	}
	
	/**
	 * @event
	 * @template {keyof RoomSocketHandlerEvents} T
	 * subscribe on event
	 * @param {keyof RoomSocketHandlerEvents} event "ready", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"
	 * @param {(...args: RoomSocketHandlerEvents[T]) => void} handler event handler
	 * @see RoomSocketHandlerEvents
	 */
	on<T extends keyof RoomSocketHandlerEvents<DESC>>(event: T, handler: (this: this, ...args: RoomSocketHandlerEvents<DESC>[T]) => void): this{
		this.#selfEvents.on.call(this, event, handler as any);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof RoomSocketHandlerEvents} T
	 * subscribe on event once
	 * @param {keyof RoomSocketHandlerEvents} event "ready", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"
	 * @param {(...args: RoomSocketHandlerEvents[T]) => void} handler event handler
	 * @see RoomSocketHandlerEvents
	 */
	once<T extends keyof RoomSocketHandlerEvents<DESC>>(event: T, handler: (this: this, ...args: RoomSocketHandlerEvents<DESC>[T]) => void): this{
		this.#selfEvents.once.call(this, event, handler as any);
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof RoomSocketHandlerEvents} T
	 * unsubscribe from event
	 * @param {keyof RoomSocketHandlerEvents} event "ready", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"
	 * @param {(...args: RoomSocketHandlerEvents[T]) => void} handler event handler
	 * @see RoomSocketHandlerEvents
	 */
	off<T extends keyof RoomSocketHandlerEvents<DESC>>(event: T, handler: (this: this, ...args: RoomSocketHandlerEvents<DESC>[T]) => void): this{
		this.#selfEvents.off.call(this, event, handler as any);
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
	
	constructor(
		public roomEmitter: EventEmitter<any>,
		public roomAction: (arg: ROOM_ACTION, ...args: any) => void,
		public runWithContext: <T extends (...args: any) => any>(value: any, fn: T, ...args: Parameters<T>) => ReturnType<T>
	) {}
	
	onEnter(id: number, ...parameters: XJData[]): Connection {
		const connection = new Connection(id, parameters, this);
		this.connections.set(id, connection);
		this.runWithContext({connection, parameters}, () => {
			this.roomEmitter.emitWithTry("connection", connection, ...parameters);
			if (!connection.deferred) connection.open();
		})
		return connection;
	}
	
	onJoin(conId: number){
		const connection = this.connections.get(conId);
		if (!connection) return;
		if (this.readyConnections.has(connection)) return;
		this.readyConnections.add(connection);
		this.runWithContext({connection}, () => {
			this.getConnectionEmitter(connection).emitWithTry("open");
			this.roomEmitter.emitWithTry("connectionOpen", connection);
		});
	}
	
	onClose(conId: number, wasOnline: boolean, reason: string|null){
		const connection = this.connections.get(conId);
		if (!connection) return;
		this.connections.delete(conId);
		this.readyConnections.delete(connection);
		this.runWithContext({connection, reason, wasOnline}, () => {
			this.getConnectionEmitter(connection).emitWithTry("close", reason, wasOnline);
			this.roomEmitter.emitWithTry("connectionClose", connection, reason, wasOnline);
		});
	}
	
	onMessage(conId: number, ...message: XJData[]){
		const connection = this.connections.get(conId);
		if (!connection) return;
		this.runWithContext({connection, message}, () => {
			this.getConnectionEmitter(connection).emitWithTry("message", ...message);
			this.roomEmitter.emitWithTry("connectionMessage", connection, ...message);
		});
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
		this.roomAction(ROOM_ACTION.JOIN, conId);
		this.onJoin(conId);
	}
	
	isClosed(conId: number) {
		return !this.connections.has(conId);
	}
	
	send(id: number, ...args: XJData[]) {
		this.roomAction(ROOM_ACTION.SEND, id, ...args);
	}
	
	close(id: number, reason?: string|null) {
		const connection = this.connections.get(id);
		const wasOnline = connection && this.readyConnections.has(connection);
		this.roomAction(ROOM_ACTION.KICK, id, reason ?? null);
		this.onClose(id, Boolean(wasOnline), reason ?? null);
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
export type ConnectionEvents<DESC extends RoomDesc> = {
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
	message: DESC extends {clientMessage: infer R extends any []} ? R : XJData[];
}

/**
 * Handler of room connection
 * @group Classes
 */
class Connection<DESC extends RoomDesc = RoomDesc> {
	#id: number;
	#parameters: DESC extends {parameters: infer T} ? T : XJData[];
	#handle: ConnectionsLayer
	#subscriber
	#initResolver = Promise.withResolvers<this>();
	#deferred = false;
	/**
	 * custom data for this connection
	 */
	declare data?: DESC extends {data: infer T} ? T : any;

	/** @hidden */
	constructor(id: number, parameters: XJData[], handle: ConnectionsLayer){
		this.#id = id;
		this.#handle = handle;
		this.#parameters = parameters as any;
		const subscriber = this.#subscriber = this.#handle.getConnectionEmitter(this);
		subscriber.on("open", () => this.#initResolver.resolve(this))
		subscriber.on("close", (reason) => this.#initResolver.reject(reason));
		this.#initResolver.promise.catch(() => {});
	}
	
	get promise(): Promise<this> {
		return this.#initResolver.promise;
	}
	
	/**
	 * get the parameters with which the connection was initialized
	 */
	get parameters(): DESC extends {parameters: infer T extends any[]} ? T : XJData[] {
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
	send(...data: DESC extends {roomMessage: infer T extends any[]} ? T : XJData[]){
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
	on<T extends keyof ConnectionEvents<DESC>>(eventName: T, handler: (...args: ConnectionEvents<DESC>[T]) => void): this {
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
	once<T extends keyof ConnectionEvents<DESC>>(eventName: T, handler: (...args: ConnectionEvents<DESC>[T]) => void): this {
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
	off<T extends keyof ConnectionEvents<DESC>>(eventName: T, handler: (...args: ConnectionEvents<DESC>[T]) => void): this {
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