[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:room"](../README.md) / RoomEvents

# Type Alias: RoomEvents

> **RoomEvents**: `object`

Define all events dispatched by room controller

## Type declaration

### connection

> **connection**: [[`Connection`](../interfaces/Connection.md), `any`[]]

new connection initialized

#### Example

```ts
room.on("connection", (con, ...params) => {
  con.open();
  console.log("someone connected with params", params);
  con.send("Welcome!");
})
```

### connectionClose

> **connectionClose**: [[`Connection`](../interfaces/Connection.md), `string` \| `null`, `boolean`]

connection closed

#### Example

```ts
room.on("connectionClose", (con, reason, wasOpen) => {
  console.log("connection closed by reason:", reason);
})
```

### connectionMessage

> **connectionMessage**: [[`Connection`](../interfaces/Connection.md), `any`[]]

received a message from connection

#### Example

```ts
room.on("connectionMessage", (con, ...data) => {
  console.log("got message:", data);
})
```

### connectionOpen

> **connectionOpen**: [[`Connection`](../interfaces/Connection.md)]

connection successfully opened

#### Example

```ts
room.on("connectionOpen", (con) => {
  con.send("Welcome!");
})
```

## Defined in

[src/modules.d.ts:158](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L158)