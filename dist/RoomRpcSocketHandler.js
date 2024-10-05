import { RoomSocketHandler } from "./RoomSocketHandler.js";
export class RoomRpcSocketHandler extends RoomSocketHandler {
    methods;
    constructor(ws, methods) {
        super(ws);
        this.methods = methods;
        this.on("message", async (conId, ...message) => {
            const [rpcKey = "", callId = undefined, ...callArgs] = message;
            if (rpcKey !== "$rpc")
                return;
            try {
                try {
                    const result = await this.#rpcCall(conId, ...callArgs);
                    super.send(conId, "$rpcResult", callId, 0, result);
                }
                catch (error) {
                    super.send(conId, "$rpcResult", callId, 1, error);
                }
            }
            catch {
                super.send(conId, "$rpcResult", callId, 2);
            }
        });
    }
    #rpcCall(conId, ...args) {
        const [methodName, ...methodArgs] = args;
        if (typeof methodName !== "string")
            throw new Error(`wrong method name format`);
        const method = this.methods[methodName];
        if (!method)
            throw new Error(`wrong method name`);
        return method.apply({ connection: conId }, methodArgs);
    }
    broadcast(newerCallThisMethod) {
        throw new Error("unimplemented");
    }
    send(newerCallThisMethod) {
        throw new Error("unimplemented");
    }
    broadcastEvent(...args) {
        super.broadcast("$rpcEvent", ...args);
    }
    sendEvent(conId, ...args) {
        super.send(conId, "$rpcEvent", ...args);
    }
}
//# sourceMappingURL=RoomRpcSocketHandler.js.map