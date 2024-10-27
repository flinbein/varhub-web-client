import { parse, serialize } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";
export class VarhubClient {
    #ws;
    #selfEvents = new EventEmitter();
    #readyPromise;
    #ready = false;
    #closed = false;
    constructor(ws) {
        this.#ws = ws;
        ws.binaryType = "arraybuffer";
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
            throw new Error("websocket is closed");
        }
        if (ws.readyState === WebSocket.CONNECTING) {
            ws.addEventListener("open", () => {
                this.#ready = true;
                this.#closed = false;
                this.#selfEvents.emit("open");
            });
            this.#readyPromise = new Promise((resolve, reject) => {
                this.on("open", () => { resolve(); });
                this.on("close", () => { reject(); });
            });
        }
        else {
            this.#ready = true;
            this.#readyPromise = Promise.resolve();
        }
        ws.addEventListener("message", (event) => {
            this.#selfEvents.emit("message", ...parse(event.data));
        });
        ws.addEventListener("close", (event) => {
            const wasReady = this.#ready;
            this.#ready = false;
            this.#closed = true;
            this.#selfEvents.emit("close", event.reason, wasReady);
        });
        ws.addEventListener("error", () => {
            this.#ready = false;
            this.#closed = true;
            this.#selfEvents.emit("error");
        });
        this.#readyPromise.catch(() => { });
    }
    then(onfulfilled, onrejected) {
        return this.#readyPromise.then(() => [this]).then(onfulfilled, onrejected);
    }
    ;
    get ready() { return this.#ready; }
    get closed() { return this.#closed; }
    send(...data) {
        const rawData = serialize(...data);
        this.#ws.send(rawData);
        return this;
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
    close(reason) {
        if (this.#ws.readyState === WebSocket.CLOSED || this.#ws.readyState === WebSocket.CLOSING)
            return;
        this.#ws.close(4000, reason ?? undefined);
    }
    [Symbol.dispose]() {
        this.close("disposed");
    }
    [Symbol.asyncDispose]() {
        if (this.#ws.readyState === WebSocket.CLOSED)
            return Promise.resolve();
        return new Promise((resolve) => {
            this.#ws.close(4000, "disposed");
            this.#ws.addEventListener("close", () => resolve());
        });
    }
}
//# sourceMappingURL=VarhubClient.js.map