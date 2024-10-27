[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:room"](../README.md) / ConnectionEvents

# Type Alias: ConnectionEvents

> **ConnectionEvents**: `object`

## Type declaration

### close

> **close**: [`string` \| `null`, `boolean`]

connection closed

#### Example

```typescript
connection.on("close", (reason: string|null, wasOpen: boolean) => {
  console.log("connection closed by reason:", reason);
  console.assert(connection.closed);
})
```

### message

> **message**: `any`[]

received message from connection

#### Example

```typescript
connection.on("message", (...data) => {
  console.log("received from connection:", data);
  console.assert(connection.ready);
})
```

### open

> **open**: []

connection successfully opened

#### Example

```typescript
connection.on("open", () => {
  console.log("connection opened!");
  console.assert(connection.ready);
});
connection.open();
```

## Defined in

[src/modules.d.ts:3](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L3)
