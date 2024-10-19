import { parse, serialize, XJData } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";

export type RoomSocketHandlerEvents = {
	connection: [connection: Connection, ...args: XJData[]];
	connectionOpen: [connection: Connection];
	connectionClose: [connection: Connection, reason: string | null, wasOnline: boolean];
	connectionMessage: [connection: Connection, ...args: XJData[]];
	error: [];
	init: [];
	close: [];
}
export class RoomSocketHandler {
	#ws: WebSocket;
	#id: string|null = null;
	#integrity: string|null = null;
	#wsEventBox = new EventBox<any, this>(this);
	#selfEventBox = new EventBox<RoomSocketHandlerEvents, this>(this);
	#publicMessage: string|null = null;
	#initResolver = Promise.withResolvers<void>();
	#ready = false;
	#closed = false;
	#connectionsLayer: ConnectionsLayer;
	
	constructor(ws: WebSocket) {
		this.#ws = ws;
		this.#initResolver.promise.catch(() => {});
		ws.binaryType = "arraybuffer";
		this.#connectionsLayer = new ConnectionsLayer(this.#selfEventBox, this.#action);
		ws.addEventListener("message", (event: MessageEvent) => {
			const [eventName, ...params] = parse(event.data);
			this.#wsEventBox.dispatch(String(eventName), params);
		});
		ws.addEventListener("close", (event) => {
			this.#closed = true;
			this.#ready = false;
			this.#selfEventBox.dispatch("close", []);
			this.#initResolver.reject(new Error(event.reason));
		})
		ws.addEventListener("error", () => {
			this.#closed = true;
			this.#ready = false;
			this.#selfEventBox.dispatch("error", []);
			this.#initResolver.reject(new Error("unknown websocket error"));
		})
		this.#wsEventBox.subscriber.on("connectionEnter", (conId, ...args) => {
			this.#connectionsLayer.onEnter(conId, ...args);
		});
		this.#wsEventBox.subscriber.on("connectionJoin", (conId) => {
			this.#connectionsLayer.onJoin(conId);
		});
		this.#wsEventBox.subscriber.on("connectionClosed", (conId, wasOnline, message) => {
			this.#connectionsLayer.onClose(conId, wasOnline, message);
		});
		this.#wsEventBox.subscriber.on("connectionMessage", (conId, ...args) => {
			this.#connectionsLayer.onMessage(conId, ...args);
		});
		this.#wsEventBox.subscriber.on("init", (roomId: string, publicMessage?: string, integrity?: string) => {
			this.#id = roomId;
			this.#publicMessage = publicMessage ?? null;
			this.#integrity = integrity ?? null;
			this.#initResolver.resolve();
			this.#ready = true;
			this.#selfEventBox.dispatch("init", []);
		});
	}
	
	then<R1 = [this], R2 = never>(
		onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
		onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
	): PromiseLike<R1 | R2> {
		return this.#initResolver.promise.then(() => [this] as [this]).then(onfulfilled, onrejected);
	};
	
	getConnections(arg?: {ready?: boolean}): Set<Connection>{
		return this.#connectionsLayer.getConnections(arg);
	}
	
	get ready(): boolean { return this.#ready; }
	get closed(): boolean { return this.#closed; }
	
	get message(){
		return this.#publicMessage;
	}
	
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
	
	get id(): string | null {
		return this.#id;
	}
	
	get integrity(): string | null {
		return this.#integrity;
	}
	
	broadcast(...msg: any[]) {
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("websocket is not ready");
		this.#ws.send(serialize("broadcast", ...msg));
		return this;
	}
	
	destroy() {
		if (this.#ws.readyState !== WebSocket.OPEN) throw new Error("websocket is not ready");
		this.#ws.send(serialize("destroy"));
		this.#ws.close();
	}
	
	on<T extends keyof RoomSocketHandlerEvents>(event: T, handler: (this: typeof this, ...args: RoomSocketHandlerEvents[T]) => void): this{
		this.#selfEventBox.subscriber.on(event, handler);
		return this;
	}

	once<T extends keyof RoomSocketHandlerEvents>(event: T, handler: (this: typeof this, ...args: RoomSocketHandlerEvents[T]) => void): this{
		this.#selfEventBox.subscriber.once(event, handler);
		return this;
	}
	
	off<T extends keyof RoomSocketHandlerEvents>(event: T, handler: (this: typeof this, ...args: RoomSocketHandlerEvents[T]) => void): this{
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
			this.#ws.addEventListener("close", () => resolve());
			this.#ws.addEventListener("error", () => resolve());
			this.#ws.close();
		});
	}
}

