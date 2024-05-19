declare module "varhub:room" {
	/**
	 * Define all events dispatched by room controller
	 * @see RoomEvents#join
	 * @see RoomEvents#leave
	 * @see RoomEvents#online
	 * @see RoomEvents#offline
	 * @see RoomEvents#connectionJoin
	 * @see RoomEvents#connectionClosed
	 */
	type RoomEvents = {
		/**
		 * a new player joins the room.
		 * event is not dispatched if the player joins again from another session
		 * @param player name of joined player
		 */
		join: [player: string];
		/**
		 * a player leaves the room.
		 * event is not dispatched if the player closes session
		 * event dispatched only manually by `room.kick`
		 * @params name of leaved player
		 */
		leave: [player: string];
		/**
		 * a player joined again in new session
		 * @param player name of player who connected again
		 */
		online: [player: string];
		/**
		 * a player close all sessions
		 *
		 * Example: remove player when he had closes all sessions
		 * ```typescript
		 * 	room.on("offline", (player: string) => room.kick(player));
		 * ```
		 * @param player name of player who disconnected
		 */
		offline: [player: string];
		/**
		 * new connection created
		 *
		 * it can be a new player or existing player with new connection.
		 *
		 * `connectionJoin` emits after `join` event
		 *
		 * @param player name of player
		 * @param connection connection id
		 */
		connectionJoin: [player: string, connection: number];
		/**
		 * connection closed
		 *
		 * `connectionClosed` emits before `offline` and `leave` events
		 *
		 * @param player name of player
		 * @param connection connection id
		 * @param reason reason
		 */
		connectionClosed: [player: string, connection: number, reason: null | string];
	}
	
	class Room {
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
		 * is room closed. New players can not join a closed room.
		 */
		get closed(): boolean;
		/**
		 * set room closed
		 */
		set closed(value: boolean);
		
		/**
		 * destroy this room.
		 */
		destroy(): void;
		
		/**
		 * check if player online
		 * @returns `undefined` if player is kicked or has not yet joined
		 */
		isPlayerOnline(player: string): boolean | undefined;
		
		/**
		 * check if player online
		 * @returns `false` if player offline or not yet joined
		 */
		isOnline(player: string): boolean;
		
		/**
		 * check if connection online
		 */
		isOnline(connection: number): boolean;
		/**
		 * check if player joined. `room.getPlayers().includes(name)`
		 */
		hasPlayer(player: string): boolean;
		
		/**
		 * kick player and close all sessions
		 * @returns `true` on success, otherwise `false`
		 */
		kick(player: string, reason?: string|null): boolean;
		
		/**
		 * kick one session of player
		 * @returns `true` on success, otherwise `false`
		 */
		kick(connection: number, reason?: string|null): boolean;
		/**
		 * send message to player
		 *
		 * Example
		 * ```typescript
		 *	room.on("join", (player) => {
		 *		room.send(player, "chatMessage", {
		 *			from: "system",
		 *			message: "Welcome, "+player+"!"
		 *		});
		 *	})
		 * ```
		 * @returns true if player online
		 */
		send(player: string, ...args: any[]): boolean;
		
		/**
		 * send message to special connection
		 *
		 * Example
		 * ```typescript
		 *	room.on("connectionJoin", (player, connection) => {
		 *		room.send(connection, "state", getCurrentState());
		 *	})
		 * ```
		 * @returns true if player online
		 */
		send(connection: number, ...args: any[]): boolean;
		/**
		 * send message to all players
		 *
		 * Example
		 * ```ts
		 * 	room.on("join", (player) => {
		 * 		room.broadcast("chatMessage", {
		 * 			from: "system",
		 * 			message: "New player connected: "+player;
		 * 		});
		 * 	})
		 * ```
		 */
		broadcast(...args: any[]): void;
		/**
		 * get player's data saved on first connection
		 */
		getPlayerData(player: string): unknown;
		/**
		 * get all established connections of player
		 * @returns
		 *
		 * `undefined` if there are no player
		 *
		 * `[]` if player offline
		 */
		getPlayerConnections(player: string): undefined | number[];
		/**
		 * list of all (online & offline) players
		 */
		getPlayers(): string[];
		
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
}

declare module "varhub:events" {
	export class EventEmitter<M extends Record<any, any[]>> {
		on<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		once<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		off<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		emit<T extends keyof M>(event: T, ...args: M[T]): boolean
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
