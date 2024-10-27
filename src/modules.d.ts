declare module "varhub:room" {
	/** @event */
	export type ConnectionEvents = {
		/**
		 * connection successfully opened
		 * @example
		 * ```typescript
		 * connection.on("open", () => {
		 *   console.log("connection opened!");
		 *   console.assert(connection.ready);
		 * });
		 * connection.open();
		 * ```
		 */
		open: [];
		/**
		 * connection closed
		 * @example
		 * ```typescript
		 * connection.on("close", (reason: string|null, wasOpen: boolean) => {
		 *   console.log("connection closed by reason:", reason);
		 *   console.assert(connection.closed);
		 * })
		 * ```
		 */
		close: [reason: string|null, wasOnline: boolean];
		/**
		 * received message from connection
		 * @example
		 * ```typescript
		 * connection.on("message", (...data) => {
		 *   console.log("received from connection:", data);
		 *   console.assert(connection.ready);
		 * })
		 * ```
		 */
		message: any[];
	}
	
	interface Connection {
		/**
		 * Promise like for events "open", "error"
		 * ### Using in async context
		 * @example
		 * ```typescript
		 * try {
		 *   await connection;
		 *   console.log("client connected");
		 * } catch (error) {
		 *   console.log("connection error");
		 * }
		 * ```
		 * ### Using in sync context
		 * @example
		 * ```
		 * connection.then(([connection]) => {
		 *   console.log("client connected");
		 * });
		 * ```
		 * @param onfulfilled
		 * @param onrejected
		 */
		then<R1 = [this], R2 = never>(
			onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
			onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | undefined | null
		): Promise<R1 | R2>;
		/**
		 * connection open
		 */
		get ready(): boolean;
		/**
		 * connection closed
		 */
		get closed(): boolean;
		/**
		 * send data to connection
		 * @param data any serializable arguments
		 */
		send(...data: any[]): this;
		/**
		 * @event
		 * @template {keyof ConnectionEvents} T
		 * subscribe on event
		 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
		 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
		 */
		on<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof ConnectionEvents} T
		 * subscribe on event once
		 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
		 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
		 */
		once<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof ConnectionEvents} T
		 * unsubscribe from event
		 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
		 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
		 */
		off<T extends keyof ConnectionEvents>(eventName: T, handler: (...args: ConnectionEvents[T]) => void): this;
		/**
		 * close client's connection
		 * @param reason
		 */
		close(reason?: string|null): void;
		
		/**
		 * defer connection establishment.
		 * Use this method if you need to perform an asynchronous check to get permission to connect.
		 * @example
		 * ```typescript
		 * room.on("connection", (connection, ...args) => {
		 *   void connection.defer(checkConnection, ...args);
		 *   console.assert(connection.deferred);
		 *   console.assert(!connection.ready);
		 *   console.assert(!connection.closed);
		 * })
		 * async function checkConnection(connection, ...args) {
		 *   const permitted: boolean = await checkConnectionPermits(connection, args);
		 *   if (!permitted) connection.close("not permitted"); // or throw error
		 * }
		 * ```
		 * @param handler
		 * - If the handler completes or resolves successfully, the connection will be opened.
		 * - If the handler throws or rejects an error, the connection will be closed with this error.
		 * - You can close the connection earlier by calling `connection.close(reason)`.
		 * - You can open the connection earlier by calling `connection.open()`.
		 * @param args additional arguments for handler
		 * @returns the result of handler or throws error
		 */
		defer<T, A extends any[]>(handler: (this: this, connection: this, ...args: A) => T, ...args: A): T;
		/**
		 * connection is deferred
		 */
		get deferred(): boolean;
		/**
		 * Allow the connection to connect
		 *
		 * The connection is connected automatically if it has not been deferred.
		 */
		open(): this;
		/**
		 * get the parameters with which the connection was initialized
		 */
		get parameters(): any[];
		toString(): string;
		valueOf(): number;
	}
	export type { Connection };
	
	/**
	 * @event
	 * Define all events dispatched by room controller
	 */
	export type RoomEvents = {
		/**
		 * new connection initialized
		 * @example
		 * ```ts
		 * room.on("connection", (con, ...params) => {
		 *   con.open();
		 *   console.log("someone connected with params", params);
		 *   con.send("Welcome!");
		 * })
		 * ```
		 * */
		connection: [connection: Connection, ...params: any[]];
		/**
		 * connection successfully opened
		 * @example
		 * ```ts
		 * room.on("connectionOpen", (con) => {
		 *   con.send("Welcome!");
		 * })
		 * ```
		 * */
		connectionOpen: [connection: Connection];
		/**
		 * connection closed
		 * @example
		 * ```ts
		 * room.on("connectionClose", (con, reason, wasOpen) => {
		 *   console.log("connection closed by reason:", reason);
		 * })
		 * ```
		 * */
		connectionClose: [connection: Connection, reason: string | null, wasOpen: boolean];
		/**
		 * received a message from connection
		 * @example
		 * ```ts
		 * room.on("connectionMessage", (con, ...data) => {
		 *   console.log("got message:", data);
		 * })
		 * ```
		 * */
		connectionMessage: [connection: Connection, ...data: any[]];
	}
	
	
	interface Room {
		#private
		/** @hidden */
		then<R1 = [this]>(
			onfulfilled?: ((value: [this]) => R1 | PromiseLike<R1>) | undefined | null,
			onrejected?: ((reason: any) => any) | undefined | null
		): Promise<R1>;
		/** @hidden */
		get ready(): true;
		/** @hidden */
		get closed(): false;
		/** @hidden */
		get id(): "unknown";
		/** @hidden */
		get integrity(): "unknown";
		
		/**
		 * public message of the room.
		 */
		get message(): string | null;
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
		 * @param {boolean} [filter.ready] get only ready (or not ready) connections.
		 * @param {boolean} [filter.deferred] get only deferred (or not deferred) connections.
		 * @param {boolean} [filter.closed] get only closed (or not closed) connections.
		 * @return connections found
		 */
		getConnections(filter?: {ready?: boolean, deferred?: boolean, closed?: boolean}): Set<Connection>;
		
		/**
		 * @event
		 * @template {keyof RoomEvents} T
		 * subscribe on event
		 * @param {keyof RoomEvents} event "connection", "connectionOpen", "connectionClose" or "connectionMessage"
		 * @param {(...args: RoomEvents[T]) => void} handler event handler
		 * @see RoomEvents
		 */
		on<T extends keyof RoomEvents>(event: T, handler: (...args: RoomEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof RoomEvents} T
		 * subscribe on event once
		 * @param {keyof RoomEvents} event "connection", "connectionOpen", "connectionClose" or "connectionMessage"
		 * @param {(...args: RoomEvents[T]) => void} handler event handler
		 * @see RoomEvents
		 */
		once<T extends keyof RoomEvents>(event: T, handler: (...args: RoomEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof RoomEvents} T
		 * unsubscribe from event
		 * @param {keyof RoomEvents} event "connection", "connectionOpen", "connectionClose" or "connectionMessage"
		 * @param {(...args: RoomEvents[T]) => void} handler event handler
		 * @see RoomEvents
		 */
		off<T extends keyof RoomEvents>(event: T, handler: (...args: RoomEvents[T]) => void): this;
		
		[Symbol.dispose](): void;
		[Symbol.asyncDispose](): Promise<void>;
	}
	export type { Room };
	/**
	 * Controller of this room.
	 * Singleton instance of type {@link Room }
	 * @see Room
	 */
	const room: Room;
	export default room;
}

declare module "varhub:events" {
	export default class EventEmitter<M extends Record<any, any[]>> {
		on<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		once<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		off<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		emit<T extends keyof M>(event: T, ...args: M[T]): boolean
	}
}

declare module "varhub:players" {
	import type { Connection, Room } from "varhub:room"
	/**
	 * @event
	 */
	export type PlayerEvents = {
		/**
		 * player leaves the game
		 * @example
		 * ```typescript
		 * player.on("leave", () => {
		 *   console.log("player leaves:", player.name);
		 * })
		 * ```
		 *
		 * Attention!
		 *
		 * If the player's last connection is closed, he does not leave the game, but goes offline.
		 *
		 * You can kick player when he goes offline
		 * @example
		 * ```typescript
		 * const players = new Players((con, name) => String(name));
		 * players.on("offline", player => player.kick("disconnected"));
		 * ```
		 */
		leave: []
		/**
		 * player goes online
		 * @example
		 * ```typescript
		 * player.on("online", () => {
		 *   console.log("player online now!", player.name);
		 *   console.assert(player.online);
		 * })
		 * ```
		 */
		online: []
		/**
		 * player goes offline
		 * @example
		 * ```typescript
		 * player.on("offline", () => {
		 *   console.log("player offline now!", player.name);
		 *   console.assert(!player.online);
		 * })
		 * ```
		 */
		offline: []
	}
	export interface Player {
		/**
		 * player's name
		 */
		get name(): string;
		/**
		 * get all player's connections
		 */
		get connections(): Set<Connection>;
		
		/**
		 * player is online (has at least one opened connection)
		 */
		get online(): boolean;
		/**
		 * player is registered in list of players
		 */
		get registered(): boolean;
		/**
		 * get player's group
		 */
		get group(): string|undefined;
		/**
		 * set player's group
		 */
		set group(value: string|undefined);
		/**
		 * @event
		 * @template {keyof PlayerEvents} T
		 * subscribe on event
		 * @param {keyof PlayerEvents} eventName "leave", "online" or "offline"
		 * @param {(...args: PlayerEvents[T]) => void} handler event handler
		 */
		on<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayerEvents} T
		 * subscribe on event once
		 * @param {keyof PlayerEvents} eventName "leave", "online" or "offline"
		 * @param {(...args: PlayerEvents[T]) => void} handler event handler
		 */
		once<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayerEvents} T
		 * subscribe on event once
		 * @param {keyof PlayerEvents} eventName "leave", "online" or "offline"
		 * @param {(...args: PlayerEvents[T]) => void} handler event handler
		 */
		off<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this;
		/**
		 * kick player and close all player's connections
		 * @param reason
		 */
		kick(reason?: string|null): void;
		toString(): string;
		valueOf(): string;
		
		/**
		 * iterate on all player's connections
		 */
		[Symbol.iterator](): SetIterator<Connection>;
	}
	
	/** @group Events */
	export type PlayersEvents = {
		/**
		 * new player joined
		 * @example
		 * ```typescript
		 * const players = new Players((con, name) => String(name));
		 * players.on("join", (player) => {
		 *   console.log("player joined:", player.name);
		 * })
		 * ```
		 */
		join: [Player]
		/**
		 * player leaves the game
		 * @example
		 * ```typescript
		 * const players = new Players((con, name) => String(name));
		 * players.on("leave", (player) => {
		 *   console.log("player leaves:", player.name);
		 * })
		 * ```
		 *
		 * Attention!
		 *
		 * If the player's last connection is closed, he does not leave the game, but goes offline.
		 *
		 * You can kick player when he goes offline
		 * @example
		 * ```typescript
		 * const players = new Players((con, name) => String(name));
		 * players.on("offline", player => player.kick("disconnected"))
		 * ```
		 */
		leave: [Player]
		/**
		 * player goes online
		 * @example
		 * ```typescript
		 * const players = new Players((con, name) => String(name));
		 * players.on("online", (player) => {
		 *   console.log("player online now!", player.name);
		 *   console.assert(player.online);
		 * })
		 * ```
		 */
		online: [Player]
		/**
		 * player goes offline, last player's connection is closed.
		 * @example
		 * ```typescript
		 * const players = new Players((con, name) => String(name));
		 * players.on("offline", (player) => {
		 *   console.log("player offline now!", player.name);
		 *   console.assert(!player.online);
		 * })
		 * ```
		 */
		offline: [Player]
	}
	export default class Players {
		/**
		 * Create a player list based on connections.
		 * @example
		 * ```typescript
		 * const players = new Players(room, (connection, ...args) => String(args[0]));
		 * ```
		 * @example
		 * ```typescript
		 * const players = new Players(room, async (connection, name, password) => {
		 *   const permitted: boolean = await checkUser(name, password);
		 *   if (!permitted) throw "wrong password";
		 *   return name;
		 * });
		 * ```
		 * @param room room
		 * @param registerPlayerHandler
		 * handler to get the player's name.
		 * - if handler returns or resolves a string - it will be the player's name
		 * - if handler returns or resolves a null or undefined - the connection will be opened without a player
		 * - if handler throws or rejects - the connection will be closed
		 * - async handler will defer the connection
		 */
		constructor(room: Room, registerPlayerHandler: (connection: Connection, ...args: any) => string|void|null|undefined|Promise<string|void|null|undefined>);
		/**
		 * get player by name or connection
		 * @param nameOrConnection name or connection
		 */
		get(nameOrConnection: Connection|string): Player|undefined;
		
		/**
		 * get number of players
		 */
		get count(): number;
		/**
		 * get all players with specified group. If group is undefined - get all players without group.
		 * @param group
		 */
		getGroup(group: string|undefined): Set<Player>;
		/**
		 * get all players
		 */
		all(): Set<Player>;
		/**
		 * @event
		 * @template {keyof PlayersEvents} T
		 * subscribe on event
		 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
		 * @param {(...args: PlayersEvents[T]) => void} handler event handler
		 */
		on<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayersEvents} T
		 * subscribe on event once
		 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
		 * @param {(...args: PlayersEvents[T]) => void} handler event handler
		 */
		once<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayersEvents} T
		 * unsubscribe from event
		 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
		 * @param {(...args: PlayersEvents[T]) => void} handler event handler
		 */
		off<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this;
		/**
		 * iterate on all players
		 */
		[Symbol.iterator](): MapIterator<Player>;
	}
}

