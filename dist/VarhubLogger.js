import { parse } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class VarhubLogger {
    #id;
    #ws;
    #selfEventBox = new EventBox(this);
    #error;
    #hub;
    constructor(ws, hub, id) {
        this.#ws = ws;
        this.#hub = hub;
        this.#id = id;
        this.#ws.addEventListener("close", (event) => {
            this.#selfEventBox.dispatch("close", [event.reason]);
        }, { once: true });
        ws.addEventListener("message", (event) => {
            const binData = new Uint8Array(event.data);
            const parsedData = parse(binData);
            this.#selfEventBox.dispatch("message", parsedData);
        });
    }
    get id() { return this.#id; }
    get error() { return this.#error; }
    get hub() { return this.#hub; }
    get online() {
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
