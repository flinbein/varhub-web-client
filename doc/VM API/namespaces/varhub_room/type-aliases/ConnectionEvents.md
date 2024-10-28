[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:room"](../README.md) / ConnectionEvents

# Type Alias: ConnectionEvents

> **ConnectionEvents**: `object`

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

[src/modules.d.ts:58](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L58)

</td>
</tr>
<tr>
<td>

`message`

</td>
<td>

`any`[]

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

[src/modules.d.ts:69](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L69)

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

[src/modules.d.ts:47](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L47)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:35](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L35)
