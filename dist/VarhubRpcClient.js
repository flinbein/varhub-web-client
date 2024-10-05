import { parse, serialize } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class VarhubRpcClient {
    #ws;
    #responseEventTarget = new EventTarget();
    #messagesEventBox = new EventBox(this);
    #selfEventBox = new EventBox(this);
    messages = this.#messagesEventBox.subscriber;
    methods = new Proxy(Object.freeze(Object.create(null)), {
        get: (ignored, method) => (...args) => this.call(method, ...args),
    });
    #error;
    #ready = false;
    #closed = false;
    #readyPromise;
    constructor(ws) {
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
            throw new Error("websocket is closed");
        }
        ws.binaryType = "arraybuffer";
        this.#ws = ws;
        if (ws.readyState === WebSocket.CONNECTING) {
            this.#readyPromise = new Promise((resolve, reject) => {
                this.once("ready", () => resolve(this));
                this.once("close", (error) => reject(error));
            });
            ws.addEventListener("open", () => {
                this.#ready = true;
                this.#selfEventBox.dispatch("ready", []);
            });
        }
        else {
            this.#ready = true;
            this.#readyPromise = Promise.resolve(this);
        }
        this.#readyPromise.catch(() => { });
        ws.binaryType = "arraybuffer";
        ws.addEventListener("close", (event) => {
            this.#closed = true;
            this.#ready = false;
            this.#selfEventBox.dispatch("close", [event.reason]);
        });
        ws.addEventListener("message", (event) => {
            const binData = new Uint8Array(event.data);
            const [code = undefined, ...args] = parse(binData);
            if (code === "$rpcEvent") {
                this.#selfEventBox.dispatch("message", args);
                if (args.length >= 1) {
                    const [eventType, ...eventData] = args;
                    if (typeof eventType === "string") {
                        this.#messagesEventBox.dispatch(eventType, eventData);
                    }
                }
            }
            else if (code === "$rpcResult") {
                const [callId = undefined, errorCode = undefined, response = undefined] = args;
                if (typeof callId !== "number" && typeof callId !== "string")
                    return;
                this.#responseEventTarget.dispatchEvent(new CustomEvent(callId, { detail: [errorCode, response] }));
            }
        });
    }
    get waitForReady() {
        return this.#readyPromise;
    }
    get error() { return this.#error; }
    get ready() { return this.#ready; }
    get closed() { return this.#closed; }
    get online() {
        return this.#ws.readyState === WebSocket.OPEN;
    }
    #callId = 0;
    async call(method, ...data) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("connection status");
        return new Promise((resolve, reject) => {
            const currentCallId = this.#callId++;
            const binData = serialize("$rpc", currentCallId, method, ...data);
            const onResponse = (event) => {
                if (!(event instanceof CustomEvent))
                    return;
                const eventData = event.detail;
                if (!Array.isArray(eventData))
                    return;
                const [type, response] = eventData;
                clear(type === 0 ? resolve : reject, response);
            };
            const onClose = (reason) => {
                clear(reject, new Error(reason ?? "connection closed"));
            };
            const clear = (fn, ...args) => {
                this.#responseEventTarget.removeEventListener(currentCallId, onResponse);
                this.off("close", onClose);
                fn(...args);
            };
            this.#responseEventTarget.addEventListener(currentCallId, onResponse, { once: true });
            this.once("close", onClose);
            this.#ws.send(binData);
        });
    }
    close(reason) {
        this.#closed = true;
        this.#ready = false;
        this.#ws.close(4000, reason);
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
            this.#ws.close();
            this.#ws.addEventListener("close", () => resolve());
        });
    }
}
//# sourceMappingURL=VarhubRpcClient.js.map