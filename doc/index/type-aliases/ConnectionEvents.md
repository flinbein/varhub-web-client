[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / ConnectionEvents

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

> **message**: `XJData`[]

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

[src/RoomSocketHandler.ts:329](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/RoomSocketHandler.ts#L329)
