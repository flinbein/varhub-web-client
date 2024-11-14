import type { XJData } from "@flinbein/xjmapper";
import EventEmitter from "./EventEmitter.js";
import type { VarhubClient } from "./VarhubClient.js";

/**
 * Basic events of {@link RPCChannel}
 * @event
 */
export type RPCChannelEvents<S> = {
	/**
	 * state is changed
	 * @example
	 * ```typescript
	 * const rpc = new RPCChannel(client);
	 * rpc.on("state", (newState, oldState) => {
	 *   console.log("state changed", newState);
	 * });
	 * ```
	 */
	state: [newState: S, oldState?: S]
	/**
	 * channel is closed
	 * @example
	 * ```typescript
	 * const rpc = new RPCChannel(client);
	 * rpc.on("close", (reason) => {
	 *   console.log("channel closed with reason:", reason);
	 *    console.assert(rpc.closed);
	 * });
	 * ```
	 */
	close: [reason: XJData]
	/**
	 * channel is closed
	 * @example
	 * ```typescript
	 * const rpc = new RPCChannel(client);
	 * rpc.on("init", (reason) => {
	 *   console.log("channel initialized");
	 *   console.assert(rpc.ready);
	 * });
	 * ```
	 */
	init: []
	/**
	 * channel is closed before was open
	 * @example
	 * ```typescript
	 * const rpc = new RPCChannel(client);
	 * rpc.on("error", (reason) => {
	 *   console.log("can not open channel", reason);
	 *   console.assert(rpc.closed);
	 * });
	 * ```
	 */
	error: [error: XJData]
}

const enum CLIENT_ACTION {
	CALL = 0,
	CLOSE = 1,
	CREATE = 2
}

const enum REMOTE_ACTION {
	RESPONSE_OK = 0,
	CLOSE = 1,
	STATE = 2,
	RESPONSE_ERROR = 3,
	EVENT = 4
}

type KeyOfArray<T, K = keyof T> = K extends keyof T ? (
	T[K] extends any[] ? K : never
) : never;

type KeyOfNotArray<T> = Exclude<keyof T, KeyOfArray<T>>

/**
 * Methods and properties of {@link RPCChannel}
 */
export interface RPCInstance<S> extends Disposable {
	then<R1 = [this], R2 = never>(
		onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
		onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null,
	): Promise<R1 | R2>,
	ready: boolean,
	closed: boolean,
	call: (path: string[], ...args: any[]) => Promise<any>,
	create: (path: string[], ...args: any[]) => RPCInstance<any> & RpcEmitter<never>,
	close: (reason?: string) => void,
	state: S
}

/**
 * Methods to handle events of {@link RPCChannel}
 */
export interface RpcEmitter<E> {
	on<T extends KeyOfArray<E>>(eventName: T, handler: E[T] extends any[] ? (this: this, ...args: E[T]) => void : never): this
	once<T extends KeyOfArray<E>>(eventName: T, handler: E[T] extends any[] ? (this: this, ...args: E[T]) => void : never): this
	off<T extends KeyOfArray<E>>(eventName: T, handler: E[T] extends any[] ? (this: this, ...args: E[T]) => void : never): this
}
type RpcMapper<M, E = never> = (
	[M] extends [MetaScope<infer METHODS, infer EVENTS, infer STATE>] ? (
		{new(): RPCChannel<METHODS, EVENTS, STATE>}
	) :
	[M] extends [{new(...args: infer PARAM): MetaScope<infer METHODS, infer EVENTS, infer STATE>}] ? (
		{new(...args: PARAM): RPCChannel<METHODS, EVENTS, STATE>}
	) :
	M extends (...args: any) => infer RET ? (
		[RET] extends [never] ? (...args: Parameters<M>) => Promise<Awaited<ReturnType<M>>> :
		RET extends MetaScope<unknown, unknown, unknown> ? {new(...args: Parameters<M>): RPCChannel<RET>} :
		(...args: Parameters<M>) => Promise<Awaited<ReturnType<M>>>
	) :
	M extends {[key: string]: any} ? {[key in (keyof M | KeyOfNotArray<E>)]: RpcMapper<key extends keyof M ? M[key] : void, key extends keyof E ? E[key]: void> } :
	E extends {[key: string]: any} ? {[key in (keyof M | KeyOfNotArray<E>)]: RpcMapper<key extends keyof M ? M[key] : void, key extends keyof E ? E[key]: void> } :
	never
) & (KeyOfArray<E> extends never ? unknown : RpcEmitter<E>);

/**
 * Constructor for new RPC channel based on {@link VarhubClient}
 * @group Classes
 */
