import EventEmitter from "./EventEmitter.js";
export const RPCChannel = function (client, { key = "$rpc" } = {}) {
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
        if (args.length < 3)
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
            return channel.onState(messageArgs[0]);
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
    state = undefined;
    events = new EventEmitter();
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
        if (channelId === undefined) {
            if (manager.client.ready) {
                void this.send(0);
            }
            else {
                manager.client.once("open", () => {
                    void this.send(0);
                });
            }
        }
        manager.client.once("close", (reason) => this.onClose(reason));
    }
    onState(state) {
        if (this.closed)
            return;
        const oldState = this.state;
        const wasReady = this.ready;
        this.state = state;
        this.ready = true;
        if (!wasReady) {
            this.events.emitWithTry("ready");
            this.events.emitWithTry("state", state);
            this.resolver.resolve(this.proxy);
        }
        else {
            this.events.emitWithTry("state", state, oldState);
        }
    }
    onClose(reason) {
        if (this.closed)
            return;
        const wasReady = this.ready;
        this.ready = false;
        this.closed = true;
        if (!wasReady)
            this.events.emitWithTry("error", reason);
        this.events.emitWithTry("close", reason);
        this.resolver.reject(reason);
        this.manager.channels.delete(this.channelId);
    }
    onEvent(path, args) {
        const eventName = JSON.stringify(path);
        this.events.emitWithTry(eventName, ...args);
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
                this.events.off("close", onClose);
                fn(...args);
            };
            this.responseEventTarget.addEventListener(callId, onResponse, { once: true });
            this.events.once("close", onClose);
            void this.send(0, callId, path, args);
        });
    };
    proxyConstruct = (path, ...args) => {
        if (this.closed)
            throw new Error("channel is closed");
        const channel = this.manager.createNextChannel();
        void this.send(2, channel.channelId, path, args);
        return channel.proxy;
    };
    async send(callCode, ...args) {
        if (!this.manager.client.ready)
            await this.manager.client.promise;
        this.manager.client.send(this.manager.key, this.channelId, callCode, ...args);
    }
    close = (reason) => {
        if (this.closed)
            return;
        this.ready = false;
        this.closed = true;
        if (this.channelId === undefined) {
            this.manager.client.close(reason);
        }
        else {
            void this.send(1, reason);
        }
        this.events.emitWithTry("close", reason);
        this.resolver.reject(reason);
        this.manager.channels.delete(this.channelId);
    };
    [Symbol.dispose] = () => {
        this.close("disposed");
    };
    createProxy(path = []) {
        const children = new Map();
        const events = this.events;
        const subscribers = {
            on: function (eventName, handler) {
                return events.on.call(this, getEventCode(path, eventName), handler);
            },
            once: function (eventName, handler) {
                return events.once.call(this, getEventCode(path, eventName), handler);
            },
            off: function (eventName, handler) {
                return events.off.call(this, getEventCode(path, eventName), handler);
            }
        };
        const notify = (...args) => {
            void this.send(3, path, args);
        };
        const proxyHandler = {
            get: (_target, prop) => {
                if (prop === "then")
                    return undefined;
                if (path.length === 0) {
                    if (prop === Symbol.dispose)
                        return this[Symbol.dispose];
                    if (prop === "ready")
                        return this.ready;
                    if (prop === "closed")
                        return this.closed;
                    if (prop === "state")
                        return this.state;
                    if (prop === "promise")
                        return this.resolver.promise;
                    if (prop === "close")
                        return this.close;
                }
                else {
                    if (prop === "notify")
                        return notify;
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
function getEventCode(path, e) {
    if (path.length > 0)
        return JSON.stringify([...path, ...(Array.isArray(e) ? e : [e])]);
    if (e === "close" || e === "ready" || e === "error" || e === "state")
        return e;
    return JSON.stringify(Array.isArray(e) ? e : [e]);
}
//# sourceMappingURL=RPCChannel.js.map