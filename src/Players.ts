import EventEmitter from "./EventEmitter.js";
import type { Connection, RoomSocketHandler as Room } from "./RoomSocketHandler.js";
import type { XJData } from "@flinbein/xjmapper";


type PlayerDesc = {
	team?: string,
	data?: any
};
/**
 * events of {@link Players} object
 * @event
 * */
export type PlayersEvents<DESC extends PlayerDesc = {}> = {
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
	join: [Player<DESC>]
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
	leave: [Player<DESC>]
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
	online: [Player<DESC>]
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
	offline: [Player<DESC>]
}

/**
 * List of players based on named connections.
 */
export default class Players<DESC extends PlayerDesc = {}> {
	readonly #playerMap = new Map<string, Player<DESC>>();
	readonly #playerConnections = new WeakMap<Player<DESC>, Set<Connection>>();
	readonly #playerGroups = new WeakMap<Player, string>();
	readonly #playerEvents = new WeakMap<Player<DESC>, EventEmitter<PlayerEvents>>();
	readonly #connectionPlayerNameMap = new WeakMap<Connection, string>();
	readonly #registerPlayer
	readonly #events = new EventEmitter<PlayersEvents<DESC>>();
	readonly #room;
	readonly #controller = {
		isRegistered: (player: Player) => this.#playerMap.get(player.name) === player,
		getGroupOf: (player: Player) => this.#playerGroups.get(player),
		setGroupOf: (player: Player, group: string|undefined) => {
			if (group === undefined) return this.#playerGroups.delete(player);
			this.#playerGroups.set(player, group);
		},
		getConnectionsOf: (player: Player) => this.#playerConnections.get(player as any),
		registerEvents: (player: Player, events: EventEmitter<PlayerEvents>) => this.#playerEvents.set(player as any, events),
		kick: (player: Player, reason: string|null) => {
			const existsPlayer =  this.#playerMap.get(player.name);
			if (existsPlayer !== player) return;
			this.#playerMap.delete(player.name);
			const connections = this.#playerConnections.get(player as any)!
			for (let connection of connections) connection.close(reason);
			connections.clear();
			this.#playerEvents.get(player as any)?.emitWithTry("leave");
			this.#events.emitWithTry("leave", player as any);
		}
	}
	
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
		this.#room = room;
		room.on("connection", this.#onConnection);
		room.on("connectionOpen", this.#onConnectionOpen);
		room.on("connectionMessage", this.#onConnectionMessage);
		room.on("connectionClose", this.#onConnectionClose);
	}
	
	get room(){return this.#room};
	
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
		this.#playerConnections.set(player as any, new Set([connection]));
		this.#playerMap.set(playerName, player as any);
		this.#events.emitWithTry("join", player as any);
	}
	
	#onConnectionMessage = (connection: Connection, ...args: any[]) => {
		const player = this.get(connection);
		if (player) this.#playerEvents.get(player as any)?.emitWithTry("connectionMessage", connection, ...args);
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
	get(nameOrConnection: Connection|string): Player<DESC>|undefined {
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
	 * @param team
	 */
	getTeam(team: (DESC extends {team: infer T} ? T : string)|undefined): Set<Player<DESC>> {
		return new Set([...this.#playerMap.values()].filter(player => this.#playerGroups.get(player) === team));
	}
	
	/**
	 * get all players
	 */
	all(): Set<Player<DESC>> {
		return new Set(this.#playerMap.values());
	}
	
	/**
	 * @event
	 * @template {keyof PlayersEvents} T
	 * subscribe on event
	 * @param {keyof PlayersEvents} eventName "join", "leave", "online" or "offline"
	 * @param {(...args: PlayersEvents[T]) => void} handler event handler
	 */
	on<T extends keyof PlayersEvents<DESC>>(eventName: T, handler: (...args: PlayersEvents<DESC>[T]) => void): this{
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
	once<T extends keyof PlayersEvents<DESC>>(eventName: T, handler: (...args: PlayersEvents<DESC>[T]) => void): this{
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
	off<T extends keyof PlayersEvents<DESC>>(eventName: T, handler: (...args: PlayersEvents<DESC>[T]) => void): this {
		this.#events.off.call(this, eventName, handler as any);
		return this;
	}
	
	/**
	 * iterate on all players
	 */
	[Symbol.iterator](): MapIterator<Player<DESC>> {
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
	offline: [],
	
	/**
	 * message from player
	 * ```typescript
	 * player.on("connectionMessage", (connection, ...msg) => {
	 *   console.log(player.name, "said:", ...msg);
	 *   connection.send("thanks for a message");
	 * });
	 * ```
	 */
	connectionMessage: [connecton: Connection, ...message: XJData[]]
}

/**
 * Player represents a list of {@link Connection}s with same name.
 */
class Player<DESC extends PlayerDesc = {}> {
	readonly #name: string
	readonly #controller: any
	/**
	 * custom data for this player
	 */
	declare data?: DESC extends {data: infer T} ? T : any;
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
	 * get player's team
	 */
	get team(): (DESC extends {team: infer T} ? T : string)|undefined {return this.#controller.getGroupOf(this)}
	/**
	 * set player's team
	 */
	setTeam(value: (DESC extends {team: infer T} ? T : string)|undefined): this {this.#controller.setGroupOf(this, value); return this}
	
	/**
	 * send message for all connections
	 * @param args
	 */
	send(...args: XJData[]): this {
		for (let connection of this.connections) {
			connection.send(...args);
		}
		return this;
	}
	
	/**
	 * @event
	 * @template {keyof PlayerEvents} T
	 * subscribe on event
	 * @param {keyof PlayerEvents} eventName "leave", "online", "connectionMessage" or "offline"
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
	 * @param {keyof PlayerEvents} eventName "leave", "online", "connectionMessage" or "offline"
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
	 * @param {keyof PlayerEvents} eventName "leave", "online", "connectionMessage" or "offline"
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