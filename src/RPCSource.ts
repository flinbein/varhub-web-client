import EventEmitter from "./EventEmitter.js";
import type { XJData } from "@flinbein/xjmapper";
import type { Connection, RoomSocketHandler as Room } from "./RoomSocketHandler.js";
import { RPCChannel } from "./RPCChannel.js";

/**
 * remote call handler for {@link RPCSource}
 * @param connection - client's connection
 * @param path - path of remote function.
 * For example, when client call `rpc.math.sum(1, 2)` path will be `["math", "summ"]`.
 * @param args - arguments with which the remote function was called
 * For example, when client call `rpc.math.sum(1, 2)` args will be `[1, 2]`.
 * @param openChannel - true if the client called rpc as constructor (with `new`).
 * In this case the handler must return a {@link RPCSource} or {@link Promise}<{@link RPCSource}>.
 */
export type RPCHandler = (
	connection: Connection,
	path: string[],
	args: XJData[],
	openChannel: boolean,
) => XJData | Promise<XJData> | RPCSource;

/** @hidden */
type EventPath<T, K extends keyof T = keyof T> = (
	K extends (string|number) ? (
		T[K] extends infer P ? (
			0 extends (1 & P) ? (K | [K, ...(number|string)[]]) :
			P extends unknown[] ? (K | [K]) : [K, ...(
				EventPath<T[K]> extends infer NEXT extends ((string|number)|(string|number)[]) ? (
					NEXT extends any[] ? NEXT : [NEXT]
				) : never
			)]
		): never
	) : never
);

type EventPathArgs<PATH extends number|string|(number|string)[], FORM> = (
	0 extends (1 & FORM) ? any[] :
	PATH extends (number|string) ? EventPathArgs<[PATH], FORM> :
	PATH extends [] ? FORM extends any[] ? 0 extends (1 & FORM) ? any[] : FORM : never :
	PATH extends [infer PROP, ...infer TAIL extends (number|string)[]] ? (
		PROP extends keyof FORM ? EventPathArgs<TAIL, FORM[PROP]> : never
	) : never
);

const enum CLIENT_ACTION {
	CALL = 0,
	CLOSE = 1,
	CREATE = 2,
	NOTIFY = 3,
}

const enum REMOTE_ACTION {
	RESPONSE_OK = 0,
	CLOSE = 1,
	STATE = 2,
	RESPONSE_ERROR = 3,
	EVENT = 4
}

const isConstructable = (fn: any) => {
	try {
		return Boolean(class extends fn {})
	} catch {
		return false
	}
};

const isESClass = (fn: any) => (
	typeof fn === 'function' && isConstructable(fn) &&
	Function.prototype.toString.call(fn).startsWith("class")
);

/** @hidden */
class RPCSourceChannel<S = RPCSource> {
	readonly #source;
	readonly #connection;
	readonly #closeHook;
	#closed: boolean = false;
	/** @hidden */
	constructor(source: RPCSource, connection: Connection, closeHook: (reason: XJData) => void) {
		this.#source = source;
		this.#connection = connection;
		this.#closeHook = closeHook;
	}
	
