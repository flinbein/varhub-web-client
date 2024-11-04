import { parse, serialize } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";
export class RoomSocketHandler {
    #ws;
    #id = null;
    #integrity = null;
    #wsEvents = new EventEmitter();
    #selfEvents = new EventEmitter();
    #publicMessage = null;
    #initResolver = Promise.withResolvers();
    #ready = false;
    #closed = false;
    #connectionsLayer;
    constructor(ws, getErrorLog) {
        this.#ws = ws;
        this.#initResolver.promise.catch(() => { });
        ws.binaryType = "arraybuffer";
        this.#connectionsLayer = new ConnectionsLayer(this.#selfEvents, this.#action);
        ws.addEventListener("message", (event) => {
            const [eventName, ...params] = parse(event.data);
            this.#wsEvents.emitWithTry(eventName, ...params);
        });
        ws.addEventListener("close", (event) => {
            this.#closed = true;
            this.#ready = false;
            this.#selfEvents.emitWithTry("close");
        });
        ws.addEventListener("error", () => {
            this.#closed = true;
            this.#ready = false;
            const errorPromise = getErrorLog ? getErrorLog() : Promise.resolve(undefined);
            this.#selfEvents.emitWithTry("error", errorPromise);
            this.#initResolver.reject(new Error("websocket closed", { cause: errorPromise }));
        });
        this.#wsEvents.on(3, (conId, ...args) => {
            this.#connectionsLayer.onEnter(conId, ...args);
        });
        this.#wsEvents.on(2, (conId) => {
            this.#connectionsLayer.onJoin(conId);
        });
        this.#wsEvents.on(5, (conId, wasOnline, message) => {
            this.#connectionsLayer.onClose(conId, wasOnline, message);
        });
        this.#wsEvents.on(4, (conId, ...args) => {
            this.#connectionsLayer.onMessage(conId, ...args);
        });
        this.#wsEvents.on(0, (roomId, publicMessage, integrity) => {
            this.#id = roomId;
            this.#publicMessage = publicMessage ?? null;
            this.#integrity = integrity ?? null;
            this.#initResolver.resolve([this]);
            this.#ready = true;
            this.#selfEvents.emitWithTry("init");
        });
    }
    then(onfulfilled, onrejected) {
        return this.#initResolver.promise.then(onfulfilled, onrejected);
    }
    ;
    getConnections(filter) {
        return this.#connectionsLayer.getConnections(filter);
    }
    get ready() { return this.#ready; }
    get closed() { return this.#closed; }
    get message() {
        return this.#publicMessage;
    }
    set message(msg) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        const oldMsg = this.#publicMessage;
        if (oldMsg === msg)
            return;
        this.#publicMessage = msg;
        this.#action(2, msg);
    }
    #action = (cmd, ...args) => {
        this.#ws.send(serialize(cmd, ...args));
    };
    get id() {
        return this.#id;
    }
    get integrity() {
        return this.#integrity;
    }
    broadcast(...msg) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        this.#action(5, ...msg);
        return this;
    }
    destroy() {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        this.#action(3);
        this.#ws.close();
    }
    on(event, handler) {
        this.#selfEvents.on.call(this, event, handler);
        return this;
    }
    once(event, handler) {
        this.#selfEvents.once.call(this, event, handler);
        return this;
    }
    off(event, handler) {
        this.#selfEvents.off.call(this, event, handler);
        return this;
    }
    [Symbol.dispose]() {
        if (this.#ws.readyState === WebSocket.CLOSED)
            return;
        this.#ws.close();
    }
    [Symbol.asyncDispose]() {
        if (this.#ws.readyState === WebSocket.CLOSED)
            return Promise.resolve();
        return new Promise((resolve) => {
            this.#ws.addEventListener("close", () => resolve());
            this.#ws.addEventListener("error", () => resolve());
            this.#ws.close();
        });
    }
}
class ConnectionsLayer {
    roomEmitter;
    roomAction;
    connections = new Map();
    readyConnections = new Set();
    connectionEmitters = new WeakMap();
    constructor(roomEmitter, roomAction) {
        this.roomEmitter = roomEmitter;
        this.roomAction = roomAction;
    }
    onEnter(id, ...parameters) {
        const connection = new Connection(id, parameters, this);
        this.connections.set(id, connection);
        this.roomEmitter.emitWithTry("connection", connection, ...parameters);
        if (!connection.deferred)
            connection.open();
        return connection;
    }
    onJoin(conId) {
        const connection = this.connections.get(conId);
        if (!connection)
            return;
        if (this.readyConnections.has(connection))
            return;
        this.readyConnections.add(connection);
        this.getConnectionEmitter(connection).emitWithTry("open");
        this.roomEmitter.emitWithTry("connectionOpen", connection);
    }
    onClose(conId, wasOnline, message) {
        const connection = this.connections.get(conId);
        if (!connection)
            return;
        this.connections.delete(conId);
        this.readyConnections.delete(connection);
        this.getConnectionEmitter(connection).emitWithTry("close", message, wasOnline);
        this.roomEmitter.emitWithTry("connectionClose", connection, message, wasOnline);
    }
    onMessage(conId, ...msg) {
        const connection = this.connections.get(conId);
        if (!connection)
            return;
        this.getConnectionEmitter(connection).emitWithTry("message", ...msg);
        this.roomEmitter.emitWithTry("connectionMessage", connection, ...msg);
    }
    getConnections(options) {
        const connectionsList = [...this.connections.values()];
        return new Set(connectionsList.filter((con) => {
            if (options)
                for (let key of Object.keys(options)) {
                    if (con[key] !== options[key])
                        return false;
                }
            return true;
        }));
    }
    isReady(conId) {
        const con = this.connections.get(conId);
        return con ? this.readyConnections.has(con) : false;
    }
    join(conId) {
        this.roomAction(0, conId);
        this.onJoin(conId);
    }
    isClosed(conId) {
        return !this.connections.has(conId);
    }
    send(id, ...args) {
        this.roomAction(4, id, ...args);
    }
    close(id, reason) {
        const connection = this.connections.get(id);
        const wasOnline = connection && this.readyConnections.has(connection);
        this.roomAction(1, id, reason ?? null);
        this.onClose(id, Boolean(wasOnline), reason ?? null);
    }
    getConnectionEmitter(con) {
        let emitter = this.connectionEmitters.get(con);
        if (!emitter) {
            emitter = new EventEmitter();
            this.connectionEmitters.set(con, emitter);
        }
        return emitter;
    }
}
class Connection {
    #id;
    #parameters;
    #handle;
    #subscriber;
    #initResolver = Promise.withResolvers();
    #deferred = false;
    constructor(id, parameters, handle) {
        this.#id = id;
        this.#handle = handle;
        this.#parameters = parameters;
        const subscriber = this.#subscriber = this.#handle.getConnectionEmitter(this);
        subscriber.on("open", () => this.#initResolver.resolve());
        subscriber.on("close", (reason) => this.#initResolver.reject(reason));
        this.#initResolver.promise.catch(() => { });
    }
    then(onfulfilled, onrejected) {
        return this.#initResolver.promise.then(() => [this]).then(onfulfilled, onrejected);
    }
    ;
    get parameters() {
        return this.#parameters;
    }
    get deferred() {
        return this.#deferred && !this.ready && !this.closed;
    }
    defer(handler, ...args) {
        this.#deferred = true;
        try {
            const result = handler.call(this, this, ...args);
            if (result && typeof result === "object" && "then" in result && typeof result.then === "function") {
                return result.then((val) => {
                    if (this.deferred)
                        this.open();
                    return val;
                }, (error) => {
                    if (this.deferred)
                        this.close(error == null ? error : String(error));
                    throw error;
                });
            }
            return result;
        }
        catch (e) {
            this.close(e == null ? null : String(e));
            throw e;
        }
    }
    get ready() {
        return this.#handle.isReady(this.#id);
    }
    get closed() {
        return this.#handle.isClosed(this.#id);
    }
    open() {
        this.#handle.join(this.#id);
        return this;
    }
    send(...data) {
        this.#handle.send(this.#id, ...data);
        return this;
    }
    on(eventName, handler) {
        this.#subscriber.on(eventName, handler);
        return this;
    }
    once(eventName, handler) {
        this.#subscriber.once(eventName, handler);
        return this;
    }
    off(eventName, handler) {
        this.#subscriber.off(eventName, handler);
        return this;
    }
    close(reason) {
        this.#handle.close(this.#id, reason);
    }
    toString() {
        return "Connection(" + this.#id + ")";
    }
    valueOf() {
        return this.#id;
    }
}
//# sourceMappingURL=RoomSocketHandler.js.map