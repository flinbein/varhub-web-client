[**@flinbein/varhub-web-clent**](../README.md)

***

[@flinbein/varhub-web-clent](../README.md) / Client API

# Client API

Client-side API

## Example

```typescript
import { Varhub, RPCChannel } from "@flinbein/varhub-web-client";

// define URL of varhub server
const hub = new Varhub("https://example.com/varhub/");

// create room with VM
const roomData = await hub.createRoom("ivm", {
    module: {
        main: "index.js",
        source: {
            // VM code here
            // language=JavaScript
            "index.js": `
                export function sum(x, y) {return x + y}
            `
        }
    }
});

// join room
const client = hub.join(roomData.id, {params: []});
await client;

// create rpc channel to call remote methods
const rpc = new RPCChannel(client);
console.log(await rpc.sum(10, 20)) // 30
```

## Index

### Classes

<table>
<thead>
<tr>
<th>Class, Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[Connection](classes/Connection.md)

</td>
<td>

Handler of room connection

</td>
</tr>
<tr>
<td>

[Player](classes/Player.md)

</td>
<td>

Player represents a list of [Connection](classes/Connection.md)s with same name.

</td>
</tr>
<tr>
<td>

[Players](classes/Players.md)

</td>
<td>

List of players based on named connections.

</td>
</tr>
<tr>
<td>

[RoomSocketHandler](classes/RoomSocketHandler.md)

</td>
<td>

Client-side room handler.
It allows you to handle room events and send messages to connected clients.

**Example**

```typescript
import {Varhub} from "@flinbein/varhub-web-client";

const hub = new Varhub("https://example.com/varhub/");
const room: RoomSocketHandler = hub.createRoomSocket();
await room.promise;
console.log(room.id);
```

</td>
</tr>
<tr>
<td>

[RPCSource](classes/RPCSource.md)

</td>
<td>

Remote procedure call handler

</td>
</tr>
<tr>
<td>

[Varhub](classes/Varhub.md)

</td>
<td>

Varhub instance to manage rooms, create clients

</td>
</tr>
<tr>
<td>

[VarhubClient](classes/VarhubClient.md)

</td>
<td>

Represents a user-controlled connection to the room;

**Example**

```typescript
import { Varhub } from "@flinbein/varhub-web-client";

const hub = new Varhub("https://example.com");
const client: VarhubClient = hub.join(roomId);
await client;
client.send("some message");
```

</td>
</tr>
<tr>
<td>

[RPCChannel](variables/RPCChannel.md)

</td>
<td>

Constructor for new RPC channel based on [VarhubClient](classes/VarhubClient.md)

</td>
</tr>
</tbody>
</table>

### Type Aliases

<table>
<thead>
<tr>
<th>Type alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[RPCChannel](type-aliases/RPCChannel.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[RPCHandler](type-aliases/RPCHandler.md)

</td>
<td>

remote call handler for [RPCSource](classes/RPCSource.md)

</td>
</tr>
</tbody>
</table>

### Events

<table>
<thead>
<tr>
<th>Type alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[ConnectionEvents](type-aliases/ConnectionEvents.md)

</td>
<td>

Events of [Connection](classes/Connection.md)

</td>
</tr>
<tr>
<td>

[PlayerEvents](type-aliases/PlayerEvents.md)

</td>
<td>

Events of [Player](classes/Player.md)

</td>
</tr>
<tr>
<td>

[PlayersEvents](type-aliases/PlayersEvents.md)

</td>
<td>

events of [Players](classes/Players.md) object

</td>
</tr>
<tr>
<td>

[RoomSocketHandlerEvents](type-aliases/RoomSocketHandlerEvents.md)

</td>
<td>

[RoomSocketHandler](classes/RoomSocketHandler.md) events

</td>
</tr>
<tr>
<td>

[RPCChannelEvents](type-aliases/RPCChannelEvents.md)

</td>
<td>

Basic events of [RPCChannel](variables/RPCChannel.md)

</td>
</tr>
<tr>
<td>

[VarhubClientEvents](type-aliases/VarhubClientEvents.md)

</td>
<td>

Events of [VarhubClient](classes/VarhubClient.md)

</td>
</tr>
</tbody>
</table>
