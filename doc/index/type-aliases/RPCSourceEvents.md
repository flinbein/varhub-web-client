[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / RPCSourceEvents

# Type Alias: RPCSourceEvents\<STATE, C\>

> **RPCSourceEvents**\<`STATE`, `C`\>: `object`

## Type Parameters

• **STATE**

• **C**

## Type declaration

### channelClose

> **channelClose**: [`C`, `XJData`]

channel is closed

#### Example

```typescript
rpc = new RPCSource({});
rpc.on("channelClose", (sourceChannel, reason) => {
  console.log("client closed this channel:", sourceChannel.client, "reason:", reason);
})
```

### channelOpen

> **channelOpen**: [`C`]

new channel is open

#### Example

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

### dispose

> **dispose**: [`XJData`]

rpc is disposed

#### Example

```typescript
rpc = new RPCSource({});
rpc.on("dispose", (reason) => {
  console.log("disposed by reason:", reason);
});
rpc.dispose("reason");
```

### state

> **state**: [`STATE`, `STATE`]

state is changed

#### Example

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

## Defined in

[src/RPCSource.ts:102](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/RPCSource.ts#L102)