class ConnectionsLayer {
	connections: Map<number, Connection> = new Map();
	readyConnections: WeakSet<Connection> = new Set();
	connectionEmitters: WeakMap<Connection, EventBox<any, any>> = new WeakMap();
	
	constructor(public roomEmitter: EventBox<any, any>, public roomAction: (...args: any) => void) {
	
	}
	
	onEnter(id: number, ...parameters: XJData[]): Connection {
		const connection = new Connection(id, parameters, this);
		this.connections.set(id, connection);
		this.roomEmitter.dispatch("connection", [connection, ...parameters]);
		if (!connection.deferred) connection.open();
		return connection;
	}
	
	onJoin(conId: number){
		const connection = this.connections.get(conId);
		if (!connection) return;
		if (this.readyConnections.has(connection)) return;
		this.readyConnections.add(connection);
		this.getConnectionEmitter(connection).dispatch("open", []);
		this.roomEmitter.dispatch("connectionOpen", [connection]);
	}
	
	onClose(conId: number, wasOnline: boolean, message: string|null){
		const connection = this.connections.get(conId);
		if (!connection) return;
		this.connections.delete(conId);
		this.readyConnections.delete(connection);
		this.getConnectionEmitter(connection).dispatch("close", [message, wasOnline]);
		this.roomEmitter.dispatch("connectionClose", [connection, message, wasOnline]);
	}
	
	onMessage(conId: number, ...msg: XJData[]){
		const connection = this.connections.get(conId);
		if (!connection) return;
		this.getConnectionEmitter(connection).dispatch("message", msg);
		this.roomEmitter.dispatch("connectionMessage", [connection, ...msg]);
	}
	
	getConnections({ready}: {ready?: boolean} = {ready: undefined}): Set<Connection>{
		if (ready === undefined) return new Set(this.connections.values());
		if (ready) return new Set([...this.connections.values()].filter(con => con.ready));
		return new Set([...this.connections.values()].filter(con => !con.ready));
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
			emitter = new EventBox(con);
			this.connectionEmitters.set(con, emitter);
		}
		return emitter;
	}
}

export type ConnectionEvents = {
	open: [];
	close: [reason: string|null, wasOnline: boolean];
	message: XJData[];
}

class Connection {
	#id: number;
	#parameters: XJData[];
	#handle: ConnectionsLayer
	#subscriber
	#initResolver = Promise.withResolvers<void>();
	#deferred = false;

	constructor(id: number, parameters: XJData[], handle: ConnectionsLayer){
		this.#id = id;
		this.#handle = handle;
		this.#parameters = parameters;
		const subscriber = this.#subscriber = this.#handle.getConnectionEmitter(this)?.subscriber;
		subscriber.on("open", () => this.#initResolver.resolve())
		subscriber.on("close", (reason) => this.#initResolver.reject(reason));
		this.#initResolver.promise.catch(() => {});
	}
	
	then<R1 = [this], R2 = never>(
		onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
		onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
	): PromiseLike<R1 | R2> {
		return this.#initResolver.promise.then(() => [this] as [this]).then(onfulfilled, onrejected);
	};

	get parameters() {
		return this.#parameters;
	}
	
	get deferred() {
		return this.#deferred && !this.ready && !this.closed;
	}
	
	defer<T>(fn: (this: this, connection: this) => T): T {
		this.#deferred = true;
		try {
			const result = fn.call(this, this);
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

	get ready(){
		return this.#handle.isReady(this.#id)
	}

	get closed(){
		return this.#handle.isClosed(this.#id);
	}
	
	open(){
		this.#handle.join(this.#id);
		return this;
	}

	send(...args: XJData[]){
		this.#handle.send(this.#id, ...args);
		return this;
	}
	
	on<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this {
		this.#subscriber.on(eventName, handler);
		return this;
	}
	
	once<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this {
		this.#subscriber.once(eventName, handler);
		return this;
	}
	
	off<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this {
		this.#subscriber.off(eventName, handler);
		return this;
	}

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
