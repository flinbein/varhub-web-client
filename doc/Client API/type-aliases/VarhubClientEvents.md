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

client's connection closed

**Example**

```typescript
client.on("close", (reason: string|null, wasOnline: boolean) => {
  console.log("client closed by reason:", reason);
  console.assert(client.closed);
})
```

</td>
<td>

[src/VarhubClient.ts:30](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/VarhubClient.ts#L30)

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
<td>

[src/VarhubClient.ts:52](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/VarhubClient.ts#L52)

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
<td>

[src/VarhubClient.ts:19](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/VarhubClient.ts#L19)

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
<td>

[src/VarhubClient.ts:41](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/VarhubClient.ts#L41)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/VarhubClient.ts:8](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/VarhubClient.ts#L8)
