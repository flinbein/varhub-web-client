import { Connection, RoomSocketHandler } from "./RoomSocketHandler.js";
import { XJData } from "@flinbein/xjmapper";
import { EventBox } from "./EventBox.js";

export type PlayersEvents = {
	join: [Player]
	leave: [Player]
	online: [Player]
	offline: [Player]
}
export class Players {
	readonly #playerMap = new Map<string, Player>();
	readonly #playerConnections = new WeakMap<Player, Set<Connection>>();
	readonly #playerGroups = new WeakMap<Player, string>();
	readonly #playerEvents = new WeakMap<Player, EventBox<PlayerEvents, Player>>();
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
		registerEvents: (player: Player, events: EventBox<PlayerEvents, Player>) => this.#playerEvents.set(player, events),
		kick: (player: Player, reason: string|null) => {
			const existsPlayer =  this.#playerMap.get(player.name);
			if (existsPlayer !== player) return;
			this.#playerMap.delete(player.name);
			const connections = this.#playerConnections.get(player)!
			for (let connection of connections) connection.close(reason);
			connections.clear();
			this.#playerEvents.get(player)?.dispatch("leave", []);
			this.#eventBox.dispatch("leave", [player]);
		}
	}
	
	
	readonly #eventBox = new EventBox<PlayersEvents, this>(this);
	
	constructor(room: RoomSocketHandler, registerPlayer: (connection: Connection, ...args: XJData[]) => string|void|null|undefined|Promise<string|void|null|undefined>) {
		this.#registerPlayer = registerPlayer;
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
				this.#eventBox.dispatch("online", [existsPlayer]);
				this.#playerEvents.get(existsPlayer)!.dispatch("online", []);
			}
			return;
		}
		const player = new Player(playerName, this.#controller);
		this.#playerConnections.set(player, new Set([connection]));
		this.#playerMap.set(playerName, player);
		this.#eventBox.dispatch("join", [player]);
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
			this.#eventBox.dispatch("offline", [existsPlayer]);
			this.#playerEvents.get(existsPlayer)!.dispatch("offline", []);
		}
	}
	
	
	get(nameOrConnection: Connection|string): Player|undefined {
		if (typeof nameOrConnection === "string") return this.#playerMap.get(nameOrConnection);
		const playerName = this.#connectionPlayerNameMap.get(nameOrConnection);
		if (playerName != null) return this.#playerMap.get(playerName);
	}
	
	get count(){
		return this.#playerMap.size;
	}
	
	getGroup(group: string|undefined): Set<Player> {
		return new Set([...this.#playerMap.values()].filter(player => this.#playerGroups.get(player) === group));
	}
	
	all(): Set<Player> {
		return new Set(this.#playerMap.values());
	}
	
	on<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this{
		this.#eventBox.subscriber.on(eventName, handler);
		return this;
	}
	once<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this{
		this.#eventBox.subscriber.once(eventName, handler);
		return this;
	}
	off<T extends keyof PlayersEvents>(eventName: T, handler: (...args: PlayersEvents[T]) => void): this {
		this.#eventBox.subscriber.off(eventName, handler);
		return this;
	}
	
	[Symbol.iterator](): MapIterator<Player> {
		return this.#playerMap.values();
	}
}

export type PlayerEvents = {
	leave: []
	online: []
	offline: []
}
const Player = class Player {
	readonly #name: string
	readonly #controller: any
	readonly #eventBox = new EventBox<PlayerEvents, this>(this);
	constructor(name: string, controller: any) {
		this.#name = name;
		this.#controller = controller;
		controller.registerEvents(this, this.#eventBox);
	}
	get name(): string {return String(this.#name)}
	
	get connections(): Set<Connection> {return new Set(this.#controller.getConnectionsOf(this))}
	get online(): boolean {return this.#controller.getConnectionsOf(this).size > 0}
	get registered(): boolean {return this.#controller.isRegistered(this)}
	
	get group(): string|undefined {return this.#controller.getGroupOf(this)}
	set group(value: string|undefined) {this.#controller.setGroupOf(this, value)}
	
	on<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this{
		this.#eventBox.subscriber.on(eventName, handler);
		return this;
	}
	once<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this{
		this.#eventBox.subscriber.once(eventName, handler);
		return this;
	}
	off<T extends keyof PlayerEvents>(eventName: T, handler: (...args: PlayerEvents[T]) => void): this {
		this.#eventBox.subscriber.off(eventName, handler);
		return this;
	}
	
	kick(reason: string|null = null): void {
		this.#controller.kick(this, reason);
	}
	
	toString(): string {
		return String(this.#name)
	}
	
	valueOf(): string {
		return this.#name
	}
	
	[Symbol.iterator](): SetIterator<Connection> {
		return this.connections[Symbol.iterator]()
	}
}
export type Player = InstanceType<typeof Player>;
// end of file