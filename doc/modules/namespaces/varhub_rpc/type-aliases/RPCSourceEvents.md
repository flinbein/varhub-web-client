[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:rpc"](../README.md) / RPCSourceEvents

# Type Alias: RPCSourceEvents\<STATE, C\>

> **RPCSourceEvents**\<`STATE`, `C`\>: `object`

## Type Parameters

• **STATE**

• **C**

## Type declaration

### channelClose

> **channelClose**: [`C`, `any`]

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

> **dispose**: [`any`]

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

[src/modules.d.ts:579](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L579)
