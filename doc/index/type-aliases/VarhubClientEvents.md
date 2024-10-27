[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / VarhubClientEvents

# Type Alias: VarhubClientEvents

> **VarhubClientEvents**: `object`

## Type declaration

### close

> **close**: [`string` \| `null`, `boolean`]

client's connection closed

#### Example

```typescript
client.on("close", (reason: string|null, wasOnline: boolean) => {
  console.log("client closed by reason:", reason);
  console.assert(client.closed);
})
```

### error

> **error**: []

client connection was closed while trying to connect

#### Example

```typescript
client.on("error", () => {
  console.log("client can not be connected" );
  console.assert(client.closed);
})
```

### message

> **message**: `XJData`[]

client received a message from the room

#### Example

```typescript
client.on("message", (...data: XJData[]) => {
  console.log("client received:", data);
  console.assert(client.ready);
})
```

### open

> **open**: []

client's connection successfully opened

#### Example

```typescript
client.on("open", () => {
  console.log("client ready now!");
  console.assert(client.ready);
})
```

## Defined in

[src/VarhubClient.ts:5](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L5)
