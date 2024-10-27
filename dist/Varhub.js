import { VarhubClient } from "./VarhubClient.js";
import { RoomSocketHandler } from "./RoomSocketHandler.js";
export class Varhub {
    #baseUrl;
    constructor(url) {
        this.#baseUrl = url instanceof URL ? url : new URL(url);
    }
    get url() {
        return this.#baseUrl.href;
    }
    async createRoom(type, options) {
        return this.#fetch("POST", `room/${encodeURIComponent(type)}`, JSON.stringify(options));
    }
    createRoomSocket(options = {}) {
        const ws = this.#createWebsocket("room/ws", options);
        return new RoomSocketHandler(ws);
    }
    async findRooms(integrity) {
        return this.#fetch("GET", `rooms/${encodeURIComponent(integrity)}`);
    }
    async getRoomMessage(roomId, integrity) {
        return this.#fetch("GET", `room/${encodeURIComponent(roomId)}`);
    }
    join(roomId, options = {}) {
        const ws = this.#createWebsocket(`room/${encodeURIComponent(roomId)}`, options, ["params"]);
        return new VarhubClient(ws);
    }
    createLogger(loggerId) {
        return this.#createWebsocket(`log/${encodeURIComponent(String(loggerId))}`);
    }
    async #fetch(method, path, body) {
        const getRoomsUrl = new URL(path, this.#baseUrl);
        const response = await fetch(getRoomsUrl, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    }
    #createWebsocket(path, options, stringifyKeys) {
        const wsUrl = new URL(this.#baseUrl);
        wsUrl.protocol = this.#baseUrl.protocol.replace("http", "ws");
        const joinRoomUrl = new URL(path, wsUrl);
        if (options)
            for (let [key, value] of Object.entries(options)) {
                if (value === undefined)
                    continue;
                if (stringifyKeys?.includes(key))
                    value = JSON.stringify(value);
                joinRoomUrl.searchParams.set(key, value);
            }
        const ws = new WebSocket(joinRoomUrl);
        ws.binaryType = "arraybuffer";
        return ws;
    }
}
//# sourceMappingURL=Varhub.js.map