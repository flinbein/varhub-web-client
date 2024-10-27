[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / RPCChannelEventWithState

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

[src/RPCChannel.ts:46](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/RPCChannel.ts#L46)
