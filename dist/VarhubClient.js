import { parse, serialize } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";
const getNoError = async () => undefined;
export class VarhubClient {
    #ws;
    #selfEvents = new EventEmitter();
    #resolver = Promise.withResolvers();
    #ready = false;
    #closed = false;
    constructor(ws, getErrorLog = getNoError) {
        this.#ws = ws;
        this.#resolver.promise.catch(() => { });
        ws.binaryType = "arraybuffer";
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
            throw new Error("websocket is closed");
        }
        if (ws.readyState === WebSocket.CONNECTING) {
            ws.addEventListener("open", () => {
                this.#ready = true;
                this.#closed = false;
                this.#selfEvents.emitWithTry("open");
                this.#resolver.resolve([this]);
            });
        }
        else {
            this.#ready = true;
            this.#resolver.resolve([this]);
        }
        ws.addEventListener("message", (event) => {
            this.#selfEvents.emitWithTry("message", ...parse(event.data));
        });
        ws.addEventListener("close", (event) => {
            const wasReady = this.#ready;
            this.#ready = false;
            this.#closed = true;
            this.#selfEvents.emitWithTry("close", event.reason, wasReady);
        });
        ws.addEventListener("error", () => {
            this.#ready = false;
            this.#closed = true;
            const errorPromise = getErrorLog ? getErrorLog() : Promise.resolve(undefined);
            this.#selfEvents.emitWithTry("error", errorPromise);
            this.#resolver.reject(new Error("websocket closed", { cause: errorPromise }));
        });
    }
    get promise() {
        return this.#resolver.promise;
    }
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