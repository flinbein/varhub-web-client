import { parse, serialize } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class RoomSocketHandler {
    #ws;
    #id = null;
    #integrity = null;
    #wsEventBox = new EventBox(this);
    #selfEventBox = new EventBox(this);
    #publicMessage = null;
    #lobbyConnections = new Set();
    #onlineConnections = new Set();
    #initResolver = Promise.withResolvers();
    #ready = false;
    #closed = false;
    constructor(ws) {
        this.#ws = ws;
        this.#initResolver.promise.catch(() => { });
        ws.binaryType = "arraybuffer";
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
        this.#wsEventBox.subscriber.on("messageChange", (msg) => {
            const oldMsg = this.publicMessage;
            if (oldMsg === msg)
                return;
            this.#publicMessage = msg;
            this.#selfEventBox.dispatch("messageChange", [msg, oldMsg]);
        });
        this.#wsEventBox.subscriber.on("connectionEnter", (conId, ...args) => {
            this.#lobbyConnections.add(conId);
            this.#onlineConnections.delete(conId);
            this.#selfEventBox.dispatch("enter", [conId, ...args]);
        });
        this.#wsEventBox.subscriber.on("connectionJoin", (conId) => {
            const exists = this.#lobbyConnections.delete(conId);
            if (exists) {
                this.#onlineConnections.add(conId);
                this.#selfEventBox.dispatch("join", [conId]);
            }
        });
        this.#wsEventBox.subscriber.on("connectionClosed", (conId) => {
            const existsInLobby = this.#lobbyConnections.delete(conId);
            const existsInOnline = this.#onlineConnections.delete(conId);
            const exists = existsInLobby || existsInOnline;
            if (exists)
                this.#selfEventBox.dispatch("leave", [conId, existsInOnline]);
        });
        this.#wsEventBox.subscriber.on("connectionMessage", (conId, ...args) => {
            this.#selfEventBox.dispatch("message", [conId, ...args]);
        });
        this.#wsEventBox.subscriber.on("init", (roomId, publicMessage, integrity) => {
            this.#id = roomId;
            this.#publicMessage = publicMessage ?? null;
            this.#integrity = integrity ?? null;
            this.#initResolver.resolve(this);
            this.#ready = true;
            this.#selfEventBox.dispatch("init", []);
        });
    }
    get lobbyConnections() {
        return this.#lobbyConnections;
    }
    get onlineConnections() {
        return this.#onlineConnections;
    }
    get ready() { return this.#ready; }
    get closed() { return this.#closed; }
    get publicMessage() {
        return this.#publicMessage;
    }
    get id() {
        return this.#id;
    }
    get integrity() {
        return this.#integrity;
    }
    get waitForReady() {
        return this.#initResolver.promise;
    }
    join(conId) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        const connections = Array.isArray(conId) ? conId : [conId];
        for (let connection of connections) {
            const exist = this.#lobbyConnections.delete(connection);
            if (exist) {
                this.#onlineConnections.add(connection);
                this.#selfEventBox.dispatch("join", [connection]);
            }
        }
        this.#ws.send(serialize("join", ...connections));
    }
    kick(conId, message) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        const connections = Array.isArray(conId) ? conId : [conId];
        for (let connection of connections) {
            const existsInLobby = this.#lobbyConnections.delete(connection);
            const existsInOnline = this.#onlineConnections.delete(connection);
            const exists = existsInLobby || existsInOnline;
            if (exists)
                this.#selfEventBox.dispatch("leave", [connection, existsInOnline]);
        }
        this.#ws.send(serialize("kick", conId, message));
    }
    setPublicMessage(msg) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        const oldMsg = this.#publicMessage;
        if (oldMsg === msg)
            return;
        this.#publicMessage = msg;
        this.#selfEventBox.dispatch("messageChange", [msg, oldMsg]);
        this.#ws.send(serialize("publicMessage", msg));
    }
    send(conId, ...msg) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        this.#ws.send(serialize("send", conId, ...msg));
    }
    broadcast(...msg) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("websocket is not ready");
        this.#ws.send(serialize("broadcast", ...msg));
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
//# sourceMappingURL=RoomSocketHandler.js.map