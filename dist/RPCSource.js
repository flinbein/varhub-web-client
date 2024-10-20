import { EventBox } from "./EventBox.js";
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
export class RPCSource {
    #handler;
    #events = new EventBox(this);
    #state;
    get state() { return this.#state; }
    constructor(handler, initialState) {
        this.#state = initialState;
        if (typeof handler === "object") {
            const form = handler;
            handler = function (con, path, args, creatingNewChannel) {
                let target = form;
                for (let step of path)
                    target = target[step];
                if (creatingNewChannel && isESClass(target)) {
                    const MetaConstructor = function () { return con; };
                    MetaConstructor.prototype = target.prototype;
                    MetaConstructor.connection = con;
                    return Reflect.construct(target, args, MetaConstructor);
                }
                return target.apply(con, args);
            };
        }
        this.#handler = handler;
    }
    withEventTypes() {
        return this;
    }
    setState(state) {
        const newState = typeof state === "function" ? state(this.#state) : state;
        const stateChanged = this.#state !== newState;
        this.#state = newState;
        if (stateChanged)
            this.#events.dispatch("state", [newState]);
        return this;
    }
    withState(state) {
        this.#state = state;
        return this;
    }
    #disposed = false;
    get disposed() {
        return this.#disposed;
    }
    emit(event, ...args) {
        if (this.#disposed)
            throw new Error("disposed");
        this.#events.dispatch("message", [event, args]);
        return this;
    }
    dispose(reason) {
        this.#disposed = true;
        this.#events.dispatch("dispose", [reason]);
        this.#events.clear();
    }
    [Symbol.dispose]() {
        this.dispose("disposed");
    }
    static start(rpcSource, room, baseKey, options = { maxChannelsPerClient: Infinity }) {
        const channels = new WeakMap;
        const onConnectionMessage = async (con, ...args) => {
            if (args.length < 4)
                return;
            const [incomingKey, channelId, operationId, ...msgArgs] = args;
            if (incomingKey !== baseKey)
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
                const subscriber = channels.get(con)?.get(channelId);
                subscriber?.dispose();
                channels.get(con)?.delete(channelId);
                return;
            }
            if (operationId === 2) {
                const [newChannelId, path, callArgs] = msgArgs;
                try {
                    try {
                        let map = channels.get(con);
                        if (!map)
                            channels.set(con, map = new Map());
                        if (map.size >= options.maxChannelsPerClient)
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
                        const onSourceMessage = (path, args) => {
                            if (!Array.isArray(path))
                                path = [path];
                            con.send(incomingKey, newChannelId, 4, path, args);
                        };
                        const onSourceState = (state) => {
                            con.send(incomingKey, newChannelId, 2, state);
                        };
                        const dispose = () => {
                            result.#events.subscriber.off("dispose", onSourceDispose);
                            result.#events.subscriber.off("message", onSourceMessage);
                            result.#events.subscriber.off("state", onSourceState);
                        };
                        con.send(incomingKey, newChannelId, 2, result.#state);
                        map.set(newChannelId, { dispose, source: result });
                        result.#events.subscriber.once("dispose", onSourceDispose);
                        result.#events.subscriber.on("message", onSourceMessage);
                        result.#events.subscriber.on("state", onSourceState);
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
            for (let value of channels.get(con)?.values() ?? []) {
                value.dispose();
            }
        };
        room.on("connectionClose", clearChannelsForConnection);
        room.on("connectionMessage", onConnectionMessage);
        return function dispose() {
            room.off("connectionMessage", onConnectionMessage);
            room.off("connectionClose", clearChannelsForConnection);
            for (let connection of room.getConnections()) {
                clearChannelsForConnection(connection);
            }
        };
    }
}
const x = new RPCSource({}).withState();
x.setState(5);
//# sourceMappingURL=RPCSource.js.map