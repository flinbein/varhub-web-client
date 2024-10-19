import { EventBox } from "./EventBox.js";
import type { XJData } from "xjmapper";
import { Connection, RoomSocketHandler } from "./RoomSocketHandler.js";

declare module "varhub:room" {
	
	export type ConnectionEvents = {
		open: [];
		close: [reason: string|null, wasOnline: boolean];
		message: any[];
	}
	
	class Connection {
		private constructor();
		then<R1 = [this], R2 = never>(
			onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
			onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
		): PromiseLike<R1 | R2>;
		get parameters(): any[];
		get ready(): boolean;
		get closed(): boolean;
		get deferred(): boolean;
		defer<T>(fn: (this: this, connection: this) => T): T;
		open(): this;
		send(...args: any[]): this;
		on<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this;
		once<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this;
		off<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this;
		close(reason?: string|null): void;
		toString(): string;
		valueOf(): number;
	}
	export type { Connection };
	
	/**
	 * Define all events dispatched by room controller
	 */
	export type RoomEvents = {
		/** created new connection */
		connection: [connection: Connection, ...args: any[]];
		/** connection successfully opened */
		connectionOpen: [connection: Connection];
		/** connection successfully closed */
		connectionClose: [connection: Connection, reason: string | null, wasOnline: boolean];
		/** received a message */
		connectionMessage: [connection: Connection, ...args: any[]];
	}
	
	
	class Room {
		then<R1 = [this], R2 = never>(
			onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
			onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
		): PromiseLike<R1>;
		/**
		 * public message of the room.
		 */
		get message(): string;
		/**
		 * change public message of the room. Set null to make room private.
		 * @param value
		 */
		set message(value: string | null);
		
		/**
		 * destroy this room.
		 */
		destroy(): void;
		
		/**
		 * send message to all ready connections.
		 */
		broadcast(...msg: any[]): this;
		
		/**
		 * get all connections
		 * @param [filter] filter connections, optional.
		 * @param [filter.ready] true = get only ready connections; false = only lobby connections;
		 */
		getConnections(filter?: {ready?: boolean}): Set<Connection>;
		
		/**
		 * Subscribe on room event.
		 * @see RoomEvents
		 */
		on<T extends keyof RoomEvents>(event: T, handler: (...args: RoomEvents[T]) => void): this;
		/**
		 * Subscribe on room event once.
		 * @see RoomEvents
		 */
		once<T extends keyof RoomEvents>(event: T, handler: (...args: RoomEvents[T]) => void): this;
		/**
		 * Unsubscribe from room event.
		 * @see RoomEvents
		 */
		off<T extends keyof RoomEvents>(event: T, handler: (...args: RoomEvents[T]) => void): this;
	}
	export type { Room };
	/**
	 * Controller of this room state.
	 */
	const room: Room;
	export default room;
	
	export declare class RPCSourceInterface<T> {}
}

declare module "varhub:events" {
	export class EventEmitter<M extends Record<any, any[]>> {
		on<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		once<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		off<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		emit<T extends keyof M>(event: T, ...args: M[T]): boolean
	}
}

declare module "varhub:players" {
	import type { Connection, Room } from "varhub:room"
	export type PlayerEvents = {
		leave: []
		online: []
		offline: []
	}
	class Player {
		private constructor();
		get name(): string;
		get connections(): Set<Connection>;
		get online(): boolean;
		get registered(): boolean;
		get group(): string|undefined;
		set group(value: string|undefined);
		on<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this;
		once<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this;
		off<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this;
		kick(reason: string|null = null): void;
		toString(): string;
		valueOf(): string;
		[Symbol.iterator](): SetIterator<Connection>;
	}
	export type { Player };
	
	export type PlayersEvents = {
		join: [Player]
		leave: [Player]
		online: [Player]
		offline: [Player]
	}
	export default class Players {
		constructor(room: Room, registerPlayer: (connection: Connection, ...args: any) => string|void|null|undefined|Promise<string|void|null|undefined>);
		get(nameOrConnection: Connection|string): Player|undefined;
		get count(): number;
		getGroup(group: string|undefined): Set<Player>;
		all(): Set<Player>;
		on<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this;
		once<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this;
		off<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this;
		[Symbol.iterator](): MapIterator<Player>;
	}
}

declare module "varhub:rpc" {
	import type { Room } from "varhub:room"
	type EventPath<T, K extends keyof T = keyof T> = (
		K extends string ? (
			T[K] extends any[] ? (K | [K]) : [K, ...(
				EventPath<T[K]> extends infer NEXT extends (string|string[]) ? (
					NEXT extends any[] ? NEXT : [NEXT]
				) : never
			)]
		) : never
	);
	
	type EventPathArgs<PATH, FORM> = (
		PATH extends keyof FORM ? (FORM[PATH] extends any[] ? FORM[PATH] : never) :
		PATH extends [] ? (FORM extends any[] ? FORM : never) :
		PATH extends [infer STEP extends string, ...infer TAIL extends string[]] ? (
			STEP extends keyof FORM ? EventPathArgs<TAIL, FORM[STEP]> : never
		) : never
	);
	
	export default class RPCSource<METHODS extends Record<string, any> = {}, EVENTS = any> implements Disposable {
		declare public [Symbol.unscopables]: { __rpc_methods: METHODS, __rpc_events: EVENTS }
		constructor(handler?: RPCHandler|METHODS);
		withEventTypes<EVENTS = never>(): RPCSource<METHODS, EVENTS>;
		get disposed(): boolean;
		emit<P extends EventPath<EVENTS>>(event: P, ...args: EventPathArgs<P, EVENTS>);
		dispose(reason?: any);
		static start(rpcSource: RPCSource, room: Room, key: string, options: {maxChannelsPerClient: number} = {maxChannelsPerClient: Infinity});
	}
	
}

declare module "varhub:config" {
	/**
	 * config of this room. Config is created with room.
	 */
	const config: unknown;
	export default config;
}

declare module "varhub:performance" {
	/** performance.now() */
	export const now: () => number;
}
