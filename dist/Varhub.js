import { VarhubClient } from "./VarhubClient.js";
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
    async join(roomId, name, options) {
        const wsUrl = new URL(this.#baseUrl);
        wsUrl.protocol = this.#baseUrl.protocol.replace("http", "ws");
        const joinRoomUrl = new URL(`room/${encodeURIComponent(roomId)}/join`, wsUrl);
        joinRoomUrl.searchParams.set("name", name);
        if (options.password != null)
            joinRoomUrl.searchParams.set("password", options.password);
        if (options.integrity != null)
            joinRoomUrl.searchParams.set("integrity", options.integrity);
        if (options.params !== undefined)
            joinRoomUrl.searchParams.set("params", JSON.stringify(options.params));
        const ws = new WebSocket(joinRoomUrl);
        await new Promise((resolve, reject) => {
            const abort = () => {
                reject(new Error(`aborted`));
                if (timeout != undefined)
                    clearTimeout(timeout);
                ws.close(4000);
            };
            let timeout;
            if (options.timeout instanceof AbortSignal) {
                options.timeout.addEventListener("abort", abort);
            }
            else if (typeof options.timeout === "number") {
                timeout = setTimeout(abort, options.timeout);
            }
            const onClose = (e) => reject(new Error(e.reason));
            const onMessage = () => {
                ws.removeEventListener("close", onClose);
                ws.removeEventListener("message", onMessage);
                if (timeout != undefined)
                    clearTimeout(timeout);
                resolve(undefined);
            };
            ws.addEventListener("close", onClose);
            ws.addEventListener("message", onMessage);
        });
        return new VarhubClient(ws);
    }
}
