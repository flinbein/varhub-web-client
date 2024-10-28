import EventEmitter from "./EventEmitter.js";
import type { Connection, RoomSocketHandler as Room } from "./RoomSocketHandler.js";
import type { XJData } from "@flinbein/xjmapper";

/**
 * events of {@link Players} object
 * @event
 * */
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

/**
 * List of players based on named connections.
 */
export default class Players {
	readonly #playerMap = new Map<string, Player>();
	readonly #playerConnections = new WeakMap<Player, Set<Connection>>();
	readonly #playerGroups = new WeakMap<Player, string>();
	readonly #playerEvents = new WeakMap<Player, EventEmitter<PlayerEvents>>();
	readonly #connectionPlayerNameMap = new WeakMap<Connection, string>();
	readonly #registerPlayer
	readonly #controller = {
		isRegistered: (player: Player) => this.#playerMap.get(player.name) === player,
		getGroupOf: (player: Player) => this.#playerGroups.get(player),
		setGroupOf: (player: Player, group: string|undefined) => {
			if (group === undefined) return this.#playerGroups.delete(player);
			this.#playerGroups.set(player, group);
		},
		getConnectionsOf: (player: Player) => this.#playerConnections.get(player),
		registerEvents: (player: Player, events: EventEmitter<PlayerEvents>) => this.#playerEvents.set(player, events),
		kick: (player: Player, reason: string|null) => {
			const existsPlayer =  this.#playerMap.get(player.name);
			if (existsPlayer !== player) return;
			this.#playerMap.delete(player.name);
			const connections = this.#playerConnections.get(player)!
			for (let connection of connections) connection.close(reason);
			connections.clear();
			this.#playerEvents.get(player)?.emitWithTry("leave");
			this.#events.emitWithTry("leave", player);
		}
	}
	
	
	readonly #events = new EventEmitter<PlayersEvents>();
	
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
	constructor(room: Room, registerPlayerHandler: (connection: Connection, ...args: XJData[]) => string|void|null|undefined|Promise<string|void|null|undefined>) {
		this.#registerPlayer = registerPlayerHandler;
		room.on("connection", this.#onConnection);
		room.on("connectionOpen", this.#onConnectionOpen);
		room.on("connectionClose", this.#onConnectionClose);
	}
	
	#onConnection = async (connection: Connection, ...args: XJData[]) => {
		let registerResult;
		try {
			registerResult = this.#registerPlayer(connection, ...args);
		} catch (e) {
			return connection.close(e == null ? null : String(e));
		}
		if (connection.ready || connection.closed) return;
		if (!(registerResult && typeof registerResult === "object" && "then" in registerResult)) {
			if (registerResult != null) this.#connectionPlayerNameMap.set(connection, String(registerResult));
			return;
		}
		connection.defer(async () => {
			const syncResult = await registerResult;
			if (connection.deferred && syncResult != null) {
				this.#connectionPlayerNameMap.set(connection, String(syncResult));
			}
		}).catch(() => {});
		
	}
	
	#onConnectionOpen = (connection: Connection) => {
		const playerName = this.#connectionPlayerNameMap.get(connection);
		if (playerName == null) return;
		const existsPlayer = this.#playerMap.get(playerName);
		if (existsPlayer) {
			const connections = this.#playerConnections.get(existsPlayer)!;
			connections.add(connection);
			if (connections.size === 1){
				this.#events.emitWithTry("online", existsPlayer);
				this.#playerEvents.get(existsPlayer)?.emitWithTry("online");
			}
			return;
		}
		const player = new Player(playerName, this.#controller);
		this.#playerConnections.set(player, new Set([connection]));
		this.#playerMap.set(playerName, player);
		this.#events.emitWithTry("join", player);
	}
	
	#onConnectionClose = (connection: Connection) => {
		const playerName = this.#connectionPlayerNameMap.get(connection);
		if (typeof playerName !== "string") return;
		const existsPlayer = this.#playerMap.get(playerName);
		if (!existsPlayer) return;
		const connections = this.#playerConnections.get(existsPlayer)!;
		const wasOnline = connections.size > 0;
		connections.delete(connection);
		const online = connections.size > 0;
		if (wasOnline && !online) {
			this.#events.emitWithTry("offline", existsPlayer);
			this.#playerEvents.get(existsPlayer)?.emitWithTry("offline");
		}
	}
	
	/**
	 * get player by name or connection
	 * @param nameOrConnection name or connection
	 */
	get(nameOrConnection: Connection|string): Player|undefined {
		if (typeof nameOrConnection === "string") return this.#playerMap.get(nameOrConnection);
		const playerName = this.#connectionPlayerNameMap.get(nameOrConnection);
		if (playerName != null) return this.#playerMap.get(playerName);
	}
	
	/**
	 * get number of players
	 */
	get count(){
		return this.#playerMap.size;
	}
	
	/**
	 * get all players with specified group. If group is undefined - get all players without group.
	 * @param group
	 */
	getGroup(group: string|undefined): Set<Player> {
		return new Set([...this.#playerMap.values()].filter(player => this.#playerGroups.get(player) === group));
	}
	
	/**
	 * get all players
	 */
	all(): Set<Player> {
		return new Set(this.#playerMap.values());
	}
	
	/**
	 * @event
	 * @template {keyof PlayersEvents} T
	 * subscribe on event
	 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
	 * @param {(...args: PlayersEvents[T]) => void} handler event handler
	 */
	on<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this{
		this.#events.on.call(this, eventName, handler as any);
		return this;
	}
	/**
	 * @event
	 * @template {keyof PlayersEvents} T
	 * subscribe on event once
	 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
	 * @param {(...args: PlayersEvents[T]) => void} handler event handler
	 */
	once<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this{
		this.#events.once.call(this, eventName, handler as any);
		return this;
	}
	/**
	 * @event
	 * @template {keyof PlayersEvents} T
	 * unsubscribe from event
	 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
	 * @param {(...args: PlayersEvents[T]) => void} handler event handler
	 */
	off<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this {
		this.#events.off.call(this, eventName, handler as any);
		return this;
	}
	
	/**
	 * iterate on all players
	 */
	[Symbol.iterator](): MapIterator<Player> {
		return this.#playerMap.values();
	}
}

/**
 * Events of {@link Player}
 * @event
 * */
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

/**
 * Player represents a list of {@link Connection}s with same name.
 */
class Player {
	readonly #name: string
	readonly #controller: any
	readonly #eventBox = new EventEmitter<PlayerEvents>();
	/** @hidden */
	constructor(name: string, controller: any) {
		this.#name = name;
		this.#controller = controller;
		controller.registerEvents(this, this.#eventBox);
	}
	/**
	 * player's name
	 */
	get name(): string {return String(this.#name)}
	
	/**
	 * get all player's connections
	 */
	get connections(): Set<Connection> {return new Set(this.#controller.getConnectionsOf(this))}
	/**
	 * player is online (has at least one opened connection)
	 */
	get online(): boolean {return this.#controller.getConnectionsOf(this).size > 0}
	/**
	 * player is registered in list of players
	 */
	get registered(): boolean {return this.#controller.isRegistered(this)}
	/**
	 * get player's group
	 */
	get group(): string|undefined {return this.#controller.getGroupOf(this)}
	/**
	 * set player's group
	 */
	setGroup(value: string|undefined): this {this.#controller.setGroupOf(this, value); return this}
	
	/**
	 * @event
	 * @template {keyof PlayerEvents} T
	 * subscribe on event
	 * @param {keyof PlayerEvents} eventName "leave", "online" or "offline"
	 * @param {(...args: PlayerEvents[T]) => void} handler event handler
	 */
	on<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this{
		this.#eventBox.on.call(this, eventName, handler as any);
		return this;
	}
	/**
	 * @event
	 * @template {keyof PlayerEvents} T
	 * subscribe on event once
	 * @param {keyof PlayerEvents} eventName "leave", "online" or "offline"
	 * @param {(...args: PlayerEvents[T]) => void} handler event handler
	 */
	once<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this{
		this.#eventBox.once.call(this, eventName, handler as any);
		return this;
	}
	/**
	 * @event
	 * @template {keyof PlayerEvents} T
	 * unsubscribe from event
	 * @param {keyof PlayerEvents} eventName "leave", "online" or "offline"
	 * @param {(...args: PlayerEvents[T]) => void} handler event handler
	 */
	off<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this {
		this.#eventBox.off.call(this, eventName, handler as any);
		return this;
	}
	
	/**
	 * kick player and close all player's connections
	 * @param reason
	 */
	kick(reason: string|null = null): void {
		this.#controller.kick(this, reason);
	}
	
	toString(): string {
		return String(this.#name)
	}
	
	valueOf(): string {
		return this.#name
	}
	
	/**
	 * iterate on all player's connections
	 */
	[Symbol.iterator](): SetIterator<Connection> {
		return this.connections[Symbol.iterator]()
	}
}
export type { Player };
// end of file