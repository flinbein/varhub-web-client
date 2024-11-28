[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:room](../README.md) / ConnectionEvents

# Type Alias: ConnectionEvents\<DESC\>

> **ConnectionEvents**\<`DESC`\>: `object`

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`DESC` *extends* [`RoomDesc`](RoomDesc.md)

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
</tr>
<tr>
<td>

`message`

</td>
<td>

`DESC` *extends* `object` ? `R` : `any`[]

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
</tr>
</tbody>
</table>
