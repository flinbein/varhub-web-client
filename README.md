## Install

```shell
npm install github:flinbein/varhub-web-client
```

## [API Documentation](doc/README.md)

## [Codepen examples](https://codepen.io/collection/PoqYRg)

---

Example:
```javascript
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

Example: using raw client

```javascript
// VM CODE
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
```javascript
// CLIENT CODE
const client = hub.join(roomId, {params: ["Bob"]});
client.on("messaage", (...data) => {
    console.log(...data)
})

await client;
// "user joined", "Bob"
// "welcome!"


client.send("Hello from Bob!");
// "user said", "Bob", "Hello from Bob!"
```

Example: using RPC channel
```javascript
// VM CODE
import room from "varhub:room";
import RPCSource from "varhub:rpc";

let data = "initialData";
export const getData = () => data;
export const setData = (newData) => {
    data = newData;
    RPCSource.current.emit("dataChanged", data);
};
```
```javascript
// CLIENT CODE
const client = hub.join(roomId);
const [rpc] = await new RPCChannel(client);

console.log(await rpc.getData()); // "initialData"
rpc.on("dataChanged", (newData) => {
    console.log("data changed", newData);
});

await rpc.setData("userData");
// "data changed", "userData"

console.log(await rpc.getData()); // "userData"
```