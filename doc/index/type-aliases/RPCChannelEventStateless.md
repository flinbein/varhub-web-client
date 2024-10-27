[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / RPCChannelEventStateless

# Type Alias: RPCChannelEventStateless

> **RPCChannelEventStateless**: `object`

## Type declaration

### close

> **close**: [`XJData`]

channel is closed

#### Example

```typescript
const rpc = new RPCChannel(client);
rpc.on("close", (reason) => {
  console.log("channel closed with reason:", reason);
   console.assert(rpc.closed);
});
```

### error

> **error**: [`XJData`]

channel is closed before was open

#### Example

```typescript
const rpc = new RPCChannel(client);
rpc.on("error", (reason) => {
  console.log("can not open channel", reason);
  console.assert(rpc.closed);
});
```

### init

> **init**: []

channel is closed

#### Example

```typescript
const rpc = new RPCChannel(client);
rpc.on("init", (reason) => {
  console.log("channel initialized");
  console.assert(rpc.ready);
});
```

## Defined in

[src/RPCChannel.ts:8](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/RPCChannel.ts#L8)
