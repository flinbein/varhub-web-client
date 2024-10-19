import { EventBox } from "./EventBox.js";
import type { XJData } from "@flinbein/xjmapper";
import type { VarhubClient } from "./VarhubClient.js";


type RPCChannelEvents = {
	close: [reason: string|null]
	init: []
	error: [Error]
}

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

type KeyOfArray<T, K = keyof T> = K extends keyof T ? (
	T[K] extends any[] ? K : never
) : never;

type KeyOfNotArray<T> = Exclude<keyof T, KeyOfArray<T>>

interface RpcInstance extends Disposable {
	then<R1 = [this], R2 = never>(
		onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
		onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null,
	): Promise<R1 | R2>,
	ready: boolean,
	closed: boolean,
	call: (path: string[], ...args: any[]) => Promise<any>,
	create: (path: string[], ...args: any[]) => RpcInstance & RpcEmitter<never>,
	close: (reason?: string) => void,
}

interface RpcEmitter<E> {
	on<T extends KeyOfArray<E>>(eventName: T, handler: E[T] extends any[] ? (this: this, ...args: E[T]) => void : never): void
	once<T extends KeyOfArray<E>>(eventName: T, handler: E[T] extends any[] ? (this: this, ...args: E[T]) => void : never): void
	off<T extends KeyOfArray<E>>(eventName: T, handler: E[T] extends any[] ? (this: this, ...args: E[T]) => void : never): void
}
type RpcMapper<M, E = never> = (
	M extends (...args: any) => infer RET ? (
		[RET] extends [never] ? (...args: Parameters<M>) => Promise<Awaited<ReturnType<M>>> :
		RET extends MetaScope<infer METHODS, infer EVENTS> ? {new(...args: Parameters<M>): RPCChannel<RET>} :
		(...args: Parameters<M>) => Promise<Awaited<ReturnType<M>>>
	) :
	M extends {[key: string]: any} ? {[key in (keyof M | KeyOfNotArray<E>)]: RpcMapper<key extends keyof M ? M[key] : void, key extends keyof E ? E[key]: void> } :
	E extends {[key: string]: any} ? {[key in (keyof M | KeyOfNotArray<E>)]: RpcMapper<key extends keyof M ? M[key] : void, key extends keyof E ? E[key]: void> } :
	never
) & (KeyOfArray<E> extends never ? unknown : RpcEmitter<E>);

export const RPCChannel = (function(client: VarhubClient, key: string): {foo: string}{
	const manager = new ChannelManager(client, key);
	return manager.defaultChannel.proxy;
} as any as {
	new<S>(client: VarhubClient, key: string): RPCChannel<S>,
	new<M, E>(client: VarhubClient, key: string): RPCChannel<MetaScope<M, E>>}
);

type MetaScope<M, E> = { [Symbol.unscopables]: {__rpc_methods: M, __rpc_events: E}}

export type RPCChannel<S = any, E = any> = RpcInstance & (
	S extends MetaScope<infer METHODS, infer EVENTS> ? RpcMapper<METHODS, EVENTS & RPCChannelEvents> :
	RpcMapper<S, E & RPCChannelEvents>
)


// CALL	-> key:$rpc, channelId, 0, callId:number, 0:call, path:string[], args[]
// CLOC	-> key:$rpc, channelId, 1, reason
// CHAN	-> key:$rpc, channelId, 2, newChannelId:number, path:string[], args[]
// RESP <- key:$rpc, channelId, 0, callId:number, result
// CLOS <- key:$rpc, channelId, 1, reason:string|null
// INIT	<- key:$rpc, channelId, 2, initArg
// RESE <- key:$rpc, channelId, 3, callId:number, error
// EVNT <- key:$rpc, channelId, 4, path:string[], args[]


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
		if (args.length < 4) return;
		const [key, channelId, operationCode, ...messageArgs] = args;
		if (key !== this.key) return;
		const channel = this.channels.get(channelId as any);
		if (!channel) return;
		if (operationCode === REMOTE_ACTION.RESPONSE_ERROR || operationCode === REMOTE_ACTION.RESPONSE_OK) {
			return channel.onResponse(operationCode, messageArgs[0], messageArgs[1]);
		}
		if (operationCode === REMOTE_ACTION.CREATE) {
			return channel.onInit(messageArgs[0]);
		}
		if (operationCode === REMOTE_ACTION.CLOSE) {
			return channel.onClose(messageArgs[0]);
		}
		if (operationCode === REMOTE_ACTION.EVENT) {
			return channel.onEvent(messageArgs[0] as any, messageArgs[1] as any);
		}
	}
}

