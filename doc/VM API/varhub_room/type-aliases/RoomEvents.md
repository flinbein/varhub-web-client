[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:room](../README.md) / RoomEvents

# Type Alias: RoomEvents\<DESC\>

> **RoomEvents**\<`DESC`\>: `object`

Define all events dispatched by room controller

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`DESC` *extends* [`RoomDesc`](RoomDesc.md)

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`connection`

</td>
<td>

[[`Connection`](../interfaces/Connection.md)\<`DESC`\>, `DESC` *extends* `object` ? `T` : `any`[]]

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
</tr>
<tr>
<td>

`connectionClose`

</td>
<td>

[[`Connection`](../interfaces/Connection.md)\<`DESC`\>, `string` \| `null`, `boolean`]

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
</tr>
<tr>
<td>

`connectionMessage`

</td>
<td>

[[`Connection`](../interfaces/Connection.md)\<`DESC`\>, `DESC` *extends* `object` ? `T` : `any`[]]

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
</tr>
<tr>
<td>

`connectionOpen`

</td>
<td>

[[`Connection`](../interfaces/Connection.md)\<`DESC`\>]

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
</tr>
</tbody>
</table>