declare module "varhub:rpc" {
	import type { Connection, Room } from "varhub:room";
	export type RPCHandler = ((connection: Connection, path: string[], args: any[], openChannel: boolean) => any);
	type EventPath<T, K extends keyof T = keyof T> = (K extends string ? (T[K] extends any[] ? (K | [K]) : [K, ...(EventPath<T[K]> extends infer NEXT extends (string | string[]) ? (NEXT extends any[] ? NEXT : [NEXT]) : never)]) : never);
	type EventPathArgs<PATH, FORM> = (PATH extends keyof FORM ? (FORM[PATH] extends any[] ? FORM[PATH] : never) : PATH extends [] ? (FORM extends any[] ? FORM : never) : PATH extends [infer STEP extends string, ...infer TAIL extends string[]] ? (STEP extends keyof FORM ? EventPathArgs<TAIL, FORM[STEP]> : never) : never);
	
	/**
	 * Communication channel established between client's {@link RPCChannel} and {@link RPCSource}
	 */
	export interface RPCSourceChannel<S = RPCSource> {
		/**
		 * channel is closed
		 */
		get closed(): boolean;
		/**
		 * get rpc source
		 */
		get source(): S;
		/**
		 * get client's connection
		 */
		get connection(): Connection;
		/**
		 * close this communication channel
		 * @param reason
		 */
		close(reason?: any): void;
	}
	