const proxyTarget = function(){};
class Channel {
	proxy: any;
	initialData: any;
	eventBox: EventBox<any, any>;
	resolver = Promise.withResolvers<void>();
	ready = false;
	closed = false;
	currentCallId = 0;
	readonly responseEventTarget = new EventTarget();
	
	constructor(public manager: ChannelManager, public channelId: any) {
		this.proxy = this.createProxy();
		this.resolver.promise.catch(() => {});
		this.eventBox = new EventBox(this.proxy);
		if (channelId === undefined) {
			if (manager.client.ready) {
				this.onInit();
			} else {
				manager.client.once("open", () => this.onInit());
			}
		}
		manager.client.once("close", (reason) => this.onClose(reason));
	}
	
	onInit(initData?: any){
		this.initialData = initData;
		this.ready = true;
		this.eventBox.dispatch("init", [initData]);
		this.resolver.resolve();
	}
	
	onClose(reason: any){
		if (this.closed) return;
		const wasReady = this.ready;
		this.ready = false;
		this.closed = true;
		if (!wasReady) this.eventBox.dispatch("error", [reason]);
		this.eventBox.dispatch("close", [reason]);
		this.resolver.reject(reason);
		this.manager.channels.delete(this.channelId);
		this.eventBox.clear();
	}
	
	onEvent(path: string[], args: XJData[]){
		const eventName = JSON.stringify(path);
		this.eventBox.dispatch(eventName, args);
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
				this.eventBox.subscriber.off("close", onClose);
				fn(...args);
			}
			this.responseEventTarget.addEventListener(callId as any, onResponse, {once: true});
			this.eventBox.subscriber.once("close", onClose);
			this.send(CLIENT_ACTION.CALL, callId, path, args);
		});
	}
	
	proxyConstruct = (path: string[], ...args: any[]) => {
		if (this.closed) throw new Error("channel is closed");
		const channel = this.manager.createNextChannel();
		this.send(CLIENT_ACTION.CREATE, channel.channelId, path, args);
		return channel.proxy;
	}
	
	send(callCode: CLIENT_ACTION, ...args: XJData[]) {
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
		this.eventBox.dispatch("close", [reason]);
		this.resolver.reject(reason);
		this.manager.channels.delete(this.channelId);
		this.eventBox.clear();
	}
	
	[Symbol.dispose] = () => {
		this.close("disposed");
	}
	
	getEventCode(path: string[], eventName: string){
		if (path.length > 0) return JSON.stringify([...path, eventName]);
		if (eventName === "close" || eventName === "init" || eventName === "error") return eventName;
		return JSON.stringify([eventName]);
	}
	
	createProxy(path: string[] = []){
		const children = new Map<string|number, any>();
		const subscribers = {
			on: (eventName: string, handler: (...args: any) => void) => {
				return this.eventBox.subscriber.on(this.getEventCode(path, eventName), handler);
			},
			once: (eventName: string, handler: (...args: any) => void) => {
				return this.eventBox.subscriber.once(this.getEventCode(path, eventName), handler);
			},
			off: (eventName: string, handler: (...args: any) => void) => {
				return this.eventBox.subscriber.off(this.getEventCode(path, eventName), handler);
			}
		}
		
		const proxyHandler = {
			get: (target: any, prop: string|symbol) => {
				if (path.length === 0) {
					if (prop === Symbol.dispose) return this[Symbol.dispose];
					if (prop === "ready") return this.ready;
					if (prop === "closed") return this.closed;
					if (prop === "initialData") return this.initialData;
					if (prop === "then") return this.then;
					if (prop === "call") return this.proxyApply;
					if (prop === "create") return this.proxyConstruct;
					if (prop === "close") return this.close;
				}
				if (prop in subscribers) return (subscribers as any)[prop];
				if (typeof prop !== "string") throw new Error("wrong key format");
				// on, once, off
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
			ownKeys(){return []}
		}
		return new Proxy(proxyTarget, proxyHandler);
	}
}