import { parse, serialize } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class VarhubClient {
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
                this.#closed = false;
                this.#selfEventBox.dispatch("open", []);
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