export const RPCChannel = (function(client: VarhubClient, {key = "$rpc"} = {}): {foo: string}{
	const manager = new ChannelManager(client, key);
	return manager.defaultChannel.proxy;
} as any as (
	{
		/** @hidden */
		new(client: VarhubClient, options?: {key?: string}): RPCChannel<{}, unknown>,
		/**
		 * Create new channel for RPC
		 * @typeParam M - typeof current {@link RPCSource} of room (with methods, constructors and events)
		 * @param {VarhubClient} client - varhub client. Client may not be ready.
		 * @param options
		 * @param options.key default:`"$rpc"`
		 * @returns {RPCInstance<undefined>} - stateless channel.
		 * - result extends {@link RPCInstance}.
		 * - result extends {@link RpcEmitter} and can subscribe on events of current {@link RPCSource} of room
		 * - result has all methods of current {@link RPCSource} in room.
		 * - all methods are asynchronous and return a {@link Promise}<{@link XJData}>
		 * - result has constructors for all constructable methods of {@link RPCSource} in room.
		 * - all constructors are synchronous and return a new {@link RPCChannel}
		 */
		new<M>(client: VarhubClient, options?: {key?: string}): M extends MetaScope<infer METHODS, infer EVENTS, infer STATE> ? RPCChannel<METHODS, EVENTS, STATE> : RPCChannel<M>,
		/** @hidden */
		new<M, E, S = any>(client: VarhubClient,options?:  {key?: string}): RPCChannel<MetaScope<M, E, S>>
	}
));

type MetaScope<M, E, S> = { [Symbol.unscopables]: {[Symbol.unscopables]:{__rpc_methods: M, __rpc_events: E, __rpc_state: S}}}

/** @hidden */
export type RPCChannel<M = unknown, E = unknown, S = undefined> = (
	M extends MetaScope<infer METHODS, infer EVENTS, infer STATE> ? (
		RPCInstance<STATE> & RpcMapper<METHODS, EVENTS & RPCChannelEvents<STATE>>
	) : (
		RPCInstance<S> & RpcMapper<M, E & RPCChannelEvents<S>>
	)
);

/** @hidden */
class ChannelManager {
	currentChannelId: number = 0;
	defaultChannel: Channel;
	channels = new Map<number|undefined, Channel>();
	
	constructor(public client: VarhubClient, public key: string) {
		this.defaultChannel = new Channel(this, undefined);
		this.channels.set(undefined, this.defaultChannel);
		client.on("message", this.onMessage);
	}
	
	createNextChannel(){
		const channelId = this.currentChannelId++;
		const channel = new Channel(this, channelId);
		this.channels.set(channelId, channel);
		return channel;
	}
	
	onMessage = (...args: XJData[]) => {
		if (args.length < 3) return;
		const [key, channelId, operationCode, ...messageArgs] = args;
		if (key !== this.key) return;
		const channel = this.channels.get(channelId as any);
		if (!channel) return;
		if (operationCode === REMOTE_ACTION.RESPONSE_ERROR || operationCode === REMOTE_ACTION.RESPONSE_OK) {
			return channel.onResponse(operationCode, messageArgs[0], messageArgs[1]);
		}
		if (operationCode === REMOTE_ACTION.STATE) {
			return channel.onState(messageArgs[0]);
		}
		if (operationCode === REMOTE_ACTION.CLOSE) {
			return channel.onClose(messageArgs[0]);
		}
		if (operationCode === REMOTE_ACTION.EVENT) {
			return channel.onEvent(messageArgs[0] as any, messageArgs[1] as any);
		}
	}
}

/** @hidden */
const proxyTarget = function(){};

/** @hidden */
class Channel {
	proxy: any;
	state: any = undefined;
	events = new EventEmitter();
	resolver = Promise.withResolvers<void>();
	ready = false;
	closed = false;
	currentCallId = 0;
	readonly responseEventTarget = new EventTarget();
	
	constructor(public manager: ChannelManager, public channelId: any) {
		this.proxy = this.createProxy();
		this.resolver.promise.catch(() => {});
		if (channelId === undefined) {
			if (manager.client.ready) {
				this.send(CLIENT_ACTION.CALL);
			} else {
				manager.client.once("open", () => {
					this.send(CLIENT_ACTION.CALL)
				});
			}
		}
		manager.client.once("close", (reason) => this.onClose(reason));
	}
	
	onState(state?: any){
		if (this.closed) return;
		const oldState = this.state;
		const wasReady = this.ready;
		this.state = state;
		this.ready = true;
		if (!wasReady) {
			this.events.emitWithTry("init");
			this.events.emitWithTry("state", state);
			this.resolver.resolve();
		} else {
			this.events.emitWithTry("state", state, oldState);
		}
		
	}
	
