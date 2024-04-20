export * from "./src/index.js"

declare module "varhub:room" {
	type RoomEvents = {
		join: [string];
		leave: [string];
		online: [string];
		offline: [string];
	}
	const room: {
		get message(): string;
		set message(value: string);
		get closed(): boolean;
		set closed(value: boolean);
		destroy(): void;
		isPlayerOnline(name: string): boolean | undefined;
		hasPlayer(name: string): boolean;
		kick(name: string, reason?: string|null): boolean;
		send(name: string, ...args: any[]): boolean;
		broadcast(...args: any[]): void;
		getPlayerData(name: string): unknown;
		getPlayers(): string[];
		on<T extends keyof RoomEvent>(event: T, handler: (...args: RoomEvents[T]) => void): this;
		once<T extends keyof RoomEvent>(event: T, handler: (...args: RoomEvents[T]) => void): this;
		off<T extends keyof RoomEvent>(event: T, handler: (...args: RoomEvents[T]) => void): this;
	}
	export default room;
}

declare module "varhub:events" {
	export declare class EventEmitter<M extends Record<any, any[]>> {
		on<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		once<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		off<T extends keyof M>(event: T, handler: (...args: M[T]) => void): this;
		emit<T extends keyof M>(event: T, ...args: M[T]): boolean
	}
}

declare module "varhub:config" {
	const config: unknown;
	export default config;
}