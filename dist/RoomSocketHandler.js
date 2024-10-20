import { parse, serialize } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class RoomSocketHandler {
    #ws;
    #id = null;
    #integrity = null;
    #wsEventBox = new EventBox(this);
    #selfEventBox = new EventBox(this);
    #publicMessage = null;
    #initResolver = Promise.withResolvers();
    #ready = false;
    #closed = false;
    #connectionsLayer;
    constructor(ws) {
        this.#ws = ws;
        this.#initResolver.promise.catch(() => { });
        ws.binaryType = "arraybuffer";
        this.#connectionsLayer = new ConnectionsLayer(this.#selfEventBox, this.#action);
        ws.addEventListener("message", (event) => {
            const [eventName, ...params] = parse(event.data);
            this.#wsEventBox.dispatch(String(eventName), params);
        });
        ws.addEventListener("close", (event) => {
            this.#closed = true;
            this.#ready = false;
            this.#selfEventBox.dispatch("close", []);
            this.#initResolver.reject(new Error(event.reason));
        });
        ws.addEventListener("error", () => {
            this.#closed = true;
            this.#ready = false;
            this.#selfEventBox.dispatch("error", []);
            this.#initResolver.reject(new Error("unknown websocket error"));
        });
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
        this.#wsEventBox.subscriber.on("init", (roomId, publicMessage, integrity) => {
            this.#id = roomId;
            this.#publicMessage = publicMessage ?? null;
            this.#integrity = integrity ?? null;
            this.#initResolver.resolve();
            this.#ready = true;
            this.#selfEventBox.dispatch("init", []);
        });
    }
    then(onfulfilled, onrejected) {
        return this.#initResolver.promise.then(() => [this]).then(onfulfilled, onrejected);
    }
    ;
    getConnections(arg) {
        return this.#connectionsLayer.getConnections(arg);
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
        this.#action("publicMessage", msg);
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
        this.#ws.send(serialize("broadcast", ...msg));
        return this;
    }
    destroy() {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        this.#ws.send(serialize("destroy"));
        this.#ws.close();
    }
    on(event, handler) {
        this.#selfEventBox.subscriber.on(event, handler);
        return this;
    }
    once(event, handler) {
        this.#selfEventBox.subscriber.once(event, handler);
        return this;
    }
    off(event, handler) {
        this.#selfEventBox.subscriber.off(event, handler);
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
        this.roomEmitter.dispatch("connection", [connection, ...parameters]);
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
        this.getConnectionEmitter(connection).dispatch("open", []);
        this.roomEmitter.dispatch("connectionOpen", [connection]);
    }
    onClose(conId, wasOnline, message) {
        const connection = this.connections.get(conId);
        if (!connection)
            return;
        this.connections.delete(conId);
        this.readyConnections.delete(connection);
        this.getConnectionEmitter(connection).dispatch("close", [message, wasOnline]);
        this.roomEmitter.dispatch("connectionClose", [connection, message, wasOnline]);
    }
    onMessage(conId, ...msg) {
        const connection = this.connections.get(conId);
        if (!connection)
            return;
        this.getConnectionEmitter(connection).dispatch("message", msg);
        this.roomEmitter.dispatch("connectionMessage", [connection, ...msg]);
    }
    getConnections({ ready } = { ready: undefined }) {
        if (ready === undefined)
            return new Set(this.connections.values());
        if (ready)
            return new Set([...this.connections.values()].filter(con => con.ready));
        return new Set([...this.connections.values()].filter(con => !con.ready));
    }
    isReady(conId) {
        const con = this.connections.get(conId);
        return con ? this.readyConnections.has(con) : false;
    }
    join(conId) {
        this.onJoin(conId);
        this.roomAction("join", conId);
    }
    isClosed(conId) {
        return !this.connections.has(conId);
    }
    send(id, ...args) {
        this.roomAction("send", id, ...args);
    }
    close(id, reason) {
        const connection = this.connections.get(id);
        const wasOnline = connection && this.readyConnections.has(connection);
        this.onClose(id, Boolean(wasOnline), reason ?? null);
        this.roomAction("kick", id, reason ?? null);
    }
    getConnectionEmitter(con) {
        let emitter = this.connectionEmitters.get(con);
        if (!emitter) {
            emitter = new EventBox(con);
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
        const subscriber = this.#subscriber = this.#handle.getConnectionEmitter(this)?.subscriber;
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
    defer(fn) {
        this.#deferred = true;
        try {
            const result = fn.call(this, this);
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
    send(...args) {
        this.#handle.send(this.#id, ...args);
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