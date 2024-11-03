import { VarhubClient } from "./VarhubClient.js";
import { RoomSocketHandler } from "./RoomSocketHandler.js";

type RoomCreateOptionsMap = {
	/** isolate-dvm controller */
	"ivm": {
		request: {
			/** javascript sources */
			module: RoomModule,
			/** `true` - generate integrity key for module; `string` - check integrity; other - do not use integrity */
			integrity?: boolean | string
			/** value of ```import config from "varhub:config"``` */
			config?: any,
			/** public message of this room. Required to publish room */
			message?: string,
			/** `true` - allow to inspect v8; `string` - allow to inspect and add inspector with this id */
			inspect?: string | boolean,
		},
		response: {
			/** room id */
			id: string,
			/** room integrity if used */
			integrity: string | null
			/** public message of this room */
			message: string | null
			/** new key of websocket to inspect v8 */
			inspect: string | null
		}
	},
	/** quick-js controller */
	"qjs": {
		request: {
			/** javascript sources */
			module: RoomModule,
			/** `true` - generate integrity key for module; `string` - check integrity; other - do not use integrity */
			integrity?: boolean | string
			/** value of ```import config from "varhub:config"``` */
			config?: any,
			/** public message of this room. Required to publish room */
			message?: string,
			/** use quick-js in async node */
			async?: boolean
			/** add logger with this id */
			logger?: string,
		},
		response: {
			/** room id */
			id: string,
			/** room integrity if used */
			integrity: string | null
			/** public message of this room */
			message: string | null
		}
		
	}
}

type RoomCreateOptions<T extends string> = T extends keyof RoomCreateOptionsMap ? RoomCreateOptionsMap[T]["request"] : any;
type RoomCreateResult<T extends string> = T extends keyof RoomCreateOptionsMap ? RoomCreateOptionsMap[T]["response"] : any;

interface RoomModule {
	main: string,
	source: Record<string, string>
}

export interface RoomJoinOptions {
	integrity?: string
	params?: any[],
}

/**
 * Varhub instance to manage rooms, create clients
 */
export class Varhub {
	readonly #baseUrl: URL;
	
	constructor(url: string|URL) {
		this.#baseUrl = url instanceof URL ? url : new URL(url);
	}
	
	/**
	 * get current url as string
	 * @returns string
	 */
	get url(): string {
		return this.#baseUrl.href;
	}
	
	/**
	 * Create new room
	 * @param type type of VM
	 * @param [options] options
	 */
	async createRoom<T extends keyof RoomCreateOptionsMap>(type: T, options: RoomCreateOptions<T>): Promise<RoomCreateResult<T>> {
		return this.#fetch("POST", `room/${encodeURIComponent(type)}`, JSON.stringify(options));
	}
	
	/**
	 * create websocket connection to handle new room
	 * @param [options] options
	 * @param [options.message] set public message of this room
	 * @param [options.integrity] set integrity for new room. Starts with "custom:"
	 */
	createRoomSocket(options: {message?: string, integrity?: `custom:${string}`} = {}): RoomSocketHandler {
		const [ws, getErrorLog] = this.#createWebsocketWithErrorLoader("room/ws", options);
		return new RoomSocketHandler(ws, getErrorLog);
	}
	
	/**
	 * Find public rooms with `integrity`.
	 * You can find only rooms created with integrity.
	 * If room has no message, it will not be included in result.
	 * @param integrity {string}
	 * @returns record of <roomId, message>.
	 */
	async findRooms(integrity: string): Promise<Record<string, string>> {
		return this.#fetch("GET", `rooms/${encodeURIComponent(integrity)}`);
	}
	
	/**
	 * Get public message of room.
	 * @param roomId {string} room id
	 * @param integrity {string} required if room was created with integrity
	 * @returns string
	 * @throws Error if room not found or room not public or integrity mismatch
	 */
	async getRoomMessage(roomId: string, integrity?: string): Promise<string> {
		return this.#fetch("GET", `room/${encodeURIComponent(roomId)}`);
	}
	
	/**
	 * Join room.
	 *
	 * @param roomId room id
	 *
	 * @param {RoomJoinOptions} [options] options
	 *
	 * @param [options.integrity] check room integrity before join.
	 *
	 * 	if there is an integrity error there will be a connection error.
	 *
	 * 	two clients can not be connected with different passwords.
	 *
	 * @param [options.params] additional data of client.
	 *
	 * 	it can be used in `roomConnection.parameters`.
	 *
	 * @returns client
	 */
	join(roomId: string, options: RoomJoinOptions = {}): VarhubClient {
		const [ws, getErrorLog] = this.#createWebsocketWithErrorLoader(`room/${encodeURIComponent(roomId)}`, options, ["params"]);
		return new VarhubClient(ws, getErrorLog);
	}
	
	/**
	 * Create websocket connection for qjs logger or ivm inspector
	 *
	 *
	 * example to generate random id
	 * @example
	 * ```js
	 * Array.from({length:10}).map(() => Math.random().toString(36).substring(2)).join("")
	 * ```
	 * @param {string} loggerId
	 */
	createLogger(loggerId: string): WebSocket {
		return this.#createWebsocketWithErrorLoader(`log/${encodeURIComponent(String(loggerId))}`)[0]
	}
	
	async #fetch(method: string, path: string, body?: string): Promise<any> {
		const getRoomsUrl = new URL(path, this.#baseUrl);
		const response = await fetch(getRoomsUrl, {
			method: method,
			headers: {'Content-Type': 'application/json'},
			body,
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		return response.json();
	}
	
	#createWebsocketWithErrorLoader<T extends Record<string, any>>(path: string, options?: T, stringifyKeys?: (keyof T)[] ): [WebSocket, () => Promise<any>]{
		const wsUrl = new URL(this.#baseUrl);
		wsUrl.protocol = this.#baseUrl.protocol.replace("http", "ws");
		const joinRoomUrl = new URL(path, wsUrl);
		if (options) for (let [key, value] of Object.entries(options)) {
			if (value === undefined) continue;
			if (stringifyKeys?.includes(key)) value = JSON.stringify(value);
			joinRoomUrl.searchParams.set(key, value);
		}
		
		const errorId = Array(5).fill(0).map(() => Math.random().toString(36).substring(2)).join("");
		const getError = () => {
			return this.#fetch("GET", `/log/${encodeURIComponent(errorId)}`);
		}
		joinRoomUrl.searchParams.set("errorLog", errorId);
		const ws = new WebSocket(joinRoomUrl);
		ws.binaryType = "arraybuffer";
		return [ws, getError];
	}
}