import { parse, serialize } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class VarhubRawClient {
    #ws;
    #selfEventBox = new EventBox(this);
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
            ws.addEventListener("open", (event) => {
                this.#ready = true;
                this.#closed = true;
                this.#selfEventBox.dispatch("ready", []);
            });
            this.#readyPromise = new Promise((resolve, reject) => {
                this.on("ready", () => { resolve(this); });
                this.on("close", () => { reject(); });
            });
        }
        else {
            this.#ready = true;
            this.#readyPromise = Promise.resolve(this);
        }
        ws.addEventListener("message", (event) => {
            this.#selfEventBox.dispatch("message", [...parse(event.data)]);
        });
        ws.addEventListener("close", (event) => {
            this.#ready = false;
            this.#closed = true;
            this.#selfEventBox.dispatch("close", [event.reason]);
        });
        ws.addEventListener("error", (event) => {
            this.#ready = false;
            this.#closed = true;
            this.#selfEventBox.dispatch("error", []);
        });
    }
    get ready() { return this.#ready; }
    get closed() { return this.#closed; }
    get waitForReady() {
        return this.#readyPromise;
    }
    send(...data) {
        const rawData = serialize(...data);
        this.#ws.send(rawData);
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
//# sourceMappingURL=VarhubRawClient.js.map