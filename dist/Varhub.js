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
        const [ws, getErrorLog] = this.#createWebsocketWithErrorLoader("room/ws", options);
        return new RoomSocketHandler(ws, getErrorLog);
    }
    async findRooms(integrity) {
        return this.#fetch("GET", `rooms/${encodeURIComponent(integrity)}`);
    }
    async getRoomMessage(roomId, integrity) {
        return this.#fetch("GET", `room/${encodeURIComponent(roomId)}`);
    }
    join(roomId, options = {}) {
        const [ws, getErrorLog] = this.#createWebsocketWithErrorLoader(`room/${encodeURIComponent(roomId)}`, options, ["params"]);
        return new VarhubClient(ws, getErrorLog);
    }
    createLogger(loggerId) {
        return this.#createWebsocketWithErrorLoader(`log/${encodeURIComponent(String(loggerId))}`)[0];
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
    #createWebsocketWithErrorLoader(path, options, stringifyKeys) {
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
        const errorId = Array(5).fill(0).map(() => Math.random().toString(36).substring(2)).join("");
        const getError = () => {
            return this.#fetch("GET", `/log/${encodeURIComponent(errorId)}`);
        };
        joinRoomUrl.searchParams.set("errorLog", errorId);
        const ws = new WebSocket(joinRoomUrl);
        ws.binaryType = "arraybuffer";
        return [ws, getError];
    }
}
//# sourceMappingURL=Varhub.js.map