	/**
	 * @event
	 * @template {any} STATE
	 * @template {RPCSourceChannel} C
	 */
	export type RPCSourceEvents<STATE, C> = {
		/**
		 * new channel is open
		 * @example
		 * ```typescript
		 * rpc = new RPCSource({});
		 * rpc.on("channelOpen", (sourceChannel) => {
		 *   if (isBadClient(sourceChannel.client)) {
		 *   	sourceChannel.close("bad!");
		 *   }
		 * })
		 * ```
		 * If you close the sourceChannel while the event is being processed,
		 * the channel will not be created and `channelClose` event will not be triggered.
		 */
		channelOpen: [sourceChannel: C],
		/**
		 * channel is closed
		 * @example
		 * ```typescript
		 * rpc = new RPCSource({});
		 * rpc.on("channelClose", (sourceChannel, reason) => {
		 *   console.log("client closed this channel:", sourceChannel.client, "reason:", reason);
		 * })
		 * ```
		 */
		channelClose: [sourceChannel: C, reason: any],
		/**
		 * state is changed
		 * @example
		 * ```typescript
		 * rpc = new RPCSource({}, "state1");
		 * console.assert(rpc.state === "state1");
		 *
		 * rpc.on("state", (newState, oldState) => {
		 *   console.log("new state:", newState);
		 *   console.log("old state:", oldState);
		 *   console.assert(rpc.state === newState);
		 * });
		 * rpc.setState("state2");
		 * ```
		 */
		state: [newState: STATE, oldState: STATE],
		/**
		 * rpc is disposed
		 * @example
		 * ```typescript
		 * rpc = new RPCSource({});
		 * rpc.on("dispose", (reason) => {
		 *   console.log("disposed by reason:", reason);
		 * });
		 * rpc.dispose("reason");
		 * ```
		 */
		dispose: [reason: any],
	}
	
