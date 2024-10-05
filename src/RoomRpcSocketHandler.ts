import { RoomSocketHandler, RoomSocketHandlerEvents } from "./RoomSocketHandler.js";
import { XJData } from "@flinbein/xjmapper";

export class RoomRpcSocketHandler<T extends Record<string, ((this: {connection: number}, ...args: any) => any)>> extends RoomSocketHandler {
	
	constructor(ws: WebSocket, public methods: T) {
		super(ws);
		this.on("message", async (conId, ...message) => {
			const [rpcKey = "", callId = undefined, ...callArgs] = message;
			if (rpcKey !== "$rpc") return;
			try {
				try {
					const result = await this.#rpcCall(conId, ...callArgs);
					super.send(conId, "$rpcResult", callId, 0, result);
				} catch (error) {
					super.send(conId, "$rpcResult", callId, 1, error);
				}
			} catch {
				super.send(conId, "$rpcResult", callId, 2);
			}
		})
	}
	
	#rpcCall(conId: number, ...args: XJData[]) {
		const [methodName, ...methodArgs] = args;
		if (typeof methodName !== "string") throw new Error(`wrong method name format`);
		const method = this.methods[methodName];
		if (!method) throw new Error(`wrong method name`);
		return method.apply({connection: conId}, methodArgs);
	}
	
	
	broadcast(newerCallThisMethod: never): never {
		throw new Error("unimplemented")
	}
	
	send(newerCallThisMethod: never): never {
		throw new Error("unimplemented")
	}
	
	broadcastEvent(...args: any){
		super.broadcast("$rpcEvent", ...args);
	}
	
	sendEvent(conId: number|number[], ...args: any){
		super.send(conId, "$rpcEvent", ...args);
	}
}
