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

[src/RPCChannel.ts:46](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L46)
