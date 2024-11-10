[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCChannelEvents

# Type Alias: RPCChannelEvents\<S\>

> **RPCChannelEvents**\<`S`\>: `object`

Basic events of [RPCChannel](../variables/RPCChannel.md)

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

`S`

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

[`XJData`]

</td>
<td>

channel is closed

**Example**

```typescript
const rpc = new RPCChannel(client);
rpc.on("close", (reason) => {
  console.log("channel closed with reason:", reason);
   console.assert(rpc.closed);
});
```

</td>
</tr>
<tr>
<td>

`error`

</td>
<td>

[`XJData`]

</td>
<td>

channel is closed before was open

**Example**

```typescript
const rpc = new RPCChannel(client);
rpc.on("error", (reason) => {
  console.log("can not open channel", reason);
  console.assert(rpc.closed);
});
```

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

channel is closed

**Example**

```typescript
const rpc = new RPCChannel(client);
rpc.on("init", (reason) => {
  console.log("channel initialized");
  console.assert(rpc.ready);
});
```

</td>
</tr>
<tr>
<td>

`state`

</td>
<td>

[`S`, `S`]

</td>
<td>

state is changed

**Example**

```typescript
const rpc = new RPCChannel(client);
rpc.on("state", (newState, oldState) => {
  console.log("state changed", newState);
});
```

</td>
</tr>
</tbody>
</table>
