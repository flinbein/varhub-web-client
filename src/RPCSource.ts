import { EventBox } from "./EventBox.js";
import type { XJData } from "@flinbein/xjmapper";
import type { Connection, RoomSocketHandler } from "./RoomSocketHandler.js";


type RPCHandler = ((
	connection: Connection,
	path: string[],
	args: XJData[],
	creatingNewChannel: boolean,
) => XJData | Promise<XJData> | RPCSource);

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

const isConstructable = (fn: any) => {
	try {
		return Boolean(class E extends fn {})
	} catch {
		return false
	}
};

const isESClass = (fn: any) => (
	typeof fn === 'function' && isConstructable(fn) &&
	Function.prototype.toString.call(fn).startsWith("class")
);

export class RPCSource<METHODS extends Record<string, any> = {}, STATE = undefined, EVENTS = {}> implements Disposable {
	#handler: RPCHandler
	#events = new EventBox<{message: [string|string[], XJData[]], state: [STATE], dispose: [XJData]}, this>(this);
	#state?: STATE;
	declare public [Symbol.unscopables]: {
		__rpc_methods: METHODS,
		__rpc_events: EVENTS,
		__rpc_state: STATE,
	};
	
	get state(){return this.#state}
	
	declare public connection: Connection;
	
	constructor(handler?: RPCHandler|METHODS, initialState?: STATE) {
		this.#state = initialState;
		if (typeof handler === "object") {
			const form = handler;
			handler = function(con: Connection, path: string[], args: XJData[], creatingNewChannel: boolean) {
				let target: any = form;
				for (let step of path) target = target[step];
				if (creatingNewChannel && isESClass(target)) {
					const MetaConstructor = function (){return con}
					MetaConstructor.prototype = target.prototype;
					MetaConstructor.connection = con;
					return Reflect.construct(target, args, MetaConstructor);
				}
				return target.apply(con, args);
			}
		}
		this.#handler = handler as any;
	}
	
	withEventTypes<E = EVENTS>(): RPCSource<METHODS, STATE, E>{
		return this as any;
	}
	
	setState(state: (oldState: STATE) => STATE): this
	setState(state: STATE extends (...args: any) => any ? never : STATE): this
	setState(state: any): this{
		const newState = typeof state === "function" ? state(this.#state) : state;
		const stateChanged = this.#state !== newState;
		this.#state = newState;
		if (stateChanged) this.#events.dispatch("state", [newState]);
		return this;
	}
	
	withState<S>(): RPCSource<METHODS, S|undefined, EVENTS>
	withState<S>(state: S): RPCSource<METHODS, S, EVENTS>
	withState(state?: any) {
		this.#state = state;
		return this;
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
	
	static start(rpcSource: RPCSource<any, undefined, any>, room: RoomSocketHandler, baseKey: string, options: {maxChannelsPerClient: number} = {maxChannelsPerClient: Infinity}){
		const channels = new WeakMap<Connection, Map<number, {source: RPCSource, dispose: () => void}>>
		const onConnectionMessage = async (con: Connection, ...args: XJData[]) => {
			if (args.length < 4) return;
			const [incomingKey, channelId, operationId, ...msgArgs] = args;
			if (incomingKey !== baseKey) return;
			const source = channelId === undefined ? rpcSource : channels.get(con)?.get(channelId as any)?.source;
			if (!source) {
				con.send(incomingKey, channelId, REMOTE_ACTION.CLOSE, new Error("wrong channel"));
				if (operationId === CLIENT_ACTION.CREATE) {
					con.send(incomingKey, msgArgs[0], REMOTE_ACTION.CLOSE, new Error("wrong channel"));
				}
				return;
			}
			if (operationId === CLIENT_ACTION.CALL) {
				const [callId, path, callArgs] = msgArgs;
				try {
					try {
						const result = await source.#handler(con, path as any[], callArgs as any[], false);
						if (result instanceof RPCSource) throw new Error("wrong data type");
						con.send(incomingKey, channelId, REMOTE_ACTION.RESPONSE_OK, callId, result);
					} catch (error) {
						con.send(incomingKey, channelId, REMOTE_ACTION.RESPONSE_ERROR, callId, error as any);
					}
				} catch {
					con.send(incomingKey, channelId, REMOTE_ACTION.RESPONSE_ERROR, callId, "parse error");
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
						if (!map) channels.set(con, map  = new Map());
						
						if (map.size >= options.maxChannelsPerClient) throw new Error("channels limit");
						const result = await source.#handler(con, path as any[], callArgs as any[], true);
						if (!(result instanceof RPCSource)) throw new Error("wrong data type");
						if (result.disposed) throw new Error("channel is disposed");
						const onSourceDispose = (disposeReason: XJData) => {
							con.send(incomingKey, newChannelId, REMOTE_ACTION.CLOSE, disposeReason);
							channels.get(con)?.delete(newChannelId as any);
						}
						const onSourceMessage = (path: string|string[], args: XJData[]) => {
							if (!Array.isArray(path)) path = [path];
							con.send(incomingKey, newChannelId, REMOTE_ACTION.EVENT, path, args);
						}
						const onSourceState = (state: XJData) => {
							con.send(incomingKey, newChannelId, REMOTE_ACTION.CREATE, state);
						}
						const dispose = () => {
							result.#events.subscriber.off("dispose", onSourceDispose)
							result.#events.subscriber.off("message", onSourceMessage)
							result.#events.subscriber.off("state", onSourceState)
						}
						con.send(incomingKey, newChannelId, REMOTE_ACTION.CREATE, result.#state);
						map.set(newChannelId as any, {dispose, source: result});
						result.#events.subscriber.once("dispose", onSourceDispose);
						result.#events.subscriber.on("message", onSourceMessage);
						result.#events.subscriber.on("state", onSourceState);
					} catch (error) {
						con.send(incomingKey, newChannelId, REMOTE_ACTION.CLOSE, error as any);
					}
				} catch {
					con.send(incomingKey, newChannelId, REMOTE_ACTION.CLOSE, "parse error");
				}
				return
			}
		}
		const clearChannelsForConnection = (con: Connection) => {
			for (let value of channels.get(con)?.values() ?? []) {
				value.dispose();
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

const x = new RPCSource({}).withState<number>()
x.setState(5);
