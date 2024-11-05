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
<th>Defined in</th>
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
<td>

[src/RPCChannel.ts:32](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RPCChannel.ts#L32)

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
<td>

[src/RPCChannel.ts:56](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RPCChannel.ts#L56)

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
<td>

[src/RPCChannel.ts:44](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RPCChannel.ts#L44)

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
<td>

[src/RPCChannel.ts:20](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RPCChannel.ts#L20)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/RPCChannel.ts:9](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/RPCChannel.ts#L9)