	onClose(reason: any){
		if (this.closed) return;
		const wasReady = this.ready;
		this.ready = false;
		this.closed = true;
		if (!wasReady) this.events.emitWithTry("error", reason);
		this.events.emitWithTry("close", reason);
		this.resolver.reject(reason);
		this.manager.channels.delete(this.channelId);
	}
	
	onEvent(path: string[], args: XJData[]){
		const eventName = JSON.stringify(path);
		this.events.emitWithTry(eventName, ...args);
	}
	
	onResponse(operationCode: any, callId: any, data: any){
		this.responseEventTarget.dispatchEvent(new CustomEvent(callId, {detail: [operationCode, data]}));
	}
	
	proxyApply = (path: string[], ...args: any[]) => {
		return new Promise<any>((resolve, reject) => {
			if (this.closed) throw new Error("channel is closed");
			const callId = this.currentCallId++;
			const onResponse = (event: Event) => {
				if (!(event instanceof CustomEvent)) return;
				const [type, response] = event.detail;
				clear(type ? reject: resolve, response);
			}
			const onClose = (reason: string | null) => {
				clear(reject, new Error(reason ?? "connection closed"));
			}
			const clear = <T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>) => {
				this.responseEventTarget.removeEventListener(callId as any, onResponse);
				this.events.off("close", onClose);
				fn(...args);
			}
			this.responseEventTarget.addEventListener(callId as any, onResponse, {once: true});
			this.events.once("close", onClose);
			this.send(CLIENT_ACTION.CALL, callId, path, args);
		});
	}
	
	proxyConstruct = (path: string[], ...args: any[]) => {
		if (this.closed) throw new Error("channel is closed");
		const channel = this.manager.createNextChannel();
		this.send(CLIENT_ACTION.CREATE, channel.channelId, path, args);
		return channel.proxy;
	}
	
	async send(callCode: CLIENT_ACTION, ...args: XJData[]) {
		if (!this.manager.client.ready) await this.manager.client;
		this.manager.client.send(this.manager.key, this.channelId, callCode, ...args);
	}
	
	then = (res: any, rej: any) => {
		return this.resolver.promise.then(() => [this.proxy]).then(res, rej);
	}
	
	close = (reason: any) => {
		if (this.closed) return;
		this.ready = false;
		this.closed = true;
		if (this.channelId === undefined) {
			this.manager.client.close(reason);
		} else {
			this.send(CLIENT_ACTION.CLOSE, reason)
		}
		this.events.emitWithTry("close", reason);
		this.resolver.reject(reason);
		this.manager.channels.delete(this.channelId);
	}
	
	[Symbol.dispose] = () => {
		this.close("disposed");
	}
	
	createProxy(path: string[] = []){
		const children = new Map<string|number, any>();
		const events = this.events;
		const subscribers = {
			on: function(eventName: string, handler: (...args: any) => void) {
				return events.on.call(this, getEventCode(path, eventName), handler);
			},
			once: function(eventName: string, handler: (...args: any) => void) {
				return events.once.call(this, getEventCode(path, eventName), handler);
			},
			off: function(eventName: string, handler: (...args: any) => void) {
				return events.off.call(this, getEventCode(path, eventName), handler);
			}
		}
		
		const proxyHandler = {
			get: (_target: any, prop: string|symbol) => {
				if (path.length === 0) {
					if (prop === Symbol.dispose) return this[Symbol.dispose];
					if (prop === "ready") return this.ready;
					if (prop === "closed") return this.closed;
					if (prop === "state") return this.state;
					if (prop === "then") return this.then;
					if (prop === "call") return this.proxyApply;
					if (prop === "create") return this.proxyConstruct;
					if (prop === "close") return this.close;
				}
				if (prop in subscribers) return (subscribers as any)[prop];
				if (typeof prop !== "string") return undefined;
				if (children.has(prop)) return children.get(prop);
				const handler = this.createProxy([...path, prop]);
				children.set(prop, handler);
				return handler;
			},
			apply: (target: any, thisArg: any, args: any[]) => {
				return this.proxyApply(path, ...args);
			},
			construct: (target: any, args: any[]) => {
				return this.proxyConstruct(path, ...args);
			},
			isExtensible(){return false},
			getPrototypeOf(){return null},
			setPrototypeOf(){return false},
			defineProperty(){throw new Error(`can not define property of channel`)},
			set(){throw new Error(`can not set property of channel`)},
			delete(){throw new Error(`can not delete property of channel`)},
			has(){return false},
			ownKeys(){return ["prototype"]}
		}
		return new Proxy(proxyTarget, proxyHandler);
	}
}

/** @hidden */
function getEventCode(path: string[], e: string){
	if (path.length > 0) return JSON.stringify([...path, e]);
	if (e === "close" || e === "init" || e === "error" || e === "state") return e;
	return JSON.stringify([e]);
}