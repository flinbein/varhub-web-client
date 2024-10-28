//@ts-nocheck
import { parse, serialize, XJData } from "@flinbein/xjmapper";

type TypedArray =
	| Int8Array /*07*/ | Int16Array /*08*/ | Int32Array /*09*/
	| Uint8Array  /*0a*/ | Uint16Array  /*0b*/ | Uint32Array  /*0c*/ | Uint8ClampedArray  /*0d*/
	| Float32Array  /*0e*/ | Float64Array  /*0f*/ | BigInt64Array  /*10*/ | BigUint64Array  /*11*/
;

export class MockEvent extends Event {
	constructor(type: string, fields: Record<string, any> = {}) {
		super(type);
		for (let fieldsKey in fields) {
			(this as any)[fieldsKey] = fields[fieldsKey];
		}
	}
}

export class WebsocketMock extends (EventTarget as typeof WebSocket) implements WebSocket {
	binaryType: "blob"| "arraybuffer" = "blob";
	readyState: number = WebSocket.CONNECTING;
	url: string = "/mock/url"
	backend: WebsocketBackendMock;
	
	constructor(open?: boolean) {
		super();
		this.backend = new WebsocketBackendMock(this, open ?? false);
		if (open) this.readyState = WebSocket.OPEN;
		this.addEventListener("close", (event: any) => {
			if (this.readyState === WebSocket.CONNECTING) {
				this.dispatchEvent(new MockEvent("error", {}))
			}
			this.readyState = WebSocket.CLOSED;
		})
	}
	
	close(code?: number, reason?: string){
		if (this.readyState === WebSocket.CLOSING ||this.readyState === WebSocket.CLOSED) return;
		this.readyState = WebSocket.CLOSING;
		setTimeout(() => {
			const close = new MockEvent("close", {code, reason});
			this.readyState = WebSocket.CLOSED;
			this.backend.dispatchEvent(close);
			this.dispatchEvent(close);
		}, 10);
	}
	
	send(message: Uint8Array) {
		if(this.readyState === WebSocket.CONNECTING) throw new Error("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.");
		if(this.readyState !== WebSocket.OPEN) {
			console.error("WebSocket is already in CLOSING or CLOSED state.")
			return;
		}
		convertMessageToData(message, this.backend.binaryType).then((data) => {
			setTimeout(() => {
				this.backend.dispatchEvent(new MockEvent("message", {data}));
			}, 10);
		});
	}
	
	readonly CLOSED = 3;
	readonly CLOSING = 2;
	readonly CONNECTING = 0;
	readonly OPEN = 1;
	readonly bufferedAmount: number = 0;
	readonly extensions: string = "";
	onclose = null;
	onerror = null;
	onmessage = null;
	onopen = null;
	readonly protocol = "";
}

class WebsocketBackendMock extends (EventTarget as typeof WebSocket) implements WebSocket {
	binaryType: "blob"| "arraybuffer" = "arraybuffer"
	readyState: number = WebSocket.CONNECTING;
	url: string = "/mock/url"
	
	constructor(private client: WebsocketMock, open: boolean) {
		super();
		if (open) this.readyState = WebSocket.OPEN;
		this.addEventListener("close", (event) => {
			if (this.readyState === WebSocket.CONNECTING) {
				this.dispatchEvent(new MockEvent("error", {}));
			}
			this.readyState = WebSocket.CLOSED;
		})
	}
	
	open(){
		if (this.readyState !== WebSocket.CONNECTING) return;
		this.client.readyState = WebSocket.OPEN;
		this.readyState = WebSocket.OPEN;
		const openEvent = new MockEvent("open");
		this.client.dispatchEvent(openEvent);
		this.dispatchEvent(openEvent);
	}
	
	close(code?: number, reason?: string){
		if (this.readyState === WebSocket.CLOSING ||this.readyState === WebSocket.CLOSED) return;
		this.readyState = WebSocket.CLOSING;
		setTimeout(() => {
			const closeEvent = new MockEvent("close", {code, reason});
			this.readyState = WebSocket.CLOSED;
			this.dispatchEvent(closeEvent);
			this.client.dispatchEvent(closeEvent);
		}, 10);
	}
	
	send(message: ArrayBuffer | Blob | string | TypedArray){
		if(this.readyState === WebSocket.CONNECTING) throw new Error("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.");
		if(this.readyState !== WebSocket.OPEN) {
			console.error("WebSocket is already in CLOSING or CLOSED state.");
			return;
		}
		convertMessageToData(message, this.client.binaryType).then((data) => {
			setTimeout(() => {
				this.client.dispatchEvent(new MockEvent("message", {data}));
			}, 10);
		});
	}
	
	sendData(...args: XJData[]){
		this.send(serialize(...args));
	}
	
	readonly CLOSED = 3;
	readonly CLOSING = 2;
	readonly CONNECTING = 0;
	readonly OPEN = 1;
	readonly bufferedAmount: number = 0;
	readonly extensions: string = "";
	onclose = null;
	onerror = null;
	onmessage = null;
	onopen = null;
	readonly protocol = "";
}

export class WebsocketMockRoom extends WebsocketMock {
	#lastClientId = 0;
	#lobbyClientMap = new Map<number, WebsocketMock>;
	#onlineClientMap = new Map<number, WebsocketMock>;
	#publicMessage: string|null = null;
	
