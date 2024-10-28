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
  con.open();
  console.log("someone connected with params", params);
  con.send("Welcome!");
})
```

</td>
<td>

[src/modules.d.ts:202](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L202)

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

[src/modules.d.ts:222](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L222)

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

[src/modules.d.ts:232](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L232)

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

[src/modules.d.ts:212](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L212)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:190](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L190)