	/**
	 * channel is closed
	 */
	get closed() {return this.#closed}
	/**
	 * get rpc source
	 */
	get source(): S {return this.#source as any;}
	/**
	 * get client's connection
	 */
	get connection(){return this.#connection;}
	
	/**
	 * close this communication channel
	 * @param reason
	 */
	close(reason?: XJData){
		if (this.#closed) return;
		this.#closed = true;
		this.#closeHook(reason);
	}
}
/** @hidden */
export type { RPCSourceChannel };

export type DeepIterable<T> = T | Iterable<DeepIterable<T>>;

type BoxMethods<T, PREFIX extends string> = {
	[KEY in keyof T as KEY extends `${PREFIX}${infer NAME}` ? NAME : never]: T[KEY]
}

type MetaScopeValue<METHODS, EVENTS, STATE> = {
	[Symbol.unscopables]: {
		__rpc_methods: METHODS,
		__rpc_events: EVENTS,
		__rpc_state: STATE,
	}
}

type RestParams<T extends any[]> = T extends [any, ...infer R] ? R : never;

const dangerPropNames = [
	"__proto__",
	"__defineGetter__",
	"__defineSetter__",
	"__lookupGetter__",
	"__lookupSetter__",
]

/**
 * Remote procedure call handler
 */
export default class RPCSource<METHODS extends Record<string, any> | string = {}, STATE = undefined, EVENTS = any> implements Disposable {
	
	static with <
		const BIND_METHODS extends string | Record<string, any> = {},
		BIND_STATE = undefined,
		const BIND_EVENTS = {}
	>(): {
		new<METHODS extends Record<string, any> | string = BIND_METHODS, STATE = BIND_STATE, EVENTS = BIND_EVENTS>(methods: METHODS, state?: STATE): RPCSource<METHODS, STATE, EVENTS>,
		prototype: RPCSource<any, any, any>
	};
	/**
	 * Create a new constructor of {@link RPCSource} with bound methods.
	 * @example
	 * ```typescript
	 * export class Counter extends RPCSource.with("$_")<number> {
	 *   $_increment(){
	 *     this.setState(this.state + 1);
	 *   }
	 * }
	 * // client code
	 * const rpc = new RPCChannel(client);
	 * const rpcCounter = new rpc.Counter(100);
	 * await rpcCounter.increment();
	 * console.log(rpcCounter.state) // 101
	 * ```
	 * @param methods bound methods for remote call
	 */
	static with<
		const BIND_METHODS extends Record<string, any> | string = {},
		BIND_STATE = undefined,
		const BIND_EVENTS = {}
	>(methods: BIND_METHODS | RPCHandler): {
		new<STATE = BIND_STATE, EVENTS = BIND_EVENTS>(state?: STATE): RPCSource<BIND_METHODS, STATE, EVENTS>,
		prototype: RPCSource<any, any, any>
	};
	/**
	 * Create a new constructor of {@link RPCSource} with bound methods and initial state.
	 * @example
	 * ```typescript
	 * const Counter = RPCSource.with({}, 0);
	 * export const counter = new Counter();
	 * setInterval(() => {
	 *   counter.setState(state => state+1)
	 * }, 1000);
	 * ```
	 * @param methods bound methods for remote call
	 * @param state initial state
	 */
	static with<
		const BIND_METHODS extends Record<string, any> | string = {},
		BIND_STATE = undefined,
		const BIND_EVENTS = {}
	>(methods: BIND_METHODS | RPCHandler, state: BIND_STATE): {
		new<EVENTS = BIND_EVENTS>(): RPCSource<BIND_METHODS, BIND_STATE, EVENTS>,
		prototype: RPCSource<any, any, any>
	};
	static with (this: FunctionConstructor, ...prependArgs: any): any {
		return class extends this {
			constructor(...args: any) {
				super(...prependArgs, ...args);
			}
		};
	}
	
	#handler: RPCHandler
	#autoDispose = false
	#innerEvents = new EventEmitter<{
		message: [filter: undefined | ((connection: Connection) => boolean), eventPath: (string|number)[], eventData: XJData[]],
		state: [STATE],
		dispose: [XJData],
		channel: [RPCSourceChannel],
	}>();
	#state?: STATE;
	/** @hidden */
	declare public [Symbol.unscopables]: MetaScopeValue<METHODS extends string ? BoxMethods<this, METHODS> : METHODS, EVENTS, STATE>
	
	/**
	 * get current state
	 */
	get state(): STATE {return this.#state as any}
	
	/**
	 * Create new instance of RPC
	 * @example
	 * ```typescript
	 * // remote code
	 * const rpcSource = new RPCSource((connection: Connection, path: string[], args: any[], openChannel: boolean) => {
	 *   console.log("connection:", this);
	 *   if (path.length === 0 && path[0] === "sum") return args[0] + args[1];
	 *   throw new Error("method not found");
	 * });
	 * RPCSource.start(rpcSource, room);
	 * ```
	 * ```typescript
	 * // client code
	 * const rpc = new RPCChannel(client);
	 * const result = await rpc.test(5, 3);
	 * console.assert(result === 8);
	 * ```
	 * @example
	 * ```typescript
	 * // remote code
	 * const rpcSource = new RPCSource({
	 *   sum(x, y){
	 *     console.log("connection:", this);
	 *     return x + y;
	 *   }
	 * });
	 * RPCSource.start(rpcSource, room);
	 * ```
	 * ```typescript
	 * // client code
	 * const rpc = new RPCChannel(client);
	 * const result = await rpc.test(5, 3);
	 * console.assert(result === 8);
	 * ```
	 * @param {RPCHandler|METHODS} handler
	 * handler can be:
	 * - `function` of type {@link RPCHandler};
	 * - `object` with methods for remote call.
	 * - `string` prefix: use self methods starting with prefix for remote call.
	 * @param initialState
	 */
	constructor(handler?: RPCHandler|METHODS, initialState?: STATE) {
		this.#state = initialState;
		if (typeof handler === "object") handler = RPCSource.createDefaultHandler({form: handler});
		else if (typeof handler === "string") handler = RPCSource.createDefaultHandler({form: this}, handler);
		this.#handler = handler as any;
	}
	
	/**
	 * create {@link RPCHandler} based on object with methods
	 * @param parameters
	 * @param parameters.form object with methods.
	 * @param prefix prefix of used methods, empty by default
	 * @returns - {@link RPCHandler}
	 */
	static createDefaultHandler(parameters: {form: any}, prefix: string = ""): RPCHandler {
		if (prefix) {
			for (let prop of dangerPropNames) {
				if (prop.startsWith(prefix)) throw new Error("prefix "+prefix+" is danger");
			}
		}
		return function(con: Connection, path: string[], args: XJData[], openChannel: boolean) {
			let target: any = parameters?.form;
			for (let i=0; i<path.length; i++) {
				const step = i === 0 ? prefix + path[i] : path[i];
				if (dangerPropNames.includes(step)) throw new Error("wrong path: "+step+" in ("+prefix+")"+path.join(".")+": forbidden step");
				if (typeof target !== "object") throw new Error("wrong path: "+step+" in ("+prefix+")"+path.join(".")+": not object");
				if (i > 0 || !prefix){
					if (!Object.keys(target).includes(step)) {
						throw new Error("wrong path: "+step+" in ("+prefix+")"+path.join(".")+": forbidden prop");
					}
				}
				target = target[step];
			}
			if (openChannel && args.length === 0) {
				if (target instanceof RPCSource) return target;
				if (typeof target?.then === "function") return target;
			}
			if (openChannel && (target?.prototype instanceof RPCSource) && isESClass(target)) {
				const MetaConstructor = function (...args: any){
					return Reflect.construct(target, args, MetaConstructor);
				}
				MetaConstructor.prototype = target.prototype;
				MetaConstructor.connection = con;
				MetaConstructor.autoClose = true;
				const result: RPCSource = MetaConstructor(...args);
				result.#autoDispose = MetaConstructor.autoClose
				return result;
			}
			return target.apply(con, args);
		}
	}
	
	/**
	 * Create function to handle RPC of connection with {@link Connection} as 1st argument
	 * @example
	 * ```typescript
	 * class Deck extends RPCSource<{}, boolean> {
	 *   constructor(){
	 *     super({}, false);
	 *   }
	 *
	 *   doSomething = this.bindConnection((connection, ...args) => {
	 *     console.log(connection, "call doSomething with args:", args);
	 *     this.setState(true)
	 *   });
	 * }
	 * ```
	 * @param handler method handler with prepended {@link Connection}
	 */
	bindConnection<A extends (this: this, c: Connection, ...args: any) => any>(
		handler: A
	): (this: ThisParameterType<A>, ...args: RestParams<Parameters<A>>) => ReturnType<A> {
		const that = this;
		return function (this: Connection, ...args: any){
			return handler.call(that, this, ...args);
		} as any;
	}
	
	/** apply generic types for events */
	withEventTypes<E = EVENTS>(): RPCSource<METHODS, STATE, E>{
		return this as any;
	}
	
	/** @hidden */
	setState(state: (oldState: STATE) => STATE): this
	/**
	 * set new state
	 * @param state
	 * - new state value, if state is not a function.
	 * - function takes the current state and returns a new one
	 */
	setState(state: STATE extends (...args: any) => any ? never : STATE): this
	setState(state: any): this{
		if (this.disposed) throw new Error("disposed");
		const newState = typeof state === "function" ? state(this.#state) : state;
		if (this.#state === newState) return this;
		this.#state = newState;
		this.#innerEvents.emitWithTry("state", newState);
		return this;
	}
	
	/** apply generic types for state. */
	withState<S>(): RPCSource<METHODS, S, EVENTS>
	/** apply generic types for state and set new state. */
	withState<S>(state: S): RPCSource<METHODS, S, EVENTS>
	withState(...stateArgs: any[]) {
		if (stateArgs.length > 0) this.#state = stateArgs[0];
		return this;
	}
	
	#disposed = false;
	get disposed(){
		return this.#disposed;
	}
	
	/**
	 * Emit event for all connected clients.
	 * Reserved event names: `close`, `init`, `error`, `state`
	 * @param event path for event. String or array of strings.
	 * @param args event values
	 */
	emit<P extends 0 extends (1&EVENTS) ? (string|number|(string|number)[]) : EventPath<EVENTS>>(
		event: P,
		...args: 0 extends (1&EVENTS) ? any[] : EventPathArgs<P, EVENTS>
	): this{
		return this.emitFor(undefined, event, ...args);
	}
	
	/**
	 * Emit event for all connected clients.
	 * Reserved event names: `close`, `init`, `error`, `state`
	 * @param predicate event will be sent only to the listed connections.
	 * @param event path for event. String or array of strings.
	 * @param args event values
	 */
	emitFor<P extends 0 extends (1&EVENTS) ? (string|number|(string|number)[]) : EventPath<EVENTS>>(
		predicate: DeepIterable<Connection> | ((con: Connection) => any) | null | undefined,
		event: P,
		...args: 0 extends (1&EVENTS) ? any[] : EventPathArgs<P, EVENTS>
	): this {
		if (this.#disposed) throw new Error("disposed");
		const path: (string|number)[] = (typeof event === "string" || typeof event === "number") ? [event] : event;
		this.#innerEvents.emitWithTry("message", this.#getPredicateFilter(predicate), path, args);
		return this;
	}
	
	#getPredicateFilter(
		predicate: DeepIterable<Connection> | ((con: Connection) => any) | null | undefined,
	): undefined | ((con: Connection) => boolean) {
		if (predicate == null) return;
		if (typeof predicate === "function") return predicate;
		const matches = new Set<Connection>();
		const add = (param: DeepIterable<Connection>) => {
			if (Symbol.iterator in param) {
				for (let paramElement of param) add(paramElement);
			} else {
				matches.add(param);
			}
		}
		add(predicate);
		return (c) => matches.has(c);
	}
	
	/**
	 * dispose this source and disconnect all channels
	 * @param reason
	 */
	dispose(reason?: XJData){
		if (this.#disposed) return;
		this.#disposed = true;
		this.#innerEvents.emitWithTry("dispose", reason);
	}
	
	/**
	 * dispose this source and disconnect all channels
	 */
	[Symbol.dispose](){
		this.dispose("disposed");
	}
	
	/**
	 * start listening for messages and processing procedure calls
	 * @param rpcSource message handler
	 * @param room room
	 * @param maxChannelsPerClient set a limit on the number of opened channels
	 * @param key Special key for listening events. Default value: `"$rpc"`
	 */
	static start(rpcSource: RPCSource<any, any, any>, room: Room, {maxChannelsPerClient = Infinity, key = "$rpc"} = {}){
		const channels = new WeakMap<Connection, Map<number, RPCSourceChannel>>
		const onConnectionMessage = async (con: Connection, ...args: XJData[]) => {
			if (args.length < 3) return;
			const [incomingKey, channelId, operationId, ...msgArgs] = args;
			if (incomingKey !== key) return;
			const source = channelId === undefined ? rpcSource : channels.get(con)?.get(channelId as any)?.source;
			if (!source) {
				con.send(incomingKey, channelId, REMOTE_ACTION.CLOSE, new Error("wrong channel"));
				if (operationId === CLIENT_ACTION.CREATE) {
					con.send(incomingKey, msgArgs[0], REMOTE_ACTION.CLOSE, new Error("wrong channel"));
				}
				return;
			}
			if (operationId === CLIENT_ACTION.NOTIFY) {
				const [path, callArgs] = msgArgs;
				try {
					source.#handler(con, path as any[], callArgs as any[], false);
				} catch {}
			}
			if (operationId === CLIENT_ACTION.CALL) {
				if (msgArgs.length === 0) /*request state*/ {
					try {
						con.send(incomingKey, channelId, REMOTE_ACTION.STATE, source.state);
					} catch {
						con.send(incomingKey, channelId, REMOTE_ACTION.STATE, new Error("state parse error"));
					}
					return;
				}
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
				const reason = msgArgs[0];
				const channel = channels.get(con)?.get(channelId as any);
				channels.get(con)?.delete(channelId as any);
				channel?.close(reason);
				return;
			}
			if (operationId === CLIENT_ACTION.CREATE) {
				const [newChannelId, path, callArgs] = msgArgs;
				try {
					try {
						let map = channels.get(con);
						if (!map) channels.set(con, map  = new Map());
						if (map.size >= maxChannelsPerClient) throw new Error("channels limit");
						const result = await source.#handler(con, path as any[], callArgs as any[], true);
						if (!(result instanceof RPCSource)) throw new Error("wrong data type");
						if (result.disposed) throw new Error("channel is disposed");
						const onSourceDispose = (disposeReason: XJData) => {
							con.send(incomingKey, newChannelId, REMOTE_ACTION.CLOSE, disposeReason);
							channels.get(con)?.delete(newChannelId as any);
						}
						const onSourceMessage = (filter: undefined | ((con: Connection) => boolean), path: (string|number)[], args: XJData[]) => {
							if (filter && !filter(con)) return;
							con.send(incomingKey, newChannelId, REMOTE_ACTION.EVENT, path, args);
						}
						const onSourceState = (state: XJData) => {
							try {
								con.send(incomingKey, newChannelId, REMOTE_ACTION.STATE, state);
							} catch {
								con.send(incomingKey, newChannelId, REMOTE_ACTION.STATE, new Error("state parse error"));
							}
						}
						const dispose = (reason: XJData) => {
							result.#innerEvents.off("dispose", onSourceDispose);
							result.#innerEvents.off("message", onSourceMessage);
							result.#innerEvents.off("state", onSourceState);
							const deleted = channels.get(con)?.delete(newChannelId as any);
							if (deleted) con.send(incomingKey, newChannelId, REMOTE_ACTION.CLOSE, reason);
							if (result.#autoDispose) result.dispose(reason);
						}
						
						const channel = new RPCSourceChannel(result, con, dispose);
						try {
							con.send(incomingKey, newChannelId, REMOTE_ACTION.STATE, result.#state);
						} catch {
							con.send(incomingKey, newChannelId, REMOTE_ACTION.STATE, new Error("state parse error"));
						}
						
						map.set(newChannelId as any, channel);
						result.#innerEvents.once("dispose", onSourceDispose);
						result.#innerEvents.on("message", onSourceMessage);
						result.#innerEvents.on("state", onSourceState);
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
			for (let channel of channels.get(con)?.values() ?? []) {
				channel.close();
			}
		}
		const onMainRpcSourceMessage = (filter: ((con: Connection) => boolean) | undefined, path: (string|number)[], args: any[]) => {
			for (let connection of room.getConnections({ready: true})) {
				if (filter && !filter(connection)) continue;
				connection.send(key, undefined, REMOTE_ACTION.EVENT, path, args)
			}
		}
		const onMainRpcState = (state: XJData) => {
			for (let connection of room.getConnections({ready: true})) try {
				connection.send(key, undefined, REMOTE_ACTION.STATE, state)
			} catch {
				connection.send(key, undefined, REMOTE_ACTION.STATE, new Error("state parse error"))
			}
		}
		room.on("connectionClose", clearChannelsForConnection);
		room.on("connectionMessage", onConnectionMessage);
		rpcSource.#innerEvents.on("message", onMainRpcSourceMessage);
		rpcSource.#innerEvents.on("state", onMainRpcState);
		return function dispose(){
			room.off("connectionMessage", onConnectionMessage);
			room.off("connectionClose", clearChannelsForConnection);
			rpcSource.#innerEvents.off("message", onMainRpcSourceMessage);
			rpcSource.#innerEvents.off("state", onMainRpcState);
			for (let connection of room.getConnections()) {
				clearChannelsForConnection(connection);
			}
		}
	}
}