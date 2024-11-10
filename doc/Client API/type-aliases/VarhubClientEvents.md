[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / VarhubClientEvents

# Type Alias: VarhubClientEvents

> **VarhubClientEvents**: `object`

Events of [VarhubClient](../classes/VarhubClient.md)

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

client's connection closed

**Example**

```typescript
client.on("close", (reason: string|null, wasOnline: boolean) => {
  console.log("client closed by reason:", reason);
  console.assert(client.closed);
})
```

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

client connection was closed while trying to connect

**Example**

```typescript
client.on("error", (asyncError) => {
  console.log("client can not be connected because:", await asyncError );
  console.assert(client.closed);
})
```

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

client received a message from the room

**Example**

```typescript
client.on("message", (...data: XJData[]) => {
  console.log("client received:", data);
  console.assert(client.ready);
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

client's connection successfully opened

**Example**

```typescript
client.on("open", () => {
  console.log("client ready now!");
  console.assert(client.ready);
})
```

</td>
</tr>
</tbody>
</table>
