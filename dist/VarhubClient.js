import { parse, serialize } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";
export class VarhubClient {
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
    #readyPromise;
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
        this.#readyPromise = new Promise((resolve, reject) => {
            this.once("ready", () => resolve(this));
            this.once("close", (error) => reject(error));
        });
        this.#init(options);
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
    get waitForReady() {
        return this.#readyPromise;
    }
    #init(options) {
        const ws = this.#ws;
        console.log("INIT", ws, options?.timeout);
        const onSuccess = () => {
            this.#ready = true;
            this.#selfEventBox.dispatch("ready", []);
        };
        const onError = (error) => {
            this.#error = error;
            this.#selfEventBox.dispatch("error", [error]);
        };
        const abort = () => {
            onError(new Error(`aborted`));
            if (timeout != undefined)
                clearTimeout(timeout);
            ws.close(4000);
        };
        let timeout;
        if (options.timeout instanceof AbortSignal) {
            options.timeout.addEventListener("abort", abort);
        }
        else if (typeof options.timeout === "number") {
            timeout = setTimeout(abort, options.timeout);
        }
        const onClose = (e) => onError(new Error(e.reason));
        const onMessage = () => {
            ws.removeEventListener("close", onClose);
            ws.removeEventListener("message", onMessage);
            if (timeout != undefined)
                clearTimeout(timeout);
            onSuccess();
        };
        ws.addEventListener("close", onClose);
        ws.addEventListener("message", onMessage);
    }
    get error() { return this.#error; }
    get ready() { return this.#ready; }
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
