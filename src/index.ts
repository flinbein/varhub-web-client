/// <reference path="./modules.d.ts" />

/**
 * Client-side API
 * @example
 * ```typescript
 * import { Varhub, RPCChannel } from "@flinbein/varhub-web-client";
 *
 * // define URL of varhub server
 * const hub = new Varhub("https://example.com/varhub/");
 *
 * // create room with VM
 * const roomData = await hub.createRoom("ivm", {
 *     module: {
 *         main: "index.js",
 *         source: {
 *             // VM code here
 *             // language=JavaScript
 *             "index.js": `
 *                 export function sum(x, y) {return x + y}
 *             `
 *         }
 *     }
 * });
 *
 * // join room
 * const client = hub.join(roomData.id, {params: []});
 * await client;
 *
 * // create rpc channel to call remote methods
 * const rpc = new RPCChannel(client);
 * console.log(await rpc.sum(10, 20)) // 30
 * ```
 * @module Client API
 */

export { Varhub } from "./Varhub.js"
export { VarhubClient, type VarhubClientEvents } from "./VarhubClient.js"
export type { RoomSocketHandler, RoomSocketHandlerEvents, Connection, ConnectionEvents } from "./RoomSocketHandler.js"
export { RPCChannel, type RPCChannelEvents } from "./RPCChannel.js"
export {default as RPCSource, type RPCHandler} from "./RPCSource.js"
export { default as Players, type PlayersEvents, type Player, type PlayerEvents } from "./Players.js"
