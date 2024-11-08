[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:room"](../README.md) / RoomEvents

# Type Alias: RoomEvents

> **RoomEvents**: `object`

Define all events dispatched by room controller

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`connection`

</td>
<td>

[[`Connection`](../interfaces/Connection.md), `any`[]]

</td>
<td>

new connection initialized

**Example**

```ts
room.on("connection", (con, ...params) => {
  con.open(); // need to open before call con.send()
  console.log("someone connected with params", params);
  con.send("Welcome!");
})
```
After the event is processed, the connection will be automatically opened (if [Connection#close](../interfaces/Connection.md#close) or [Connection#defer](../interfaces/Connection.md#defer) was not called).

</td>
<td>

[src/modules.d.ts:203](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L203)

</td>
</tr>
<tr>
<td>

`connectionClose`

</td>
<td>

[[`Connection`](../interfaces/Connection.md), `string` \| `null`, `boolean`]

</td>
<td>

connection closed

**Example**

```ts
room.on("connectionClose", (con, reason, wasOpen) => {
  console.log("connection closed by reason:", reason);
})
```

</td>
<td>

[src/modules.d.ts:223](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L223)

</td>
</tr>
<tr>
<td>

`connectionMessage`

</td>
<td>

[[`Connection`](../interfaces/Connection.md), `any`[]]

</td>
<td>

received a message from connection

**Example**

```ts
room.on("connectionMessage", (con, ...data) => {
  console.log("got message:", data);
})
```

</td>
<td>

[src/modules.d.ts:233](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L233)

</td>
</tr>
<tr>
<td>

`connectionOpen`

</td>
<td>

[[`Connection`](../interfaces/Connection.md)]

</td>
<td>

connection successfully opened

**Example**

```ts
room.on("connectionOpen", (con) => {
  con.send("Welcome!");
})
```

</td>
<td>

[src/modules.d.ts:213](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L213)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:190](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L190)
