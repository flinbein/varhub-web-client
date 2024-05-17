import { parse } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class VarhubLogger {
    #ws;
    #selfEventBox = new EventBox(this);
    #error;
    #readyPromise;
    #hub;
    constructor(ws, hub) {
        this.#ws = ws;
        this.#hub = hub;
        this.#ws.addEventListener("open", () => {
            this.#selfEventBox.dispatch("ready", []);
        }, { once: true });
        this.#ws.addEventListener("close", (event) => {
            this.#selfEventBox.dispatch("close", [event.reason]);
        }, { once: true });
        this.#ws.addEventListener("error", () => {
            this.#error = new Error(`websocket error`);
            this.#selfEventBox.dispatch("error", [this.#error]);
        }, { once: true });
        this.#readyPromise = new Promise((resolve, reject) => {
            this.once("ready", () => resolve(this));
            this.once("close", (error) => reject(error));
        });
        ws.addEventListener("message", (event) => {
            const binData = new Uint8Array(event.data);
            const parsedData = parse(binData);
            this.#selfEventBox.dispatch("message", parsedData);
        });
    }
    get waitForReady() {
        return this.#readyPromise;
    }
    get error() { return this.#error; }
    get hub() { return this.#hub; }
    get ready() {
        return this.#ws.readyState === WebSocket.OPEN;
    }
    close(reason) {
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
}
