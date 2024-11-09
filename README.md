| [API Documentation](doc/README.md) 
| [Codepen examples](https://codepen.io/collection/PoqYRg)
| [Rollup plugin](https://github.com/flinbein/rollup-plugin-varhub-bundle#readme)
|

---

# Install

```shell
npm install github:flinbein/varhub-web-client
```

---

# Create Varhub instance

```javascript
import { Varhub } from "@flinbein/varhub-web-client";

const hub = new Varhub("https://example.com/varhub/");
```

---

# Room

The room allows clients to connect. 
You can control the behavior of a room by handling events.

There are 3 ways to create a room:
- `qjs`: room controlled by quick-js code (javascript)
- `ivm`: room controlled by isolated-vm code (javascript)
- `ws`: room controlled by websocket

`qjs` and `ivm` rooms is controlled by virtual machine in server-side and will be destroyed after 120s of inactivity. Also rooms will be destroyed when resource consumption is high.


`ws` room is controlled by websocket in browser and will be destroyed when the websocket is closed.

---

## quick-js room (qjs)

qjs room uses [quickjs-ng](https://github.com/quickjs-ng/quickjs) engine to run your code.
You can send the source code that will control the behavior of the room.

quick-js room features:
- ECMAScript 2023 syntax
- use `import` function (in async mode)
- import remote modules by `http` (in async mode)
- WebAssembly is unavailable
- low performance ([30x lower](https://bellard.org/quickjs/bench.html), compared to V8 JIT)

resource limitations:
- memory: `100 MB` / room (by default)
- CPU time: `50%` / room (by default) 

Example:
```javascript
const { id, integrity, message } = await hub.createRoom("qjs", {
  module: {
    main: "index.js",
      source: {
        ["index.js"]: /* language=javascript */ `
          console.log('room created')
        `
      }
  }
})
```
`createRoom(vmType, options)`
- `vmType` - string `"qjs"`
- `options` - virtual machine configuration
  - `options.module` (required) - sources of controller
    - `options.module.main` (`string`) - entrypoint of controller (file name)
    - `options.module.source` (`Record<string, string>`) - source code of files. See [VM API](#vm-api)
  - `options.integrity?` - use integrity check for clients
    - (`true`) - calculate integrity and return as string
    - (`string`) - check integrity. You will get an error if strings do not match.
  - `options.config?` (`any`) - value of module `"vargub:config"`. It is ignored during integrity checking.
  - `options.message?` - create room with public message.
    - (`string`) - this room will be searchable for all clients (if integrity is defined)
    - (`null`) - room is hidden
  - `options.async?` (`boolean`) - use async mode of quick-js. `false` by default.
  - `options.logger?` (`string`) - add websocket logger by id to read console and room events

returns:
- object with properties
  - `id` (`string`) - room id
  - `integrity` (`string`|`null`) - calculated integrity (if it is defined in config)
  - `message` (`string`|`null`) - current public message of the room (it can be changed by room controller)

### create logger
```javascript
// generate logger id
const loggerId = Array(5).fill().map(() => Math.random().toString(36).substring(2)).join("")

const wsLogger = hub.createLogger(loggerId); // WebSocket
wsLogger.addEventListener("message", (event) => {
    console.log("room event:", event.data);
})
// now you can use loggerId to create room
```

---

## isolated-vm room (ivm)

uses [isolated-vm](https://github.com/laverdet/isolated-vm#readme) to run your code.

ivm room features:
- V8 engine
- no async `import` function
- import remote modules by `http`
- WebAssembly is available

resource limitations:
- memory: `64 MB` / room (by default)
- CPU time: `20%` / room (by default)

Example:
```javascript
const { id, integrity, message, inspect } = await hub.createRoom("ivm", {
  module: {
    main: "index.js",
    source: {
      ["index.js"]: /* language=javascript */ `
        console.log('room created')
      `
    }
  }
})
```
`createRoom(vmType, options)`
- `vmType` - string `"ivm"`
- `options` - virtual machine configuration
  - `options.module` (required) - sources of controller
    - `module.main` (`string`) - entrypoint of controller (file name)
    - `module.source` (`Record<string, string>`) - source code of files. See [VM API](#vm-api)
  - `options.integrity?` - use integrity check for clients
    - (`true`) - calculate integrity and return as string
    - (`string`) - check integrity. You will get an error if strings do not match.
  - `options.config?` (`any`) - value of module `"vargub:config"`. It is ignored during integrity checking.
  - `options.message?` - create room with public message.
    - (`string`) - this room will be searchable for all clients (if integrity is defined)
    - (`null`) - room is hidden
  - `options.inspect?` - using devtools (if it available in varhub server)
    - (`boolean`) - allow devtools (false by default)
    - (`string`) - allow devtools and prepend inspector 

returns:
- object with properties
  - `id` (`string`) - room id
  - `integrity` (`string`|`null`) - calculated integrity (if it is defined in config)
  - `message` (`string`|`null`) - current public message of the room (it can be changed by room controller)
  - `inspect` (`string`|`null`) - unique id to connect devtools

### prepend inspector

1. generate inspectorId string:
   ```javascript
   const inspectorId = Array(5).fill().map(() => Math.random().toString(36).substring(2)).join("")
   ```
2. generate devtools url
   ```javascript
   const wsUrl = hub.url.replace(/^\w*:\/\//, "") // remove prefix "https://"
   console.log(
     `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${wsUrl}/log/${inspectorId}`
   );
   ```
3. open devtools url in chrome   
4. create ivm room with `inspect: inspectorId`
5. done! You can start to use devtools tab.

### open inspector

```javascript
const { id, integrity, message, inspect } = await hub.createRoom("ivm", {
  module: {/*...*/},
  inspect: true // or inspectorId as string
});

const wsUrl = hub.url.replace(/^\w*:\/\//, "") // remove prefix "https://"
console.log(`devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${wsUrl}/room/${id}/inspect/${inspect}`)
```
**Warning!** `inspect` is experimental feature and must be disabled by default.

---

## websocket room (ws)

uses your websocket connection to control room.

ws room features:
- virtual machine is not in use
- you have full control over the room on the client side

limitations:
- no integrity check.

Example:
```javascript
const room = hub.createRoomSocket({
  message: "welcome-room",
  integrity: "custom:welcome-room"
});

// room logic
room.on("connectionOpen", (connection) => {
  connection.send("Welcome!");
})

await room; // wait for connection established
console.log("Room id:", room.id);

const client = hub.join(room.id, {integrity: "custom:welcome-room"});
client.on("message", (msg) => {
  console.log(msg) // Welcome!
});
await client;
```

`createRoomSocket(options)`
- `options`
  - `options.integrity` - integrity check is not performed, but you can specify a `integrity` to make the room searchable
    - (`string`) - must start with `custom:`
  - `options.message` - create room with public message.
    - (`string`) - this room will be searchable for all clients (if integrity is defined)
    - (`null`) - room is hidden, by default

returns: 
- [RoomSocketHandler](doc/Client%20API/classes/RoomSocketHandler.md)

## websocket room events

all ws room events is listed in [RoomSocketHandlerEvents](doc/Client%20API/type-aliases/RoomSocketHandlerEvents.md)

### init event

```javascript
const room = hub.createRoomSocket();
room.on("init", () => {
  console.log("room is ready", room.id);
})
```
You can call room methods `send`, `broadcast` only after the room has been initialized.

Also, you can wait for initialization in async code:
```javascript
const room = hub.createRoomSocket();
// ... add listeners
await room;
```

### error event
emits if room can not be created
```javascript
const room = hub.createRoomSocket();
room.on("error", async (asyncErrorReason) => {
  console.error("room can not be created because: ", await asyncErrorReason);
})
```
async node:
```javascript
const room = hub.createRoomSocket();
try {
  await room;
} catch (error) {
  console.error("room can not be created because: ", await error.cause);
}
```

### close event
emits when room is closed or afrer `error` event
```javascript
const room = hub.createRoomSocket();
room.on("close", () => {
  console.error("room closed");
})
```

### connection event
emits when client tries to connect.
The event handler accepts additional parameters that the client passed when connecting.
```javascript
room.on("connection", (connection, ...params) => {
  console.error("someone tries to connect with params:", params);
})
```
See also: [Connection](doc/Client%20API/classes/Connection.md)

You can close the connection before it is established:
```javascript
room.on("connection", (connection, ...params) => {
  if (params[0] !== "P@$$w0RD") connection.close("wrong password");
})
```
See also: [connection.close](doc/Client%20API/classes/Connection.md#close)

Or you can defer client and decide to connect later:
```javascript
room.on("connection", (connection, ...params) => {
  connection.defer(async () => {
    const passwordIsValid = await doAsyncCheckPassword(connection, params[0]);
    if (!passwordIsValid) connection.close();
  })
})
```
See also: [connection.defer](doc/Client%20API/classes/Connection.md#defer)

### connectionOpen event
emits when client's connection is open.
```javascript
room.on("connectionOpen", (connection) => {
  connection.send("Welcome!");
})
```

See also: [connection.defer](doc/Client%20API/classes/Connection.md#defer)

### connectionOpen event
emits when connection is closed.
```javascript
room.on("connectionClose", (connection, reason) => {
  console.log("connection is closed by reason:", reason);
})
```

### connectionMessage event
emits when a message is received from the connection.
```javascript
room.on("connectionMessage", (connection, ...msg) => {
  console.log("received:", msg);
  if (msg[0] === "ping") connection.send("pong");
});
```

---

# Find rooms

Room is searchable:
- if room integrity is defined
- if room's public message is not null

You can find all searchable rooms by method hub.[findRooms](doc/Client%20API/classes/Varhub.md#findrooms)

```javascript
const rooms = hub.findRooms(integrity)
```
`findRooms(integrity)`
- `integrity` - room integrity

**returns**
- `Record< string , string >` - map of found rooms, where key is room id, and value is public message of room

---

# Create client (join room)

```javascript
const client = hub.join(roomId, {
  integrity: roomIntegrity,
  params: [...clientParameters]  
});
client.on("message", (...args) => {
  console.log("Client received a message:", args);
});

await client;
client.send("Hello")
```
`join(roomId, options)`
- `roomId` (`string`) - room id
- `options?`
  - `options.integrity?` (`string`) - room integrity. It is required if room was created with `integrity` param.
  - `options.params?` (`Array`) - additional parameters to join room. 
  - `options.allowInspect?` (`boolean`) - allow to join room with attached inspector. `false` by default

returns
  - [VarhubClient](doc/Client%20API/classes/VarhubClient.md)

use client to send and receive messages from the room.
You can send messages to room only after connection is established

## Client events

All client events is listed in [RoomSocketHandlerEvents](doc/Client%20API/type-aliases/VarhubClientEvents.md): `open`, `error`, `message`, `close`

## Usage in async code

```javascript
const client = hub.join(roomId);
try {
  await client; // wait for `open` or `error` event
} catch (error) {
  console.error("Client connection failed: ", await error.cause)
}
```

# VM API


in the VM source code you can import special modules.
See [VM API Documentation](doc/VM%20API/README.md)

## varhub:room

```javascript
import room from "varhub:room";

room.on("connectionOpen", (connection) => {
  connection.send("Welcome!");
})
```
[Room](doc/VM%20API/namespaces/varhub_room/interfaces/Room.md) is similar 
to [RoomSocketHandler](doc/Client%20API/classes/RoomSocketHandler.md),
with the differences:
- no `init`, `close`, `error` events. 
- `room` is immediately initialized.
- `room.id` and `room.integrity` are not available
- when the room is destroyed, the virtual machine will be stopped

## varhub:config
```javascript
import config from "varhub:config";

console.log(config);
```
get `config` get the config that was used when creating the room

## varhub:events
```javascript
import EventEmitter from "varhub:events";

const events = new EventEmitter();
events.on("exampleEventName", console.log);
events.emit("exampleEventName", "hello", "world");
```
get class [EventEmitter](doc/VM%20API/namespaces/varhub_events/classes/default.md).

## varhub:performance
```javascript
import * as performance from "varhub:performance";

console.log(performance.now());
```
`performance.now` returns time in milliseconds since room initialized.
See [performance.now](doc/VM%20API/namespaces/varhub_performance/functions/now.md)

## varhub:api/network
Provides `fetch` functon.
```javascript
import network from "varhub:api/network";

const fetchResult = await network.fetch(
        "https://example.com/api/method",
        {method: "POST", type: "json"}
);
console.log(fetchResult.body);
```

## varhub:rpc
Provides class `RPCSource`.
```javascript
import RPCSource from "varhub:rpc";
```
See [RPC](#rpc).

## varhub:players
Provides class `Players`.
```javascript
import Players from "varhub:players";
```
See [Players](#players).

# Players

You can combine multiple connections into one player.
For example, if a player connects from a mobile device and from a PC at the same time.

ivm, qjs:
```javascript
import Players from "varhub:players"
```
ws:
```javascript
import { Players } from "@flinbein/varhub-web-client"
```
create new instance:
```javascript
const players = new Players(room, (connection, name) => name);
```
`new Players(room, registerPlayerHandler)`
- `room` ([Room](doc/VM%20API/namespaces/varhub_room/interfaces/Room.md) or [RoomSocketHandler](doc/Client%20API/classes/RoomSocketHandler.md))
- `registerPlayerHandler`: (`(connection, ...args) => ?`) function to get the player's name
  - `connection`: ([Connection](doc/Client%20API/classes/Connection.md))
  - `...args`: (`any[]`)
  - `return`:
    - (`null | undefined`) - do not register connection as player
    - (`string`) - register connection as player with this name
    - (`Promise <null|undefined>`) - when resolved: allow connection to join and do not register as player
    - (`Promise <string>`) - when resolved: allow connection to join and register as player
    - (`rejected promise`) - close connection when rejected
  - `throw` - close connection

**Create Players examples**
```javascript
// get player name as 1st argument of connection params
const players = new Players(room, (connection, name) => name);

// usage 
const bobClient1 = hub.join(roomId, {params: ["Bob"]}); // connect as player Bob
const bobClient2 = hub.join(roomId, {params: ["Bob"]}); // connect as player Bob
const aliceClient = hub.join(roomId, {params: ["Alice"]}); // connect as player Alice
```

```javascript
// async registration with name and password
const players = new Players(room, async (connection, name, password) => {
  if (!name) return; // allow connect for non-players
  
  // async check password for players
  const passwordIsCorrect = await checkPassword(name, password);
  if (passwordIsCorrect) return name;
  throw new Error("incorrect password");
});

// usage 
const bobClient1 = hub.join(roomId, {params: ["Bob", "12345"]}); // correct password, connection will be registered as player Bob
const bobClient2 = hub.join(roomId, {params: ["Bob", "54321"]}); // incorrect password, connection will be closed
const aliceClient = hub.join(roomId); // connection will be opened as not player
```
**Players usage examples**
```javascript
const players = new Players(room, (connection, name) => name);
 
// get all players
for (const player of players) {
  console.log(player.name)
  
  // get all connections of player and send message
  for (const connection of player) {
    connection.send("You are "+player.name);
  }
}
```
See also: 
- module ["varhub:players"](doc/VM%20API/namespaces/varhub_players)
- class [Players](doc/Client%20API/classes/Players.md), [PlayersEvents](doc/Client%20API/type-aliases/PlayersEvents.md)
- class [Player](doc/Client%20API/classes/Player.md), [PlayerEvents](doc/Client%20API/type-aliases/PlayerEvents.md)

# RPC

RPC allows clients to:
- call remote methods defined in VM or room handler
- receive custom events

The RPC protocol is built on top of the messaging between the client and the room.
You can see the [detailed description](src/rpc.md) of the messages

[More examples of using RPCSource](man/RPCSource.md)

## default RPC in VM

You can export methods or structures with methods from entrypoint:
```javascript
// VM code
export function ping(){
  // this = connection which call RPC
  console.log("ping for connection", this);
  return "pong";
}

export const math = {
  sum: (x, y) => x + y,
  mul: (x, y) => x * y
}
```
```javascript
// client code
import {Varhub, RPCChannel} from "@flinbein/varhub-web-client";

const hub = new Varhub("https://example.com/varhub");

const client = hub.join(roomId);
const rpc = new RPCChannel(client);
await rpc; // wait for connection open

// now rpc object has async versions of methods exported from VM entrypoint
console.log(await rpc.ping()) // "pong"
console.log(await rpc.math.sum(100, 200)) // 300
console.log(await rpc.math.mul(5, 20)) // 100
```
Reserved names, not recommended to use as method name:
- `state` - used to get current [state](#rpc-state) of RPC channel
- `on`,`once`,`off` - used to handle events
- `then` - used to make RPC channel PromiseLike
- `call` - used to call RPC method directly
- `create` - used to create new RPC channel
- `close` - used to close current RPC channel
- `ready`, `closed` - used to get status of RPC channel

## Custom RPC Source

with RoomSocketHandler:
```javascript
import { Varhub, RPCSource } from "@flinbein/varhub-web-client"

const hub = new Varhub("https://example.com/varhub/");
const room = hub.createRoomSocket();

const rpcBase = new RPCSource({
  ping(){
    // this = connection which call RPC
    console.log("ping for connection", this);
    return "pong";
  },
  math: {
    sum: (x, y) => x + y,
    mul: (x, y) => x * y
  }
});

// start listening RPC for room
RPCSource.start(rpcBase, room);
```
with VM code (in this case the entrypoint should not have any exports):
```javascript
import RPCSource from "varhub:rpc";
import room from "varhub:room";

const rpcBase = new RPCSource({
  ping(){
    // this = connection which call RPC
    console.log("ping for connection", this);
    return "pong";
  },
  math: {
    sum: (x, y) => x + y,
    mul: (x, y) => x * y
  }
});

// start listening RPC for room
RPCSource.start(rpcBase, room);
```
## RPC state
You can set the initial state for [RPCSource](doc/Client%20API/classes/RPCSource.md) instance.
The state will be synchronized with the [RPCChannel](doc/Client%20API/variables/RPCChannel.md) in client-side.
Also, you can change state of RPCSource at any time.
```javascript
// handler-side code
//////////////////////
import { Varhub, RPCSource, RPCChannel } from "@flinbein/varhub-web-client"

const hub = new Varhub("https://example.com/varhub/");
const room = hub.createRoomSocket();

const rpcBase = new RPCSource({
  addValueToState(value){
    rpcBase.setState(rpcBase.state + value);
  }
}, 100 /*initial state*/ );

// start listening RPC for room
RPCSource.start(rpcBase, room);
await room;

// client-side code
//////////////////////
const client = hub.join(room.id);
const rpc = new RPCChannel(client);
await rpc; // rpc.state will be available when rpc is initialized
console.log(rpc.state) // 100
await rpc.addValueToState(200);
console.log(rpc.state) // 300

// subscribe on state change:
rpc.on("state", (newState, oldState) => {
  console.log("state changed from", oldState, "to", newState);
})
```
State of RPCSource with entrypoint exports:
use `RPCSource.default` as instance of RPCSource.
```javascript
// VM entrypoint code
import RPCSource from "varhub:rpc";

export function addValueToState(value){
  RPCSource.default.setState(RPCSource.default.state + value);
}

RPCSource.default.setState(100); // set initial state
```

## RPC events

RPCSource can emit events to all connections subscribed to this source:
```javascript
// room handler side
const rpcBase = new RPCSource({});

RPCSource.start(rpcBase, room);

let tickNumber = 0;
setInterval(() => {
  rpcBase.emit("tick", tickNumber++)
}, 1000);
```
```javascript
// client side 
const rpc = new RPCSource(client);
rpc.on("tick", console.log) // 0, 1, 2, ...
```
reserved event names:
- `close` - emits when RPCSource or client is closed
- `init` - emits when RPCSource is ready
- `error` - emits if RPCSource can not be created
- `state` - emits on state change

do not use this names to send custom event.

RPCSource with entrypoint exports:
```javascript
import RPCSource from "varhub:rpc";

export function ping(){ return "pong" }

let tickNumber = 0;
setInterval(() => {
  RPCSource.default.emit("tick", tickNumber++);
}, 1000);
```
send event to specified connections only
```javascript
const players = new Players(room, (connection, name) => name);

players.on("join", player => {
    player.setGroup(Math.random() > 0.5 ? "red" : "blue");
})

RPCSource.default.emit("message", "Hello all!");
RPCSource.default.emitFor(players.getGroup("red"), "message", "Hello red team!");
RPCSource.default.emitFor(players.getGroup("blue"), "message", "Hello blue team!");
```
`RPCSource#emitFor(connections, event, ...args)`

- `connections`
  - (`[]`) - empty array, do not send message
  - (`null | undefined`) - send event to all connections
  - (`Connection`) - send event to specified connection (if it is subscribed)
  - (`(con: Connection) => boolean`) - filter connections by predicate
  - (`Iterable<Connection>` or `Player` instance) - send event to specified connections
  - (`Iterable<Iterable<Connection>>` or `Players` instance)
  - ...etc
- `event` (`string`) event name
- `args` (`any[]`) event data


## Use RPC with TypeScript
```typescript
// roomHandler.js
export const rpcBase = new RPCSource({
  ping(){
    return "pong"
  }
}, 100 ).withEventTypes<{tick: [number]}>();
let tickNumber = 0;
setInterval(() => {
  rpcBase.emit("tick", tickNumber++);
}, 1000);
RPCSource.start(rpcBase, room);
```
```typescript
// client.js

// need to import rpcBase as type from room handler side code
import type { rpcBase } from "./roomHandler.js";
// ...
const client = hub.join(roomId);
const rpc = new RPCChannel<typeof rpcBase>(client);

// now rpc is well-typed object
await rpc.ping(); // correct function types
rpc.on("tick", (tick /* number */) => {
  // correct event types
})
```