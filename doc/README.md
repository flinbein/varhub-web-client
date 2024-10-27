**@flinbein/varhub-web-clent** • **Docs**

***

# @flinbein/varhub-web-clent

## Modules

<table>
<thead>
<tr>
<th>Module</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[Client API](Client%20API/README.md)

</td>
<td>

Client-side API

**Example**

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

</td>
</tr>
<tr>
<td>

[VM API](VM%20API/README.md)

</td>
<td>

API for Varhub VM

**Example**

```typescript
import room from "varhub:room";

room.on("connectionOpen", (con) => {
    room.broadcast("user joined", com.parameters[0]);
    con.send("welcome!");
})

room.on("connectionClose", (con) => {
    room.broadcast("user left", com.parameters[0]);
})

room.on("connectionMessage", (con, ...args) => {
    room.broadcast("user said", com.parameters[0], ...args);
})
```

</td>
</tr>
</tbody>
</table>
