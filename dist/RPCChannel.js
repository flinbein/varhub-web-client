import { EventBox } from "./EventBox.js";
export const RPCChannel = function (client, key) {
    const manager = new ChannelManager(client, key);
    return manager.defaultChannel.proxy;
};
class ChannelManager {
    client;
    key;
    currentChannelId = 0;
    defaultChannel;
    channels = new Map();
    constructor(client, key) {
        this.client = client;
        this.key = key;
        this.defaultChannel = new Channel(this, undefined);
        this.channels.set(undefined, this.defaultChannel);
        client.on("message", this.onMessage);
    }
    createNextChannel() {
        const channelId = this.currentChannelId++;
        const channel = new Channel(this, channelId);
        this.channels.set(channelId, channel);
        return channel;
    }
    onMessage = (...args) => {
        if (args.length < 4)
            return;
        const [key, channelId, operationCode, ...messageArgs] = args;
        if (key !== this.key)
            return;
        const channel = this.channels.get(channelId);
        if (!channel)
            return;
        if (operationCode === 3 || operationCode === 0) {
            return channel.onResponse(operationCode, messageArgs[0], messageArgs[1]);
        }
        if (operationCode === 2) {
            return channel.onInit(messageArgs[0]);
        }
        if (operationCode === 1) {
            return channel.onClose(messageArgs[0]);
        }
        if (operationCode === 4) {
            return channel.onEvent(messageArgs[0], messageArgs[1]);
        }
    };
}
const proxyTarget = function () { };
class Channel {
    manager;
    channelId;
    proxy;
    initialData;
    eventBox;
    resolver = Promise.withResolvers();
    ready = false;
    closed = false;
    currentCallId = 0;
    responseEventTarget = new EventTarget();
    constructor(manager, channelId) {
        this.manager = manager;
        this.channelId = channelId;
        this.proxy = this.createProxy();
        this.resolver.promise.catch(() => { });
        this.eventBox = new EventBox(this.proxy);
        if (channelId === undefined) {
            if (manager.client.ready) {
                this.onInit();
            }
            else {
                manager.client.once("open", () => this.onInit());
            }
        }
        manager.client.once("close", (reason) => this.onClose(reason));
    }
    onInit(initData) {
        this.initialData = initData;
        this.ready = true;
        this.eventBox.dispatch("init", [initData]);
        this.resolver.resolve();
    }
    onClose(reason) {
        if (this.closed)
            return;
        const wasReady = this.ready;
        this.ready = false;
        this.closed = true;
        if (!wasReady)
            this.eventBox.dispatch("error", [reason]);
        this.eventBox.dispatch("close", [reason]);
        this.resolver.reject(reason);
        this.manager.channels.delete(this.channelId);
        this.eventBox.clear();
    }
    onEvent(path, args) {
        const eventName = JSON.stringify(path);
        this.eventBox.dispatch(eventName, args);
    }
    onResponse(operationCode, callId, data) {
        this.responseEventTarget.dispatchEvent(new CustomEvent(callId, { detail: [operationCode, data] }));
    }
    proxyApply = (path, ...args) => {
        return new Promise((resolve, reject) => {
            if (this.closed)
                throw new Error("channel is closed");
            const callId = this.currentCallId++;
            const onResponse = (event) => {
                if (!(event instanceof CustomEvent))
                    return;
                const [type, response] = event.detail;
                clear(type ? reject : resolve, response);
            };
            const onClose = (reason) => {
                clear(reject, new Error(reason ?? "connection closed"));
            };
            const clear = (fn, ...args) => {
                this.responseEventTarget.removeEventListener(callId, onResponse);
                this.eventBox.subscriber.off("close", onClose);
                fn(...args);
            };
            this.responseEventTarget.addEventListener(callId, onResponse, { once: true });
            this.eventBox.subscriber.once("close", onClose);
            this.send(0, callId, path, args);
        });
    };
    proxyConstruct = (path, ...args) => {
        if (this.closed)
            throw new Error("channel is closed");
        const channel = this.manager.createNextChannel();
        this.send(2, channel.channelId, path, args);
        return channel.proxy;
    };
    send(callCode, ...args) {
        this.manager.client.send(this.manager.key, this.channelId, callCode, ...args);
    }
    then = (res, rej) => {
        return this.resolver.promise.then(() => [this.proxy]).then(res, rej);
    };
    close = (reason) => {
        if (this.closed)
            return;
        this.ready = false;
        this.closed = true;
        if (this.channelId === undefined) {
            this.manager.client.close(reason);
        }
        else {
            this.send(1, reason);
        }
        this.eventBox.dispatch("close", [reason]);
        this.resolver.reject(reason);
        this.manager.channels.delete(this.channelId);
        this.eventBox.clear();
    };
    [Symbol.dispose] = () => {
        this.close("disposed");
    };
    getEventCode(path, eventName) {
        if (path.length > 0)
            return JSON.stringify([...path, eventName]);
        if (eventName === "close" || eventName === "init" || eventName === "error")
            return eventName;
        return JSON.stringify([eventName]);
    }
    createProxy(path = []) {
        const children = new Map();
        const subscribers = {
            on: (eventName, handler) => {
                return this.eventBox.subscriber.on(this.getEventCode(path, eventName), handler);
            },
            once: (eventName, handler) => {
                return this.eventBox.subscriber.once(this.getEventCode(path, eventName), handler);
            },
            off: (eventName, handler) => {
                return this.eventBox.subscriber.off(this.getEventCode(path, eventName), handler);
            }
        };
        const proxyHandler = {
            get: (target, prop) => {
                if (path.length === 0) {
                    if (prop === Symbol.dispose)
                        return this[Symbol.dispose];
                    if (prop === "ready")
                        return this.ready;
                    if (prop === "closed")
                        return this.closed;
                    if (prop === "initialData")
                        return this.initialData;
                    if (prop === "then")
                        return this.then;
                    if (prop === "call")
                        return this.proxyApply;
                    if (prop === "create")
                        return this.proxyConstruct;
                    if (prop === "close")
                        return this.close;
                }
                if (prop in subscribers)
                    return subscribers[prop];
                if (typeof prop !== "string")
                    return undefined;
                if (children.has(prop))
                    return children.get(prop);
                const handler = this.createProxy([...path, prop]);
                children.set(prop, handler);
                return handler;
            },
            apply: (target, thisArg, args) => {
                return this.proxyApply(path, ...args);
            },
            construct: (target, args) => {
                return this.proxyConstruct(path, ...args);
            },
            isExtensible() { return false; },
            getPrototypeOf() { return null; },
            setPrototypeOf() { return false; },
            defineProperty() { throw new Error(`can not define property of channel`); },
            set() { throw new Error(`can not set property of channel`); },
            delete() { throw new Error(`can not delete property of channel`); },
            has() { return false; },
            ownKeys() { return ["prototype"]; }
        };
        return new Proxy(proxyTarget, proxyHandler);
    }
}
//# sourceMappingURL=RPCChannel.js.map