[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCSourceEvents

# Type Alias: RPCSourceEvents\<STATE, C\>

> **RPCSourceEvents**\<`STATE`, `C`\>: `object`

Events of [RPCSource](../classes/RPCSource.md)

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`STATE`

</td>
<td>

</td>
</tr>
<tr>
<td>

`C`

</td>
<td>

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

`channelClose`

</td>
<td>

[`C`, `XJData`]

</td>
<td>

channel is closed

**Example**

```typescript
rpc = new RPCSource({});
rpc.on("channelClose", (sourceChannel, reason) => {
  console.log("client closed this channel:", sourceChannel.client, "reason:", reason);
})
```

</td>
<td>

[src/RPCSource.ts:141](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L141)

</td>
</tr>
<tr>
<td>

`channelOpen`

</td>
<td>

[`C`]

</td>
<td>

new channel is open

**Example**

```typescript
rpc = new RPCSource({});
rpc.on("channelOpen", (sourceChannel) => {
  if (isBadClient(sourceChannel.client)) {
  	sourceChannel.close("bad!");
  }
})
```
If you close the sourceChannel while the event is being processed,
the channel will not be created and `channelClose` event will not be triggered.

</td>
<td>

[src/RPCSource.ts:130](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L130)

</td>
</tr>
<tr>
<td>

`dispose`

</td>
<td>

[`XJData`]

</td>
<td>

rpc is disposed

**Example**

```typescript
rpc = new RPCSource({});
rpc.on("dispose", (reason) => {
  console.log("disposed by reason:", reason);
});
rpc.dispose("reason");
```

</td>
<td>

[src/RPCSource.ts:169](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L169)

</td>
</tr>
<tr>
<td>

`state`

</td>
<td>

[`STATE`, `STATE`]

</td>
<td>

state is changed

**Example**

```typescript
rpc = new RPCSource({}, "state1");
console.assert(rpc.state === "state1");

rpc.on("state", (newState, oldState) => {
  console.log("new state:", newState);
  console.log("old state:", oldState);
  console.assert(rpc.state === newState);
});
rpc.setState("state2");
```

</td>
<td>

[src/RPCSource.ts:157](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L157)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/RPCSource.ts:115](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L115)