	#serverMethods = {
		join: (...args: number[]) => {
			for (let clientId of args) {
				const client = this.#lobbyClientMap.get(clientId);
				if (!client) continue;
				this.#lobbyClientMap.delete(clientId);
				this.#onlineClientMap.set(clientId, client);
				client.backend.open();
				this.#roomSend("connectionJoin", clientId);
			}
		},
		kick: (connectionIdList: number|number[], message: string) => {
			if (typeof connectionIdList === "number") connectionIdList = [connectionIdList];
			for (let clientId of connectionIdList) {
				const client = this.#lobbyClientMap.get(clientId) ?? this.#onlineClientMap.get(clientId);
				if (!client) continue;
				this.#lobbyClientMap.delete(clientId);
				const clientOnline = this.#onlineClientMap.delete(clientId);
				client.backend.close(4000, message);
				this.#roomSend("connectionClosed", clientId, clientOnline, message);
			}
		},
		publicMessage: (msg: string) => {
			if (this.#publicMessage === msg) return;
			const old = this.#publicMessage;
			this.#publicMessage = msg;
			this.#roomSend("publicMessage", msg, old);
		},
		destroy: () => {
			this.backend.close(4000, "room destroyed");
			for (let ws of this.#lobbyClientMap.values()) {
				ws.backend.close(4000, "room destroyed")
			}
			for (let ws of this.#onlineClientMap.values()) {
				ws.backend.close(4000, "room destroyed")
			}
			this.#lobbyClientMap.clear();
			this.#onlineClientMap.clear();
		},
		send: (idList: number|number[], ...sendArgs: XJData[]) => {
			if (!Array.isArray(idList)) idList = [idList];
			const binData = serialize(...sendArgs);
			for (let conId of idList) {
				this.#onlineClientMap.get(conId)?.backend.send(binData);
			}
		},
		broadcast: (...sendArgs: XJData[]) => {
			const binData = serialize(...sendArgs);
			for (let ws of this.#onlineClientMap.values()) {
				ws.backend.send(binData);
			}
		}
	} as const;
	
	#roomSend(...args: XJData[]) {
		this.backend.send(serialize(...args));
	}
	
	constructor(roomId: string, roomPublicMessage?: string, roomIntegrity?: string) {
		super(false);
		this.backend.addEventListener("open", () => {
			this.backend.send(serialize("init", roomId, roomPublicMessage, roomIntegrity));
		});
		
		this.backend.addEventListener("message", async ({data}: any) => {
			const [cmd, ...args] = parse(data);
			if (typeof cmd === "string" && cmd in this.#serverMethods) (this.#serverMethods as any)[cmd](...args)
		})
	}
	
	createClientMock(...args: XJData[]): WebsocketMock & {mockId: number} {
		const clientId = this.#lastClientId++;
		const clientMock = new WebsocketMock();
		clientMock.binaryType = "arraybuffer";
		(clientMock as any).mockId = clientId;
		this.#lobbyClientMap.set(clientId, clientMock);
		clientMock.addEventListener("close", ({reason}: any) => {
			const clientInLobby = this.#lobbyClientMap.delete(clientId);
			const clientOnline = this.#onlineClientMap.delete(clientId);
			if (clientInLobby || clientOnline) {
				this.#roomSend("connectionClosed", clientId, clientOnline, reason);
			}
		})
		clientMock.backend.addEventListener("message", async ({data}: any) => {
			if (!this.#onlineClientMap.has(clientId)) return;
			this.#roomSend("connectionMessage", clientId, ...parse(data));
		})
		this.#roomSend("connectionEnter", clientId, ...args);
		(clientMock as any)["mockId"] = clientId;
		return clientMock as any;
	};
}

export class WebsocketMockClientWithMethods<T extends Record<string, any>> extends WebsocketMock {
	constructor(public readonly methods: T, open?: boolean) {
		super(open);
		this.backend.addEventListener("message", async ({data}: any) => {
			const [/*"$rpc"*/, channelId, callCode, currentCallId, path = undefined, params = undefined] = parse(data);
			if (path === undefined) {
				const data = serialize("$rpc", channelId, 2, "defaultState");
				this.backend.send(data);
			}
			try {
				let target:any = methods;
				for (const step of path as any[]) target = target[step];
				const result = await target(...params as any[]);
				const data = serialize("$rpc", channelId, 0, currentCallId, result);
				this.backend.send(data);
			} catch (error: any) {
				const data = serialize("$rpc", channelId, 3, currentCallId, error);
				this.backend.send(data);
			}
		})
	}
}


async function convertMessageToData(message: ArrayBuffer | Blob | string | TypedArray, binaryType: "blob"| "arraybuffer" = "blob"): Promise<string | ArrayBuffer | Blob>{
	if (typeof message === "string") return message;
	let data: ArrayBuffer;
	if (message instanceof ArrayBuffer) data = message;
	else if (message instanceof Blob) data = await message.arrayBuffer();
	else if (message?.buffer) data = message.buffer.slice(message.byteOffset, message.byteLength);
	else throw new Error("send data of unknown type");
	if (binaryType === "blob") return new Blob([data]);
	return data;
}