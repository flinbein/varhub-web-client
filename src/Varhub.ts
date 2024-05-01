import { VarhubClient } from "./VarhubClient.js";
import { XJData } from "@flinbein/xjmapper";

interface RoomModule {
	main: string,
	source: Record<string, string>
}

interface RoomCreateOptions {
	integrity?: boolean | string
	config?: any,
	message?: string,
	async?: boolean
}

export interface RoomJoinOptions {
	integrity?: string
	password?: any,
	params?: any,
	timeout?: AbortSignal | number
}

interface RoomCreateResult {
	id: string,
	integrity?: string | null
	message: string | null
}

/**
 * Varhub instance to manage rooms, create clients
 */
export class Varhub {
	#baseUrl: URL;
	
	constructor(url: string) {
		this.#baseUrl = new URL(url);
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
	 * @param module module sources
	 * @param [options] additional options: integrity, config, message, async
	 * @param [options.integrity] required to create public rooms.
	 *
	 *	`true` - create public room with integrity.
	 *
	 *  `string` - create public room with integrity and check it.
	 *
	 *  `false (default)` - create private room without integrity.
	 * @param [options.config] add config that can be used as `import config from "varhub:config"`.
	 *	config does not affect integrity
	 * @param [options.message] set room public message on create
	 * @param [options.async] set `true` if you need async module loader
	 * @returns promise with room description.
	 */
	async createRoom(module: RoomModule, options: RoomCreateOptions = {}): Promise<RoomCreateResult> {
		const createRoomUrl = new URL("room", this.#baseUrl);
		const response = await fetch(createRoomUrl, {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({module, ...options})
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		return response.json();
	}
	
	/**
	 * Find public rooms with `integrity`.
	 * You can find only rooms created with integrity.
	 * If room has no message, it will not be included in result.
	 * @param integrity {string}
	 * @returns record of <roomId, message>.
	 */
	async findRooms(integrity: string): Promise<Record<string, string>> {
		const getRoomsUrl = new URL(`rooms/${encodeURIComponent(integrity)}`, this.#baseUrl);
		const response = await fetch(getRoomsUrl, {
			method: "GET",
			headers: {'Content-Type': 'application/json'}
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		return response.json();
	}
	
	/**
	 * Join room.
	 * @template METHODS methods that the main module exports.
	 *
	 *	Example:
	 *	```typescript
	 * 		type METHODS = {
	 * 			sendMessage(message: string) => boolean
	 * 		}
	 * 		const client = await varhub.join<METHODS>(...);
	 * 		const sentIsSuccess = await client.methods.sendMessage("hello");
	 * 	```
	 *
	 * 	You can import type of room module to inject exported methods:
	 * 	```typescript
	 * 		import type * as RoomModule from "./controller/index";
	 * 		varhub.join<typeof RoomModule>(...);
	 * 	```
	 *
	 * @template EVENTS events that the main module emits.
	 *
	 * 	Example:
	 * 	```typescript
	 * 		type EVENTS = {
	 * 			messageReceived: [message: string]
	 * 		}
	 * 		const client = await varhub.join<METHODS, EVENTS>(...);
	 * 		client.messages.on("messageReceived", (message) => {
	 * 			console.log(message);
	 * 		});
	 * 	```
	 * @param roomId room id
	 *
	 * @param name name of client (player name)
	 *
	 * @param [options] options
	 *
	 * @param [options.integrity] check room integrity before join.
	 *
	 * 	if there is an integrity error there will be a connection error.
	 *
	 * @param [options.password] password of client.
	 *
	 * 	two clients can not be connected with different passwords.
	 *
	 * @param [options.params] additional data of client.
	 *
	 * 	it can be used in `room.getPlayerData(name)`.
	 *
	 * 	data is set only in first connection.
	 *
	 * @param [options.timeout] timeout to cancel connection.
	 *
	 *  You can use `AbortSignal` to abort connection manually.
	 *
	 * @returns client to manage room connection
	 */
	async join<
		METHODS extends Record<string, any> = Record<string, (...args: XJData[]) => XJData>,
		EVENTS extends Record<string, any> = Record<string, XJData[]>
	>(roomId: string, name: string, options: RoomJoinOptions): Promise<VarhubClient<METHODS, EVENTS>> {
		const wsUrl = new URL(this.#baseUrl);
		wsUrl.protocol = this.#baseUrl.protocol.replace("http", "ws");
		const joinRoomUrl = new URL(`room/${encodeURIComponent(roomId)}/join`, wsUrl);
		joinRoomUrl.searchParams.set("name", name);
		if (options.password != null) joinRoomUrl.searchParams.set("password", options.password);
		if (options.integrity != null) joinRoomUrl.searchParams.set("integrity", options.integrity);
		if (options.params !== undefined) joinRoomUrl.searchParams.set("params", JSON.stringify(options.params));
		const ws = new WebSocket(joinRoomUrl);
		await new Promise<void>((resolve, reject) => {
			const abort = () => {
				reject(new Error(`aborted`));
				if (timeout != undefined) clearTimeout(timeout);
				ws.close(4000);
			}
			
			let timeout: undefined | ReturnType<typeof setTimeout>;
			if (options.timeout instanceof AbortSignal) {
				options.timeout.addEventListener("abort", abort);
			} else if (typeof options.timeout === "number") {
				timeout = setTimeout(abort, options.timeout);
			}
			
			const onClose = (e: CloseEvent) => reject(new Error(e.reason));
			const onMessage = () => {
				ws.removeEventListener("close", onClose);
				ws.removeEventListener("message", onMessage);
				if (timeout != undefined) clearTimeout(timeout);
				resolve(undefined);
			}
			
			ws.addEventListener("close", onClose);
			ws.addEventListener("message", onMessage);
		});
		
		return new VarhubClient(ws, this, roomId, name, options);
	}
}