	export default class RPCSource<METHODS extends Record<string, any> = {}, STATE = undefined, EVENTS = {}> implements Disposable {
		#private;
		/** @hidden */
		[Symbol.unscopables]: {
			__rpc_methods: METHODS;
			__rpc_events: EVENTS;
			__rpc_state: STATE;
		};
		/**
		 * @event
		 * @template {keyof RPCSourceEvents} T
		 * subscribe on event
		 * @param {keyof RPCSourceEvents} eventName "channelOpen", "channelClose", "state" or "dispose"
		 * @param {(...args: RPCSourceEvents[T]) => void} handler event handler
		 */
		on<T extends keyof RPCSourceEvents<STATE, RPCSourceChannel<this>>>(eventName: T, handler: (...args: RPCSourceEvents<STATE, RPCSourceChannel<this>>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof RPCSourceEvents} T
		 * subscribe on event once
		 * @param {keyof RPCSourceEvents} eventName "channelOpen", "channelClose", "state" or "dispose"
		 * @param {(...args: RPCSourceEvents[T]) => void} handler event handler
		 */
		once<T extends keyof RPCSourceEvents<STATE, RPCSourceChannel<this>>>(eventName: T, handler: (...args: RPCSourceEvents<STATE, RPCSourceChannel<this>>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof RPCSourceEvents} T
		 * unsubscribe from event
		 * @param {keyof RPCSourceEvents} eventName "channelOpen", "channelClose", "state" or "dispose"
		 * @param {(...args: RPCSourceEvents[T]) => void} handler event handler
		 */
		off<T extends keyof RPCSourceEvents<STATE, RPCSourceChannel<this>>>(eventName: T, handler: (...args: RPCSourceEvents<STATE, RPCSourceChannel<this>>[T]) => void): this;
		/**
		 * get current state
		 */
		get state(): STATE;
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
		 * - function of type {@link RPCHandler};
		 * - object with methods for remote call.
		 * @param initialState
		 */
		constructor(handler?: RPCHandler | METHODS, initialState?: STATE);
		/** apply generic types for events */
		withEventTypes<E = EVENTS>(): RPCSource<METHODS, STATE, E>;
		/** @hidden */
		setState(state: (oldState: STATE) => STATE): this;
		/**
		 * set new state
		 * @param state
		 * - new state value, if state is not a function.
		 * - function takes the current state and returns a new one
		 */
		setState(state: STATE extends (...args: any) => any ? never : STATE): this;
		/** apply generic types for state. */
		withState<S>(): RPCSource<METHODS, S, EVENTS>;
		/** apply generic types for state and set new state. */
		withState<S>(state: S): RPCSource<METHODS, S, EVENTS>;
		get disposed(): boolean;
		/**
		 * Emit event for all connected clients.
		 * Reserved event names: `close`, `init`, `error`, `state`
		 * @param event path for event. String or array of strings.
		 * @param args event values
		 */
		emit<P extends EventPath<EVENTS>>(event: P, ...args: EventPathArgs<P, EVENTS>): this;
		/**
		 * dispose this source and disconnect all channels
		 * @param reason
		 */
		dispose(reason?: any): void;
		/**
		 * dispose this source and disconnect all channels
		 */
		[Symbol.dispose](): void;
		
		/**
		 * start listening for messages and processing procedure calls
		 * @param rpcSource message handler
		 * @param room room
		 * @param options
		 * @param options.maxChannelsPerClient set a limit on the number of opened channels
		 * @param options.key Special key for listening events. Default value: `"$rpc"`
		 */
		static start(rpcSource: RPCSource<any, undefined, any>, room: Room, options?: {
			maxChannelsPerClient?: number;
			key?: string
		}): () => void;
		
		/**
		 * get the current rpc source, based on exports of main module.
		 * value is undefined while main module is executing
		 */
		static get current(): RPCSource<any, undefined, any> | undefined;
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
	/**
	 * performance.now()
	 * @returns { number }
	 * */
	export const now: () => number;
}

declare module "varhub:api/network" {
	export interface NetworkApi {
		fetch<T extends keyof BodyType>(url: string, params?: FetchParams<T>): Promise<FetchResult<T>>
	}
	type BodyType = {
		json: unknown;
		text: string;
		arrayBuffer: ArrayBuffer;
		formData: Array<[string, string | FileJson]>
	}
	
	interface FileJson {
		type: string,
		size: number,
		name: string,
		lastModified: number,
		data: ArrayBuffer
	}
	
	export type FetchParams<T extends keyof BodyType = keyof BodyType> = {
		type?: T
		method?: RequestInit["method"],
		headers?: Record<string, string>,
		body?: string | ArrayBuffer | Array<[string, string] | [string, FileJson] | [string, ArrayBuffer, string]>
		redirect?: RequestInit["redirect"],
		credentials?: RequestInit["credentials"]
		mode?: RequestInit["mode"]
		referrer?: RequestInit["referrer"]
		referrerPolicy?: RequestInit["referrerPolicy"]
	};
	
	export interface FetchResult<T extends keyof BodyType = keyof BodyType> {
		url: string,
		ok: boolean,
		type: string,
		statusText: string,
		redirected: boolean,
		status: number,
		headers: Record<string, string>,
		body: BodyType[T],
	}
	
	const api: NetworkApi
	export default api;
}
