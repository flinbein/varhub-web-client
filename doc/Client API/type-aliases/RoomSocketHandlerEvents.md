[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RoomSocketHandlerEvents

# Type Alias: RoomSocketHandlerEvents

> **RoomSocketHandlerEvents**: `object`

[RoomSocketHandler](../classes/RoomSocketHandler.md) events

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

`close`

</td>
<td>

[]

</td>
<td>

&hyphen;

</td>
<td>

[src/RoomSocketHandler.ts:81](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L81)

</td>
</tr>
<tr>
<td>

`connection`

</td>
<td>

[[`Connection`](../classes/Connection.md), `XJData`[]]

</td>
<td>

new connection initialized

**Example**

```ts
room.on("connection", (connection, ...params) => {
  connection.open(); // need to open before call con.send()
  console.log("someone connected with params", params);
  connection.send("Welcome!");
})
```
After the event is processed, the connection will be automatically opened (if [Connection#close](../classes/Connection.md#close) or [Connection#defer](../classes/Connection.md#defer) was not called).

</td>
<td>

[src/RoomSocketHandler.ts:38](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L38)

</td>
</tr>
<tr>
<td>

`connectionClose`

</td>
<td>

[[`Connection`](../classes/Connection.md), `string` \| `null`, `boolean`]

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

[src/RoomSocketHandler.ts:58](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L58)

</td>
</tr>
<tr>
<td>

`connectionMessage`

</td>
<td>

[[`Connection`](../classes/Connection.md), `XJData`[]]

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

[src/RoomSocketHandler.ts:68](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L68)

</td>
</tr>
<tr>
<td>

`connectionOpen`

</td>
<td>

[[`Connection`](../classes/Connection.md)]

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

[src/RoomSocketHandler.ts:48](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L48)

</td>
</tr>
<tr>
<td>

`error`

</td>
<td>

[`Promise`\<`any`\>]

</td>
<td>

error creating room

**Example**

```typescript
client.on("error", (asyncError) => {
  console.log("room can not be created because:", await asyncError );
  console.assert(room.closed);
})
```

</td>
<td>

[src/RoomSocketHandler.ts:79](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L79)

</td>
</tr>
<tr>
<td>

`init`

</td>
<td>

[]

</td>
<td>

&hyphen;

</td>
<td>

[src/RoomSocketHandler.ts:80](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L80)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/RoomSocketHandler.ts:25](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/RoomSocketHandler.ts#L25)
