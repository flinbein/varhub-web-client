import { VarhubClient } from "./VarhubClient.js";
import { VarhubLogger } from "./VarhubLogger.js";
export class Varhub {
    #baseUrl;
    constructor(url) {
        this.#baseUrl = new URL(url);
    }
    get url() {
        return this.#baseUrl.href;
    }
    async createRoom(module, options = {}) {
        const createRoomUrl = new URL("room", this.#baseUrl);
        const response = await fetch(createRoomUrl, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module, ...options })
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    }
    async findRooms(integrity) {
        const getRoomsUrl = new URL(`rooms/${encodeURIComponent(integrity)}`, this.#baseUrl);
        const response = await fetch(getRoomsUrl, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    }
    async getRoomMessage(roomId, integrity) {
        const getRoomMessageUrl = new URL(`room/${encodeURIComponent(roomId)}`, this.#baseUrl);
        if (integrity)
            getRoomMessageUrl.searchParams.set("integrity", integrity);
        const response = await fetch(getRoomMessageUrl, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    }
    async join(roomId, name, options) {
        const client = this.createClient(roomId, name, options);
        return new Promise((resolve, reject) => {
            client.once("ready", () => resolve(client));
            client.once("error", reject);
        });
    }
    createClient(roomId, name, options) {
        const ws = this.#createWebsocketForConnection(roomId, name, options);
        return new VarhubClient(ws, this, roomId, name, options);
    }
    async createLogger() {
        const wsUrl = new URL(this.#baseUrl);
        wsUrl.protocol = this.#baseUrl.protocol.replace("http", "ws");
        const loggerUrl = new URL(`log`, wsUrl);
        const ws = new WebSocket(loggerUrl);
        ws.binaryType = "arraybuffer";
        return new Promise((resolve, reject) => {
            ws.addEventListener("close", () => reject(new Error("ws closed")));
            ws.addEventListener("message", (event) => {
                resolve(new VarhubLogger(ws, this, String(event.data)));
            }, { once: true });
        });
    }
    #createWebsocketForConnection(roomId, name, options) {
        const wsUrl = new URL(this.#baseUrl);
        wsUrl.protocol = this.#baseUrl.protocol.replace("http", "ws");
        const joinRoomUrl = new URL(`room/${encodeURIComponent(roomId)}/join`, wsUrl);
        if (name === false) {
            joinRoomUrl.searchParams.set("raw", "true");
            if (options.integrity != null)
                joinRoomUrl.searchParams.set("integrity", options.integrity);
            if (options.params !== undefined)
                joinRoomUrl.searchParams.set("params", JSON.stringify(options.params));
        }
        else {
            joinRoomUrl.searchParams.set("name", name);
            if (options.password != null)
                joinRoomUrl.searchParams.set("password", options.password);
            if (options.integrity != null)
                joinRoomUrl.searchParams.set("integrity", options.integrity);
            if (options.params !== undefined)
                joinRoomUrl.searchParams.set("params", JSON.stringify(options.params));
        }
        return new WebSocket(joinRoomUrl);
    }
}
