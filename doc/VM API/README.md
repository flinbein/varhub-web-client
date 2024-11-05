[**@flinbein/varhub-web-clent**](../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../README.md) / VM API

# VM API

API for Varhub VM

## Example

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

## Index

### Namespaces

<table>
<thead>
<tr>
<th>Namespace</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

["varhub:api/network"](namespaces/varhub_api_network/README.md)

</td>
<td>

network module

**Example**

```javascript
import network from "varhub:api/network";
const response = await network.fetch("https://example.com");
console.log(response.body);
```

</td>
</tr>
<tr>
<td>

["varhub:config"](namespaces/varhub_config/README.md)

</td>
<td>

source of room config

**Example**

```javascript
import config from "varhub:config";
console.log("Room config", config);
```

</td>
</tr>
<tr>
<td>

["varhub:events"](namespaces/varhub_events/README.md)

</td>
<td>

provides class [EventEmitter](namespaces/varhub_events/classes/default.md)

</td>
</tr>
<tr>
<td>

["varhub:performance"](namespaces/varhub_performance/README.md)

</td>
<td>

`performance.now()`

**Examples**

```javascript
import * as performance from "varhub:performance";
console.log(performance.now());
```

```javascript
import {now} from "varhub:performance";
console.log(now());
```

</td>
</tr>
<tr>
<td>

["varhub:players"](namespaces/varhub_players/README.md)

</td>
<td>

provides class [Players](namespaces/varhub_players/classes/default.md) to combine connections by name

</td>
</tr>
<tr>
<td>

["varhub:room"](namespaces/varhub_room/README.md)

</td>
<td>

This module allows you to get a controller of current [Room](namespaces/varhub_room/interfaces/Room.md).

**Example**

```javascript
import room from "varhub:room"
// room is a singleton object
```

</td>
</tr>
<tr>
<td>

["varhub:rpc"](namespaces/varhub_rpc/README.md)

</td>
<td>

provides class [RPCSource](namespaces/varhub_rpc/classes/default.md) that allows you to handle remote procedure calls

**Example**

```javascript
import room from "varhub:room";
import RPCSource from "varhub:rpc";

const mathSource = new RPCSource({
  sum: (x, y) => x + y,
  mul: (x, y) => x * y,
})
RPCSource.start(mathSource, room);
```

</td>
</tr>
</tbody>
</table>
