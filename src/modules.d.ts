/**
 * API for Varhub VM
 * @example
 * ```typescript
 * import room from "varhub:room";
 *
 * room.on("connectionOpen", (con) => {
 *     room.broadcast("user joined", com.parameters[0]);
 *     con.send("welcome!");
 * })
 *
 * room.on("connectionClose", (con) => {
 *     room.broadcast("user left", com.parameters[0]);
 * })
 *
 * room.on("connectionMessage", (con, ...args) => {
 *     room.broadcast("user said", com.parameters[0], ...args);
 * })
 * ```
 * @module VM API
 */

/**
 * This module allows you to get a controller of current {@link Room}.
 * @example
 * ```javascript
 * import room from "varhub:room"
 * // room is a singleton object
 * ```
 * @module
 */
declare module "varhub:room" {
	
	export type RoomDesc = {
		data?: any,
		parameters?: any[],
		clientMessage?: any[],
		roomMessage?: any[],
	}
	
	type OverrideKeys<A, B> = {[K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never }
	type RoomValidator = {
		parameters?: ((params: any[]) => any[] | undefined | null | false) | ((params: any[]) => params is any[]),
		clientMessage?: ((params: any[]) => any[] | undefined | null | false) | ((params: any[]) => params is any[])
	}
	type ApplyRoomValidator<DESC extends RoomDesc, VAL extends RoomValidator> = (
		Pick<VAL, keyof RoomValidator & keyof VAL> extends infer P ?
		{
			[K in keyof P]: P[K] extends (args: any[]) => args is (infer R extends any[]) ? R : P[K] extends (args: any[]) => (infer R) ? Extract<R, any[]> : never
		} extends infer T ?
		OverrideKeys<DESC, T>
		: never : never
	)
	
	export namespace Room {
		export type ConnectionOf<T extends Room> = T extends Room<infer R> ? Connection<R> : never;
		export type DataOf<T extends Room> = T extends Room<infer R> ? R["data"] : never;
		export type ParametersOf<T extends Room> = T extends Room<infer R> ? R["parameters"] : never;
		export type RoomMessageOf<T extends Room> = T extends Room<infer R> ? R["roomMessage"] : never;
		export type ClientMessageOf<T extends Room> = T extends Room<infer R> ? R["clientMessage"] : never;
	}
	
	/** @event */
	export type ConnectionEvents<DESC extends RoomDesc> = {
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
		message: DESC extends {clientMessage: infer R extends any []} ? R : any[];
	}
	
	export interface Connection<DESC extends RoomDesc = {}> {
		/**
		 * custom data for this connection
		 */
		data?: DESC extends {data: infer T} ? T : any;
		
		get promise(): Promise<this>
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
		send(...data: DESC extends {roomMessage: infer T extends any[]} ? T : any[]): this;
		/**
		 * @event
		 * @template {keyof ConnectionEvents} T
		 * subscribe on event
		 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
		 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
		 */
		on<T extends keyof ConnectionEvents<DESC>>(eventName: T, handler: (this:this, ...args: ConnectionEvents<DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof ConnectionEvents} T
		 * subscribe on event once
		 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
		 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
		 */
		once<T extends keyof ConnectionEvents<DESC>>(eventName: T, handler: (this:this, ...args: ConnectionEvents<DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof ConnectionEvents} T
		 * unsubscribe from event
		 * @param {keyof ConnectionEvents} eventName "message", "open" or "close"
		 * @param {(...args: ConnectionEvents[T]) => void} handler event handler
		 */
		off<T extends keyof ConnectionEvents<DESC>>(eventName: T, handler: (this:this, ...args: ConnectionEvents<DESC>[T]) => void): this;
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
		get parameters(): DESC extends {parameters: infer T extends any[]} ? T : any[];
		toString(): string;
		valueOf(): number;
	}
	
	/**
	 * @event
	 * Define all events dispatched by room controller
	 */
	export type RoomEvents<DESC extends RoomDesc = {}> = {
		/**
		 * new connection initialized
		 * @example
		 * ```ts
		 * room.on("connection", (con, ...params) => {
		 *   con.open(); // need to open before call con.send()
		 *   console.log("someone connected with params", params);
		 *   con.send("Welcome!");
		 * })
		 * ```
		 * After the event is processed, the connection will be automatically opened (if {@link Connection#close} or {@link Connection#defer} was not called).
		 * */
		connection: [connection: Connection<DESC>, ...params: DESC extends {parameters: infer T extends any[]} ? T : any[]];
		/**
		 * connection successfully opened
		 * @example
		 * ```ts
		 * room.on("connectionOpen", (con) => {
		 *   con.send("Welcome!");
		 * })
		 * ```
		 * */
		connectionOpen: [connection: Connection<DESC>];
		/**
		 * connection closed
		 * @example
		 * ```ts
		 * room.on("connectionClose", (con, reason, wasOpen) => {
		 *   console.log("connection closed by reason:", reason);
		 * })
		 * ```
		 * */
		connectionClose: [connection: Connection<DESC>, reason: string | null, wasOpen: boolean];
		/**
		 * received a message from connection
		 * @example
		 * ```ts
		 * room.on("connectionMessage", (con, ...data) => {
		 *   console.log("got message:", data);
		 * })
		 * ```
		 * */
		connectionMessage: [connection: Connection<DESC>, ...data: DESC extends {clientMessage: infer T extends any[]} ? T : any[]];
	}
	
	export interface Room <DESC extends RoomDesc = {}> {
		withType<
			PARTIAL_DESC extends Record<keyof RoomDesc, any> extends PARTIAL_DESC ? RoomDesc : never = {}
		>(): OverrideKeys<DESC, PARTIAL_DESC> extends infer T extends (Record<keyof RoomDesc, any> extends T ? RoomDesc : never) ? Room<T> : never;
		
		validate<V extends RoomValidator>(
			{clientMessage, parameters}: V
		): ApplyRoomValidator<DESC, V> extends infer T extends (Record<keyof RoomDesc, any> extends T ? RoomDesc : never) ? Room<T> : never;
		
		/** @hidden */
		get promise(): Promise<this>;
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
		getConnections(filter?: {ready?: boolean, deferred?: boolean, closed?: boolean}): Set<Connection<DESC>>;
		
		/**
		 * Get current {@link Connection} in scope or throws error.
		 * Use this method in room event handlers or RPC methods.
		 * `useConnection` allowed to be called only in sync code.
		 * ```javascript
		 * export async function remoteMethod(){
		 *   const con = room.useConnection(); // OK
		 *   await something();
		 *   const con = room.useConnection(); // throws
		 * }
		 * ```
		 * @returns Connection
		 */
		useConnection(): Connection<DESC>;
		
		/**
		 * @event
		 * @template {keyof RoomEvents} T
		 * subscribe on event
		 * @param {keyof RoomEvents} event "connection", "connectionOpen", "connectionClose" or "connectionMessage"
		 * @param {(...args: RoomEvents[T]) => void} handler event handler
		 * @see RoomEvents
		 */
		on<T extends keyof RoomEvents<DESC>>(event: T, handler: (this: this, ...args: RoomEvents<DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof RoomEvents} T
		 * subscribe on event once
		 * @param {keyof RoomEvents} event "connection", "connectionOpen", "connectionClose" or "connectionMessage"
		 * @param {(...args: RoomEvents[T]) => void} handler event handler
		 * @see RoomEvents
		 */
		once<T extends keyof RoomEvents<DESC>>(event: T, handler: (this: this, ...args: RoomEvents<DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof RoomEvents} T
		 * unsubscribe from event
		 * @param {keyof RoomEvents} event "connection", "connectionOpen", "connectionClose" or "connectionMessage"
		 * @param {(...args: RoomEvents[T]) => void} handler event handler
		 * @see RoomEvents
		 */
		off<T extends keyof RoomEvents<DESC>>(event: T, handler: (this: this, ...args: RoomEvents<DESC>[T]) => void): this;
		
		[Symbol.dispose](): void;
		[Symbol.asyncDispose](): Promise<void>;
	}
	const room: Room;
	/**
	 * Controller of this room.
	 * Singleton instance of type {@link Room }
	 * @see Room
	 */
	export default room;
}

/**
 * provides class {@link EventEmitter}
 * @module
 */
declare module "varhub:events" {
	/**
	 * @example
	 * ```javascript
	 * import EventEmitter from "varhub:event";
	 * const events = new EventEmitter();
	 * events.on("message", (...args) => console.log(...args));
	 * events.emit("message", 1, 2, 3);
	 * ```
	 */
	export default class EventEmitter<M extends Record<any, any[]>> {
		on<E extends keyof M, T = this>(this:T, event: E, handler: (this:T, ...args: M[E]) => void): T;
		once<E extends keyof M, T = this>(this:T, event: E, handler: (this:T, ...args: M[E]) => void): T;
		off<E extends keyof M, T = this>(this:T, event: E, handler: (this:T, ...args: M[E]) => void): T;
		emit<E extends keyof M>(event: E, ...args: M[E]): boolean;
		/**
		 * like {@link EventEmitter#emit}, but ignore handler errors
		 */
		emitWithTry<T extends keyof M>(event: T, ...args: M[T]): boolean;
	}
}

/**
 * provides class {@link Players} to combine connections by name
 * @module
 */
declare module "varhub:players" {
	import type { Connection, Room, RoomDesc } from "varhub:room"
	type PlayerDesc = {
		team?: string,
		data?: any
	};
	
	/**
	 * @event
	 */
	export type PlayerEvents<ROOM_DESC extends RoomDesc> = {
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
		/**
		 * message from player
		 * ```typescript
		 * player.on("connectionMessage", (connection, ...msg) => {
		 *   console.log(player.name, "said:", ...msg);
		 *   connection.send("thanks for a message");
		 * });
		 * ```
		 */
		connectionMessage: [connecton: Connection<ROOM_DESC>, ...message: ROOM_DESC extends {clientMessage: infer T extends any[]} ? T : any[]]
	}
	
	/**
	 * Player represents a list of {@link Connection}s with same name.
	 */
	export interface Player<DESC extends PlayerDesc = {}, ROOM_DESC extends RoomDesc = {}> {
		/**
		 * custom data for this player
		 */
		data?: DESC extends {data: infer T} ? T : any;
		/**
		 * player's name
		 */
		get name(): string;
		/**
		 * get all player's connections
		 */
		get connections(): Set<Connection<ROOM_DESC>>;
		
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
		get team(): (DESC extends {team: infer T} ? T : string)|undefined;
		/**
		 * set player's group
		 */
		setTeam(value: (DESC extends {team: infer T} ? T : string)|undefined): this;
		/**
		 * send message for all connections
		 * @param args
		 */
		send(...args: ROOM_DESC extends {roomMessage: infer R extends any[]} ? R : any[]): this;
		/**
		 * @event
		 * @template {keyof PlayerEvents} T
		 * subscribe on event
		 * @param {keyof PlayerEvents} eventName "leave", "online", "connectionMessage" or "offline"
		 * @param {(...args: PlayerEvents[T]) => void} handler event handler
		 */
		on<T extends keyof PlayerEvents<ROOM_DESC>>(eventName: T, handler: (...args: PlayerEvents<ROOM_DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayerEvents} T
		 * subscribe on event once
		 * @param {keyof PlayerEvents} eventName "leave", "online", "connectionMessage" or "offline"
		 * @param {(...args: PlayerEvents[T]) => void} handler event handler
		 */
		once<T extends keyof PlayerEvents<ROOM_DESC>>(eventName: T, handler: (...args: PlayerEvents<ROOM_DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayerEvents} T
		 * subscribe on event once
		 * @param {keyof PlayerEvents} eventName "leave", "online", "connectionMessage" or "offline"
		 * @param {(...args: PlayerEvents[T]) => void} handler event handler
		 */
		off<T extends keyof PlayerEvents<ROOM_DESC>>(eventName: T, handler: (...args: PlayerEvents<ROOM_DESC>[T]) => void): this;
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
		[Symbol.iterator](): SetIterator<Connection<ROOM_DESC>>;
	}
	
	/** @group Events */
	export type PlayersEvents<PLAYER_DESC extends PlayerDesc, ROOM_DESC extends RoomDesc> = {
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
		join: [Player<PLAYER_DESC, ROOM_DESC>]
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
		leave: [Player<PLAYER_DESC, ROOM_DESC>]
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
		online: [Player<PLAYER_DESC, ROOM_DESC>]
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
		offline: [Player<PLAYER_DESC, ROOM_DESC>]
	}
	export default class Players<
		PLAYER_DESC extends Record<keyof PlayerDesc, any> extends PLAYER_DESC ? PlayerDesc : never = {},
		ROOM_DESC extends Record<keyof RoomDesc, any> extends ROOM_DESC ? RoomDesc : never = {}
	> {
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
		constructor(
			room: Room<ROOM_DESC>,
			registerPlayerHandler: (
				connection: Connection<ROOM_DESC>,
				...args: ROOM_DESC extends {parameters: infer R extends any[]} ? R : any[]
			) => string|void|null|undefined|Promise<string|void|null|undefined>);
		/**
		 * get player by name or connection
		 * @param nameOrConnection name or connection
		 */
		get(nameOrConnection: Connection|string): Player<PLAYER_DESC, ROOM_DESC>|undefined;
		
		/**
		 * get current Room
		 */
		get room(): Room<ROOM_DESC>;
		
		/**
		 * override current type of Players (typescript)
		 * @typeParam DESC
		 * @typeParam DESC.team - (optional, extends string) available teams of players
		 * @typeParam DESC.data - (optional, any) custom data of player ({@link Player#data})
		 * @example
		 * ```typescript
		 * const players = _players.withType<
		 *   team: "red"|"blue",
		 *   data: number
		 * >()
		 * ```
		 */
		withType<DESC extends Record<keyof PlayerDesc, any> extends DESC ? PlayerDesc : never = {}>(): Players<DESC, ROOM_DESC>;
		
		/**
		 * get number of players
		 */
		get count(): number;
		/**
		 * get all players with specified group. If group is undefined - get all players without group.
		 * @param group
		 */
		getTeam(group: (PLAYER_DESC extends {team: infer T} ? T : string)|undefined): Set<Player<PLAYER_DESC, ROOM_DESC>>;
		/**
		 * get all players
		 */
		all(): Set<Player<PLAYER_DESC, ROOM_DESC>>;
		/**
		 * @event
		 * @template {keyof PlayersEvents} T
		 * subscribe on event
		 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
		 * @param {(...args: PlayersEvents[T]) => void} handler event handler
		 */
		on<T extends keyof PlayersEvents<PLAYER_DESC, ROOM_DESC>>(eventName: T, handler: (this:this, ...args: PlayersEvents<PLAYER_DESC, ROOM_DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayersEvents} T
		 * subscribe on event once
		 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
		 * @param {(...args: PlayersEvents[T]) => void} handler event handler
		 */
		once<T extends keyof PlayersEvents<PLAYER_DESC, ROOM_DESC>>(eventName: T, handler: (this:this, ...args: PlayersEvents<PLAYER_DESC, ROOM_DESC>[T]) => void): this;
		/**
		 * @event
		 * @template {keyof PlayersEvents} T
		 * unsubscribe from event
		 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
		 * @param {(...args: PlayersEvents[T]) => void} handler event handler
		 */
		off<T extends keyof PlayersEvents<PLAYER_DESC, ROOM_DESC>>(eventName: T, handler: (this:this, ...args: PlayersEvents<PLAYER_DESC, ROOM_DESC>[T]) => void): this;
		/**
		 * iterate on all players
		 */
		[Symbol.iterator](): MapIterator<Player<PLAYER_DESC, ROOM_DESC>>;
	}
}

/**
 * provides class {@link RPCSource} that allows you to handle remote procedure calls
 * @example
 * ```javascript
 * import room from "varhub:room";
 * import RPCSource from "varhub:rpc";
 *
 * const mathSource = new RPCSource({
 *   sum: (x, y) => x + y,
 *   mul: (x, y) => x * y,
 * })
 * RPCSource.start(mathSource, room);
 * ```
 * @module
 */
declare module "varhub:rpc" {
	import type { Connection, Room } from "varhub:room";
	export type RPCHandler = ((connection: Connection, path: string[], args: any[], openChannel: boolean) => any);
	type EventPath<T, K extends keyof T = keyof T> = (K extends (string|number) ? (T[K] extends any[] ? (K | [K]) : [K, ...(EventPath<T[K]> extends infer NEXT extends ((string|number)|(string|number)[]) ? (NEXT extends any[] ? NEXT : [NEXT]) : never)]) : never)
	type EventPathArgs<PATH, FORM> = (PATH extends keyof FORM ? (FORM[PATH] extends any[] ? FORM[PATH] : never) : PATH extends [] ? (FORM extends any[] ? FORM : never) : PATH extends [infer STEP extends (string|number), ...infer TAIL extends (string|number)[]] ? (STEP extends keyof FORM ? EventPathArgs<TAIL, FORM[STEP]> : never) : never)
	type DeepIterable<T> = T | Iterable<DeepIterable<T>>;
	type BoxMethods<T, PREFIX extends string> = {
		[KEY in keyof T as KEY extends `${PREFIX}${infer NAME}` ? NAME : never]: T[KEY];
	};
	type MetaScopeValue<METHODS, EVENTS, STATE> = {
		[Symbol.unscopables]: {
			__rpc_methods: METHODS;
			__rpc_events: EVENTS;
			__rpc_state: STATE;
		};
	};
	type RestParams<T extends any[]> = T extends [any, ...infer R] ? R : never;
	/**
	 * Remote procedure call handler
	 */
	export default class RPCSource<METHODS extends Record<string, any> | string = {}, STATE = undefined, EVENTS = any> implements Disposable {
		static with<const BIND_METHODS extends string | Record<string, any> = {}, BIND_STATE = undefined, const BIND_EVENTS = {}>(): {
			new <METHODS extends Record<string, any> | string = BIND_METHODS, STATE = BIND_STATE, EVENTS = BIND_EVENTS>(methods: METHODS, state?: STATE): RPCSource<METHODS, STATE, EVENTS>;
			prototype: RPCSource<any, any, any>;
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
		static with<const BIND_METHODS extends Record<string, any> | string = {}, BIND_STATE = undefined, const BIND_EVENTS = {}>(methods: BIND_METHODS | RPCHandler): {
			new <STATE = BIND_STATE, EVENTS = BIND_EVENTS>(state?: STATE): RPCSource<BIND_METHODS, STATE, EVENTS>;
			prototype: RPCSource<any, any, any>;
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
		static with<const BIND_METHODS extends Record<string, any> | string = {}, BIND_STATE = undefined, const BIND_EVENTS = {}>(methods: BIND_METHODS | RPCHandler, state: BIND_STATE): {
			new <EVENTS = BIND_EVENTS>(): RPCSource<BIND_METHODS, BIND_STATE, EVENTS>;
			prototype: RPCSource<any, any, any>;
		};
		
		/** @hidden */
		[Symbol.unscopables]: MetaScopeValue<METHODS extends string ? BoxMethods<this, METHODS> : METHODS, EVENTS, STATE>;
		
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
		 *     console.log("connection:", room.useConnection());
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
		constructor(handler?: RPCHandler | METHODS, initialState?: STATE);
		/**
		 * create {@link RPCHandler} based on object with methods
		 * @param parameters
		 * @param parameters.form object with methods.
		 * @param prefix prefix of used methods, empty by default
		 * @returns - {@link RPCHandler}
		 */
		static createDefaultHandler(parameters: {
			form: any;
		}, prefix?: string): RPCHandler;
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
		 * Emit event for all connected clients.
		 * Reserved event names: `close`, `init`, `error`, `state`
		 * @param predicate event will be sent only to the listed connections.
		 * @param event path for event. String or array of strings.
		 * @param args event values
		 */
		emitFor<P extends EventPath<EVENTS>>(predicate: DeepIterable<Connection> | ((con: Connection) => any) | null | undefined, event: P, ...args: EventPathArgs<P, EVENTS>): this;
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
		static start(rpcSource: RPCSource<any, any, any>, room: Room, options?: {
			maxChannelsPerClient?: number;
			key?: string
		}): () => void;
		
		/**
		 * create {@link RPCHandler} based on object with methods
		 * @param parameters
		 * @param parameters.form object with methods.
		 * @returns - {@link RPCHandler}
		 */
		static createDefaultHandler(parameters: {form: any}): RPCHandler;
		
		/**
		 * Create function with validation of arguments
		 * @param validator function to validate arguments. `(args) => boolean | any[]`
		 * - args - array of validating values
		 * - returns:
		 *   - `true` - pass args to the target function
		 *   - `false` - validation error will be thrown
		 *   - `any[]` - replace args and pass to the target function
		 * - throws: error will be thrown
		 * @param handler - target function
		 * @returns a new function with validation of arguments
		 * @example
		 * ```typescript
		 * const validateString = (args: any[]) => args.length === 1 && [String(args[0])] as const;
		 *
		 * const fn = RPCSource.validate(validateString, (arg) => {
		 *   return arg.toUpperCase() // <-- string
		 * });
		 *
		 * fn("foo") // "FOO"
		 * fn(10) // "10"
		 * fn(); // throws error
		 * fn("foo", "bar"); // throws error
		 * ```
		 */
		static validate<
			V extends ((args: any[]) => false | readonly any[]) | ((args: any[]) => args is any[]),
			A extends (
				...args: V extends ((args: any[]) => args is infer R extends any[]) ? R : V extends ((args: any[]) => false | infer R extends readonly any[]) ? R : never
			) => any
		>(
			validator: V,
			handler: A
		): NoInfer<A>;
		
		/**
		 * get the current rpc source, based on exports of main module.
		 * value is undefined while main module is executing
		 */
		static get default(): RPCSource<any, any, any>;
	}
}

/**
 * source of room config
 * @example
 * ```javascript
 * import config from "varhub:config";
 * console.log("Room config", config);
 * ```
 * @module
 */
declare module "varhub:config" {
	/**
	 * config of this room. Config is created with room.
	 */
	const config: unknown;
	export default config;
}

/**
 * `performance.now()`
 * @example
 * ```javascript
 * import * as performance from "varhub:performance";
 * console.log(performance.now());
 * ```
 * @example
 * ```javascript
 * import {now} from "varhub:performance";
 * console.log(now());
 * ```
 * @module
 */
declare module "varhub:performance" {
	/**
	 * performance.now()
	 * @returns { number } - time in milliseconds since room initialized
	 * */
	export const now: () => number;
}

/**
 * network module
 * @example
 * ```javascript
 * import network from "varhub:api/network";
 * const response = await network.fetch("https://example.com");
 * console.log(response.body);
 * ```
 * @module
 */
declare module "varhub:api/network" {
	export interface NetworkApi {
		/**
		 * customized fetch function
		 * @param url - url to fetch as string
		 * @param params
		 * @param params.method http method. `GET` by default
		 * @param params.type - `"json"|"text"|"arrayBuffer"|"formData"`. By default, it will define using header content-type
		 * @param params.headers - `Record<string, string>` add custom headers to the request
		 * @param params.body - request body. Empty by default
		 * @param params.redirect @see [RequestInit.redirect](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#redirect)
		 * @param params.credentials @see [RequestInit.credentials](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#credentials)
		 * @param params.mode @see [RequestInit.mode](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#mode)
		 * @param params.referrer @see [RequestInit.referrer](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrer)
		 * @param params.referrerPolicy @see [RequestInit.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrerpolicy)
		 * @returns - Promise<{@link FetchResult}>
		 */
		fetch<T extends keyof BodyType>(url: string, params?: FetchParams<T>): Promise<FetchResult<T>>
	}
	type BodyType = {
		json: unknown;
		text: string;
		arrayBuffer: ArrayBuffer;
		formData: Array<[name: string, value: string | FileJson]>
	}
	
	export interface FileJson {
		type: string,
		size: number,
		name: string,
		lastModified: number,
		data: ArrayBuffer
	}
	
	export type FormDataJsonItem = [name: string, value: string] | [name: string, value: FileJson] | [name: string, value: ArrayBuffer, fileName: string];
	export type FormDataJson = FormDataJsonItem[];
	export type FetchRequestBody = string | ArrayBuffer | FormDataJson
	
	/**
	 *  options that can be used to configure a fetch request.
	 */
	export type FetchParams<T extends keyof BodyType = keyof BodyType> = {
		/**
		 * `"json"|"text"|"arrayBuffer"|"formData"`. By default, it will define using header content-type
		 */
		type?: T
		/**
		 * http method. `GET` by default
		 */
		method?: RequestInit["method"],
		/**
		 * add custom headers to the request
		 */
		headers?: Record<string, string>,
		/**
		 * request body. Empty by default.
		 */
		body?: FetchRequestBody
		/**
		 * @see [RequestInit.redirect](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#redirect)
		 */
		redirect?: RequestInit["redirect"],
		/**
		 * @see [RequestInit.credentials](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#credentials)
		 */
		credentials?: RequestInit["credentials"]
		/**
		 * @see [RequestInit.mode](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#mode)
		 */
		mode?: RequestInit["mode"]
		/**
		 * @see [RequestInit.referrer](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrer)
		 */
		referrer?: RequestInit["referrer"]
		/**
		 * @see [RequestInit.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrerpolicy)
		 */
		referrerPolicy?: RequestInit["referrerPolicy"]
	};
	
	/**
	 * represents the response to a fetch request.
	 */
	export interface FetchResult<T extends keyof BodyType = keyof BodyType> {
		url: string,
		/**
		 * A boolean indicating whether the response was successful (status in the range 200 – 299) or not.
		 */
		ok: boolean,
		/**
		 * @see [Response.type](https://developer.mozilla.org/en-US/docs/Web/API/Response/type)
		 */
		type: string,
		/**
		 * The status message corresponding to the status code. (e.g., OK for 200).
		 */
		statusText: string,
		/**
		 * Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry).
		 */
		redirected: boolean,
		/**
		 * response status
		 */
		status: number,
		/**
		 * The headers object associated with the response.
		 */
		headers: Record<string, string>,
		/**
		 * response body
		 *
		 * if request type is `"json"` returns json object;
		 *
		 * if request type is `"text"` returns `string`;
		 *
		 * if request type is `"arrayBuffer"` returns {@link ArrayBuffer};
		 *
		 * if request type is `"formData"` returns `Array`<[name: `string`, value: `string`|{@link FileJson}]>;
		 */
		body: BodyType[T],
	}
	
	const api: NetworkApi
	export default api;
}
