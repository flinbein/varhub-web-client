import { parse, serialize } from "@flinbein/xjmapper";
class EventBox {
    #eventTarget = new EventTarget();
    #fnMap = new WeakMap();
    #source;
    constructor(thisSource) {
        this.#source = thisSource;
    }
    dispatch(type, detail) {
        this.#eventTarget.dispatchEvent(new CustomEvent(type, { detail }));
    }
    subscriber = {
        on: (eventName, handler) => {
            let eventHandler = this.#fnMap.get(handler);
            if (!eventHandler) {
                eventHandler = (event) => {
                    handler.apply(this.#source, event.detail);
                };
                this.#fnMap.set(handler, eventHandler);
            }
            this.#eventTarget.addEventListener(eventName, eventHandler);
        },
        once: (eventName, handler) => {
            let eventHandler = this.#fnMap.get(handler);
            if (!eventHandler) {
                eventHandler = (event) => {
                    handler.apply(this.#source, event.detail);
                };
                this.#fnMap.set(handler, eventHandler);
            }
            this.#eventTarget.addEventListener(eventName, eventHandler, { once: true });
        },
        off: (eventName, handler) => {
            let eventHandler = this.#fnMap.get(handler);
            if (!eventHandler)
                return;
            this.#eventTarget.removeEventListener(eventName, eventHandler);
        },
    };
}
export class VarhubClient {
    #ws;
    #responseEventTarget = new EventTarget();
    #messagesEventBox = new EventBox(this);
    #selfEventBox = new EventBox(this);
    messages = this.#messagesEventBox.subscriber;
    methods = new Proxy(Object.freeze(Object.create(null)), {
        get: (ignored, method) => (...args) => this.call(method, ...args),
    });
    #hub;
    #roomId;
    #name;
    #params;
    #roomIntegrity;
    constructor(ws, hub, roomId, name, options) {
        this.#ws = ws;
        this.#hub = hub;
        this.#roomId = roomId;
        this.#name = name;
        this.#roomIntegrity = options?.integrity;
        this.#params = options?.params;
        ws.binaryType = "arraybuffer";
        ws.addEventListener("close", (event) => {
            this.#selfEventBox.dispatch("close", [event.reason]);
        });
        ws.addEventListener("message", (event) => {
            const binData = new Uint8Array(event.data);
            const [type, ...parsedData] = parse(binData);
            if (type === 2) {
                this.#selfEventBox.dispatch("message", parsedData);
                if (parsedData.length >= 1) {
                    const [eventType, ...eventData] = parsedData;
                    if (typeof eventType === "string") {
                        this.#messagesEventBox.dispatch(eventType, eventData);
                    }
                }
            }
            else {
                const [callId, response] = parsedData;
                if (typeof callId !== "number" && typeof callId !== "string")
                    return;
                this.#responseEventTarget.dispatchEvent(new CustomEvent(callId, { detail: [type, response] }));
            }
        });
    }
    get hub() { return this.#hub; }
    get roomId() { return this.#roomId; }
    get name() { return this.#name; }
    get roomIntegrity() { return this.#roomIntegrity; }
    get params() { return this.#params; }
    get online() {
        return this.#ws.readyState === WebSocket.OPEN;
    }
    #callId = 0;
    async call(method, ...data) {
        if (this.#ws.readyState !== WebSocket.OPEN)
            throw new Error("connection status");
        return new Promise((resolve, reject) => {
            const currentCallId = this.#callId++;
            const binData = serialize(currentCallId, method, ...data);
            const onResponse = (event) => {
                if (!(event instanceof CustomEvent))
                    return;
                const eventData = event.detail;
                if (!Array.isArray(eventData))
                    return;
                const [type, response] = eventData;
                clearEvents();
                if (type === 0)
                    resolve(response);
                else
                    reject(response);
            };
            const onClose = (reason) => {
                clearEvents();
                reject(new Error(reason ?? "connection closed"));
            };
            const clearEvents = () => {
                this.#responseEventTarget.removeEventListener(currentCallId, onResponse);
                this.off("close", onClose);
            };
            this.#responseEventTarget.addEventListener(currentCallId, onResponse, { once: true });
            this.once("close", onClose);
            this.#ws.send(binData);
        });
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
