[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / Connection

# Class: Connection

## Accessors

### closed

> `get` **closed**(): `boolean`

connection closed

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:488](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L488)

***

### deferred

> `get` **deferred**(): `boolean`

connection is deferred

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:427](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L427)

***

### parameters

> `get` **parameters**(): `XJData`[]

get the parameters with which the connection was initialized

#### Returns

`XJData`[]

#### Defined in

[src/RoomSocketHandler.ts:420](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L420)

***

### ready

> `get` **ready**(): `boolean`

connection open

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:481](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L481)

## Methods

### close()

> **close**(`reason`?): `void`

close client's connection

#### Parameters

• **reason?**: `null` \| `string`

#### Returns

`void`

#### Defined in

[src/RoomSocketHandler.ts:551](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L551)

***

### defer()

> **defer**\<`T`, `A`\>(`handler`, ...`args`): `T`

defer connection establishment.
Use this method if you need to perform an asynchronous check to get permission to connect.

#### Type Parameters

• **T**

• **A** *extends* `any`[]

#### Parameters

• **handler**

If the handler completes or resolves successfully, the connection will be opened.
- If the handler throws or rejects an error, the connection will be closed with this error.
- You can close the connection earlier by calling `connection.close(reason)`.
- You can open the connection earlier by calling `connection.open()`.

• ...**args**: `A`

additional arguments for handler

#### Returns

`T`

the result of handler or throws error

#### Example

```typescript
room.on("connection", (connection, ...args) => {
  void connection.defer(checkConnection, ...args);
  console.assert(connection.deferred);
  console.assert(!connection.ready);
  console.assert(!connection.closed);
})
async function checkConnection(connection, ...args) {
  const permitted: boolean = await checkConnectionPermits(connection, args);
  if (!permitted) connection.close("not permitted"); // or throw error
}
```

#### Defined in

[src/RoomSocketHandler.ts:455](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L455)

***

### open()

> **open**(): [`Connection`](Connection.md)

Allow the connection to connect

The connection is connected automatically if it has not been deferred.

#### Returns

[`Connection`](Connection.md)

#### Defined in

[src/RoomSocketHandler.ts:497](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L497)

***

### send()

> **send**(...`data`): [`Connection`](Connection.md)

send data to connection

#### Parameters

• ...**data**: `XJData`[]

any serializable arguments

#### Returns

[`Connection`](Connection.md)

#### Defined in

[src/RoomSocketHandler.ts:506](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L506)

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `PromiseLike`\<`R1` \| `R2`\>

Promise like for events "open", "error"
### Using in async context

#### Type Parameters

• **R1** = [[`Connection`](Connection.md)]

• **R2** = `never`

#### Parameters

• **onfulfilled?**: `null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

• **onrejected?**: `null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

#### Returns

`PromiseLike`\<`R1` \| `R2`\>

#### Examples

```typescript
try {
  await connection;
  console.log("client connected");
} catch (error) {
  console.log("connection error");
}
```
### Using in sync context

```
connection.then(([connection]) => {
  console.log("client connected");
});
```

#### Defined in

[src/RoomSocketHandler.ts:410](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L410)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/RoomSocketHandler.ts:555](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L555)

***

### valueOf()

> **valueOf**(): `number`

#### Returns

`number`

#### Defined in

[src/RoomSocketHandler.ts:559](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L559)

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`ConnectionEvents`](../type-aliases/ConnectionEvents.md)

unsubscribe from event

#### Parameters

• **eventName**: `T`

"message", "open" or "close"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/RoomSocketHandler.ts:542](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L542)

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`ConnectionEvents`](../type-aliases/ConnectionEvents.md)

subscribe on event

#### Parameters

• **eventName**: `T`

"message", "open" or "close"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/RoomSocketHandler.ts:518](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L518)

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`ConnectionEvents`](../type-aliases/ConnectionEvents.md)

subscribe on event once

#### Parameters

• **eventName**: `T`

"message", "open" or "close"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/RoomSocketHandler.ts:530](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RoomSocketHandler.ts#L530)
