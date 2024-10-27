[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / RPCChannelEventWithState

# Type Alias: RPCChannelEventWithState\<S\>

> **RPCChannelEventWithState**\<`S`\>: [`RPCChannelEventStateless`](RPCChannelEventStateless.md) & `object`

## Type declaration

### state

> **state**: [`S`, `S`]

state is changed

#### Example

```typescript
const rpc = new RPCChannel(client);
rpc.on("state", (newState, oldState) => {
  console.log("state changed", newState);
});
```

## Type Parameters

• **S**

## Defined in

[src/RPCChannel.ts:46](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/RPCChannel.ts#L46)
