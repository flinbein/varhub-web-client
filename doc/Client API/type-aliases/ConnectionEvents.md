[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / ConnectionEvents

# Type Alias: ConnectionEvents

> **ConnectionEvents**: `object`

Events of [Connection](../classes/Connection.md)

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

[`string` \| `null`, `boolean`]

</td>
<td>

connection closed

**Example**

```typescript
connection.on("close", (reason: string|null, wasOpen: boolean) => {
  console.log("connection closed by reason:", reason);
  console.assert(connection.closed);
})
```

</td>
<td>

[src/RoomSocketHandler.ts:373](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RoomSocketHandler.ts#L373)

</td>
</tr>
<tr>
<td>

`message`

</td>
<td>

`XJData`[]

</td>
<td>

received message from connection

**Example**

```typescript
connection.on("message", (...data) => {
  console.log("received from connection:", data);
  console.assert(connection.ready);
})
```

</td>
<td>

[src/RoomSocketHandler.ts:384](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RoomSocketHandler.ts#L384)

</td>
</tr>
<tr>
<td>

`open`

</td>
<td>

[]

</td>
<td>

connection successfully opened

**Example**

```typescript
connection.on("open", () => {
  console.log("connection opened!");
  console.assert(connection.ready);
});
connection.open();
```

</td>
<td>

[src/RoomSocketHandler.ts:362](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RoomSocketHandler.ts#L362)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/RoomSocketHandler.ts:350](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RoomSocketHandler.ts#L350)
