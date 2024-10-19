import { EventBox } from "./EventBox.js";
import type { XJData } from "@flinbein/xjmapper";
import { Connection, RoomSocketHandler } from "./RoomSocketHandler.js";


type RPCHandler = (
	connection: Connection,
	subscribe: boolean,
	path: string[],
	args: XJData[],
) => XJData | RPCSource

type EventPath<T, K extends keyof T = keyof T> = (
	K extends string ? (
		T[K] extends any[] ? (K | [K]) : [K, ...(
			EventPath<T[K]> extends infer NEXT extends (string|string[]) ? (
				NEXT extends any[] ? NEXT : [NEXT]
			) : never
		)]
	) : never
)

type EventPathArgs<PATH, FORM> = (
	PATH extends keyof FORM ? (FORM[PATH] extends any[] ? FORM[PATH] : never) :
	PATH extends [] ? (FORM extends any[] ? FORM : never) :
	PATH extends [infer STEP extends string, ...infer TAIL extends string[]] ? (
		STEP extends keyof FORM ? EventPathArgs<TAIL, FORM[STEP]> : never
	) : never
)

const enum CLIENT_ACTION {
	CALL = 0,
	CLOSE = 1,
	CREATE = 2
}

const enum REMOTE_ACTION {
	RESPONSE_OK = 0,
	CLOSE = 1,
	CREATE = 2,
	RESPONSE_ERROR = 3,
	EVENT = 4
}

export class RPCSource<METHODS extends Record<string, any> = {}, EVENTS = any> implements Disposable {
	#handler: RPCHandler
	#events = new EventBox<{message: [string|string[], XJData[]], dispose: [XJData]}, this>(this);
	declare public [Symbol.unscopables]: {
		__rpc_methods: METHODS,
		__rpc_events: EVENTS,
	};
	
	constructor(handler?: RPCHandler|METHODS) {
		if (typeof handler === "object") {
			const form = handler;
			handler = (con: Connection, construct: boolean, path: string[], args: XJData[]) => {
				let target: any = form;
				for (let step of path) target = target[step];
				return target.apply(con, args);
			}
		}
		this.#handler = handler as any;
	}
	
	withEventTypes<EVENTS = never>(): RPCSource<METHODS, EVENTS>{
		return this as any;
	}
	
	#disposed = false;
	get disposed(){
		return this.#disposed;
	}
	
	emit<P extends EventPath<EVENTS>>(event: P, ...args: EventPathArgs<P, EVENTS>) {
		if (this.#disposed) throw new Error("disposed");
		this.#events.dispatch("message", [event, args]);
		return this;
	}
	
	dispose(reason?: XJData){
		this.#disposed = true;
		this.#events.dispatch("dispose", [reason]);
		this.#events.clear();
	}
	
	[Symbol.dispose](){
		this.dispose("disposed");
	}
	
	static start(rpcSource: RPCSource, room: RoomSocketHandler, key: string, options: {maxChannelsPerClient: number} = {maxChannelsPerClient: Infinity}){
		const channels = new WeakMap<Connection, Map<number, {source: RPCSource, dispose: () => void}>>
		const onConnectionMessage = async (con: Connection, ...args: XJData[]) => {
			if (args.length < 4) return;
			const [key, channelId, operationId, ...msgArgs] = args;
			if (key !== key) return;
			const source = channelId === undefined ? rpcSource : channels.get(con)?.get(channelId as any)?.source;
			if (!source) {
				con.send(key, channelId, REMOTE_ACTION.CLOSE, new Error("wrong channel"));
				if (operationId === CLIENT_ACTION.CREATE) {
					con.send(key, msgArgs[0], REMOTE_ACTION.CLOSE, new Error("wrong channel"));
				}
				return;
			}
			if (operationId === CLIENT_ACTION.CALL) {
				const [callId, path, callArgs] = msgArgs;
				try {
					try {
						const result = await source.#handler(con, false, path as any[], callArgs as any[]);
						if (result instanceof RPCSource) throw new Error("wrong data type");
						con.send(key, channelId, REMOTE_ACTION.RESPONSE_OK, callId, result);
					} catch (error) {
						con.send(key, channelId, REMOTE_ACTION.RESPONSE_ERROR, callId, error as any);
					}
				} catch {
					con.send(key, channelId, REMOTE_ACTION.RESPONSE_ERROR, callId, "parse error");
				}
				return
			}
			if (operationId === CLIENT_ACTION.CLOSE) {
				const subscriber = channels.get(con)?.get(channelId as any);
				subscriber?.dispose();
				channels.get(con)?.delete(channelId as any);
				return;
			}
			if (operationId === CLIENT_ACTION.CREATE) {
				const [newChannelId, path, callArgs] = msgArgs;
				try {
					try {
						let map = channels.get(con);
						if (!map) channels.set(con, map = new Map());
						
						if (map.size >= options.maxChannelsPerClient) throw new Error("channels limit");
						const result = await source.#handler(con, true, path as any[], callArgs as any[]);
						if (!(result instanceof RPCSource)) throw new Error("wrong data type");
						if (result.disposed) throw new Error("channel is disposed");
						const onSourceDispose = (disposeReason: XJData) => {
							con.send(key, newChannelId, REMOTE_ACTION.CLOSE, disposeReason);
							channels.get(con)?.delete(newChannelId as any);
						}
						const onSourceMessage = (path: string|string[], args: XJData[]) => {
							if (!Array.isArray(path)) path = [path];
							con.send(key, newChannelId, REMOTE_ACTION.EVENT, path, args);
						}
						const dispose = () => {
							result.#events.subscriber.off("dispose", onSourceDispose)
							result.#events.subscriber.off("message", onSourceMessage)
						}
						con.send(key, newChannelId, REMOTE_ACTION.CREATE, undefined);
						map.set(newChannelId as any, {dispose, source: result});
						result.#events.subscriber.once("dispose", onSourceDispose);
						result.#events.subscriber.on("message", onSourceMessage);
					} catch (error) {
						con.send(key, newChannelId, REMOTE_ACTION.CLOSE, error as any);
					}
				} catch {
					con.send(key, newChannelId, REMOTE_ACTION.CLOSE, "parse error");
				}
				return
			}
		}
		const clearChannelsForConnection = (con: Connection) => {
			for (let connection of room.getConnections()) {
				for (let value of channels.get(connection)?.values() ?? []) {
					value.dispose();
				}
			}
		}
		room.on("connectionClose", clearChannelsForConnection);
		room.on("connectionMessage", onConnectionMessage);
		return function dispose(){
			room.off("connectionMessage", onConnectionMessage);
			room.off("connectionClose", clearChannelsForConnection);
			for (let connection of room.getConnections()) {
				clearChannelsForConnection(connection);
			}
		}
	}
}
