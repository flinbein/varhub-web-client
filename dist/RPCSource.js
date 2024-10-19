import { EventBox } from "./EventBox.js";
export class RPCSource {
    #handler;
    #events = new EventBox(this);
    constructor(handler) {
        if (typeof handler === "object") {
            const form = handler;
            handler = (con, construct, path, args) => {
                let target = form;
                for (let step of path)
                    target = target[step];
                return target.apply(con, args);
            };
        }
        this.#handler = handler;
    }
    withEventTypes() {
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
    static start(rpcSource, room, key, options = { maxChannelsPerClient: Infinity }) {
        const channels = new WeakMap;
        const onConnectionMessage = async (con, ...args) => {
            if (args.length < 4)
                return;
            const [key, channelId, operationId, ...msgArgs] = args;
            if (key !== key)
                return;
            const source = channelId === undefined ? rpcSource : channels.get(con)?.get(channelId)?.source;
            if (!source) {
                con.send(key, channelId, 1, new Error("wrong channel"));
                if (operationId === 2) {
                    con.send(key, msgArgs[0], 1, new Error("wrong channel"));
                }
                return;
            }
            if (operationId === 0) {
                const [callId, path, callArgs] = msgArgs;
                try {
                    try {
                        const result = await source.#handler(con, false, path, callArgs);
                        if (result instanceof RPCSource)
                            throw new Error("wrong data type");
                        con.send(key, channelId, 0, callId, result);
                    }
                    catch (error) {
                        con.send(key, channelId, 3, callId, error);
                    }
                }
                catch {
                    con.send(key, channelId, 3, callId, "parse error");
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
                        const result = await source.#handler(con, true, path, callArgs);
                        if (!(result instanceof RPCSource))
                            throw new Error("wrong data type");
                        if (result.disposed)
                            throw new Error("channel is disposed");
                        const onSourceDispose = (disposeReason) => {
                            con.send(key, newChannelId, 1, disposeReason);
                            channels.get(con)?.delete(newChannelId);
                        };
                        const onSourceMessage = (path, args) => {
                            if (!Array.isArray(path))
                                path = [path];
                            con.send(key, newChannelId, 4, path, args);
                        };
                        const dispose = () => {
                            result.#events.subscriber.off("dispose", onSourceDispose);
                            result.#events.subscriber.off("message", onSourceMessage);
                        };
                        con.send(key, newChannelId, 2, undefined);
                        map.set(newChannelId, { dispose, source: result });
                        result.#events.subscriber.once("dispose", onSourceDispose);
                        result.#events.subscriber.on("message", onSourceMessage);
                    }
                    catch (error) {
                        con.send(key, newChannelId, 1, error);
                    }
                }
                catch {
                    con.send(key, newChannelId, 1, "parse error");
                }
                return;
            }
        };
        const clearChannelsForConnection = (con) => {
            for (let connection of room.getConnections()) {
                for (let value of channels.get(connection)?.values() ?? []) {
                    value.dispose();
                }
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
//# sourceMappingURL=RPCSource.js.map