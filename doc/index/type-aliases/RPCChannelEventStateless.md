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

[src/RPCChannel.ts:8](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCChannel.ts#L8)
