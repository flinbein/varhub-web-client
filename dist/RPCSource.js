import EventEmitter from "./EventEmitter.js";
const isConstructable = (fn) => {
    try {
        return Boolean(class E extends fn {
        });
    }
    catch {
        return false;
    }
};
const isESClass = (fn) => (typeof fn === 'function' && isConstructable(fn) &&
    Function.prototype.toString.call(fn).startsWith("class"));
class RPCSourceChannel {
    #source;
    #connection;
    #closeHook;
    #closed = false;
    constructor(source, connection, closeHook) {
        this.#source = source;
        this.#connection = connection;
        this.#closeHook = closeHook;
    }
    get closed() { return this.#closed; }
    get source() { return this.#source; }
    get connection() { return this.#connection; }
    close(reason) {
        if (this.#closed)
            return;
        this.#closed = true;
        this.#closeHook(reason);
    }
}
export default class RPCSource {
    #handler;
    #autoDispose = false;
    #innerEvents = new EventEmitter();
    #state;
    get state() { return this.#state; }
    constructor(handler, initialState) {
        this.#state = initialState;
        if (typeof handler === "object")
            handler = RPCSource.createDefaultHandler({ form: handler });
        this.#handler = handler;
    }
    static createDefaultHandler(parameters) {
        return function (con, path, args, openChannel) {
            let target = parameters?.form;
            for (let step of path) {
                if (typeof target !== "object")
                    throw new Error("wrong path");
                if (!Object.keys(target).includes(step))
                    throw new Error("wrong path");
                target = target[step];
            }
            if (openChannel && (target?.prototype instanceof RPCSource) && isESClass(target)) {
                const MetaConstructor = function (...args) {
                    return Reflect.construct(target, args, MetaConstructor);
                };
                MetaConstructor.prototype = target.prototype;
                MetaConstructor.connection = con;
                MetaConstructor.autoClose = true;
                const result = MetaConstructor(...args);
                result.#autoDispose = MetaConstructor.autoClose;
                return result;
            }
            return target.apply(con, args);
        };
    }
    withEventTypes() {
        return this;
    }
    setState(state) {
        if (this.disposed)
            throw new Error("disposed");
        const oldState = this.#state;
        const newState = typeof state === "function" ? state(oldState) : state;
        const stateChanged = this.#state !== newState;
        this.#state = newState;
        if (stateChanged) {
            this.#innerEvents.emitWithTry("state", newState, oldState);
        }
        return this;
    }
    withState(...stateArgs) {
        if (stateArgs.length > 0)
            this.#state = stateArgs[0];
        return this;
    }
    #disposed = false;
    get disposed() {
        return this.#disposed;
    }
    emit(event, ...args) {
        return this.emitFor(undefined, event, ...args);
    }
    emitFor(predicate, event, ...args) {
        if (this.#disposed)
            throw new Error("disposed");
        const path = (typeof event === "string") ? [event] : event;
        this.#innerEvents.emitWithTry("message", this.#getPredicateFilter(predicate), path, args);
        return this;
    }
    #getPredicateFilter(predicate) {
        if (predicate == null)
            return;
        if (typeof predicate === "function")
            return predicate;
        const matches = new Set();
        const add = (param) => {
            if (Symbol.iterator in param) {
                for (let paramElement of param)
                    add(paramElement);
            }
            else {
                matches.add(param);
            }
        };
        add(predicate);
        return (c) => matches.has(c);
    }
    dispose(reason) {
        if (this.#disposed)
            return;
        this.#disposed = true;
        this.#innerEvents.emitWithTry("dispose", reason);
    }
    [Symbol.dispose]() {
        this.dispose("disposed");
    }
    static start(rpcSource, room, { maxChannelsPerClient = Infinity, key = "$rpc" } = {}) {
        const channels = new WeakMap;
        const onConnectionMessage = async (con, ...args) => {
            if (args.length < 4)
                return;
            const [incomingKey, channelId, operationId, ...msgArgs] = args;
            if (incomingKey !== key)
                return;
            const source = channelId === undefined ? rpcSource : channels.get(con)?.get(channelId)?.source;
            if (!source) {
                con.send(incomingKey, channelId, 1, new Error("wrong channel"));
                if (operationId === 2) {
                    con.send(incomingKey, msgArgs[0], 1, new Error("wrong channel"));
                }
                return;
            }
            if (operationId === 0) {
                const [callId, path, callArgs] = msgArgs;
                try {
                    try {
                        const result = await source.#handler(con, path, callArgs, false);
                        if (result instanceof RPCSource)
                            throw new Error("wrong data type");
                        con.send(incomingKey, channelId, 0, callId, result);
                    }
                    catch (error) {
                        con.send(incomingKey, channelId, 3, callId, error);
                    }
                }
                catch {
                    con.send(incomingKey, channelId, 3, callId, "parse error");
                }
                return;
            }
            if (operationId === 1) {
                const reason = msgArgs[0];
                const channel = channels.get(con)?.get(channelId);
                channels.get(con)?.delete(channelId);
                channel?.close(reason);
                return;
            }
            if (operationId === 2) {
                const [newChannelId, path, callArgs] = msgArgs;
                try {
                    try {
                        let map = channels.get(con);
                        if (!map)
                            channels.set(con, map = new Map());
                        if (map.size >= maxChannelsPerClient)
                            throw new Error("channels limit");
                        const result = await source.#handler(con, path, callArgs, true);
                        if (!(result instanceof RPCSource))
                            throw new Error("wrong data type");
                        if (result.disposed)
                            throw new Error("channel is disposed");
                        const onSourceDispose = (disposeReason) => {
                            con.send(incomingKey, newChannelId, 1, disposeReason);
                            channels.get(con)?.delete(newChannelId);
                        };
                        const onSourceMessage = (filter, path, args) => {
                            if (filter && !filter(con))
                                return;
                            con.send(incomingKey, newChannelId, 4, path, args);
                        };
                        const onSourceState = (state) => {
                            con.send(incomingKey, newChannelId, 2, state);
                        };
                        const dispose = (reason) => {
                            result.#innerEvents.off("dispose", onSourceDispose);
                            result.#innerEvents.off("message", onSourceMessage);
                            result.#innerEvents.off("state", onSourceState);
                            const deleted = channels.get(con)?.delete(newChannelId);
                            if (deleted)
                                con.send(incomingKey, newChannelId, 1, reason);
                            if (result.#autoDispose)
                                result.dispose(reason);
                        };
                        const channel = new RPCSourceChannel(result, con, dispose);
                        con.send(incomingKey, newChannelId, 2, result.#state);
                        map.set(newChannelId, channel);
                        result.#innerEvents.once("dispose", onSourceDispose);
                        result.#innerEvents.on("message", onSourceMessage);
                        result.#innerEvents.on("state", onSourceState);
                    }
                    catch (error) {
                        con.send(incomingKey, newChannelId, 1, error);
                    }
                }
                catch {
                    con.send(incomingKey, newChannelId, 1, "parse error");
                }
                return;
            }
        };
        const clearChannelsForConnection = (con) => {
            for (let channel of channels.get(con)?.values() ?? []) {
                channel.close();
            }
        };
        const onMainRpcSourceMessage = (filter, path, args) => {
            for (let connection of room.getConnections({ ready: true })) {
                if (filter && !filter(connection))
                    continue;
                connection.send(key, undefined, 4, path, args);
            }
        };
        room.on("connectionClose", clearChannelsForConnection);
        room.on("connectionMessage", onConnectionMessage);
        rpcSource.#innerEvents.on("message", onMainRpcSourceMessage);
        return function dispose() {
            room.off("connectionMessage", onConnectionMessage);
            room.off("connectionClose", clearChannelsForConnection);
            rpcSource.#innerEvents.off("message", onMainRpcSourceMessage);
            for (let connection of room.getConnections()) {
                clearChannelsForConnection(connection);
            }
        };
    }
}
//# sourceMappingURL=RPCSource.js.map