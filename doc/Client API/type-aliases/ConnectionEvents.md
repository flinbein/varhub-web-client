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

[src/RoomSocketHandler.ts:437](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RoomSocketHandler.ts#L437)

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

[src/RoomSocketHandler.ts:448](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RoomSocketHandler.ts#L448)

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

[src/RoomSocketHandler.ts:426](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RoomSocketHandler.ts#L426)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/RoomSocketHandler.ts:414](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RoomSocketHandler.ts#L414)
