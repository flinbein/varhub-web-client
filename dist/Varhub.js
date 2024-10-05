export class Varhub {
    #baseUrl;
    constructor(url) {
        this.#baseUrl = new URL(url);
    }
    get url() {
        return this.#baseUrl.href;
    }
    async createRoom(type, options) {
        return this.#fetch("POST", `room/${encodeURIComponent(type)}`, JSON.stringify(options));
    }
    createRoomSocket(options = {}) {
        return this.#createWebsocket("room/ws", options);
    }
    async findRooms(integrity) {
        return this.#fetch("GET", `rooms/${encodeURIComponent(integrity)}`);
    }
    async getRoomMessage(roomId, integrity) {
        return this.#fetch("GET", `room/${encodeURIComponent(roomId)}`);
    }
    join(roomId, options = {}) {
        return this.#createWebsocket(`room/${encodeURIComponent(roomId)}`, options);
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
    #createWebsocket(path, options = {}) {
        const wsUrl = new URL(this.#baseUrl);
        wsUrl.protocol = this.#baseUrl.protocol.replace("http", "ws");
        const joinRoomUrl = new URL(path, wsUrl);
        for (let [key, value] of Object.entries(options)) {
            joinRoomUrl.searchParams.set(key, value);
        }
        const ws = new WebSocket(joinRoomUrl);
        ws.binaryType = "arraybuffer";
        return ws;
    }
}
//# sourceMappingURL=Varhub.js.map