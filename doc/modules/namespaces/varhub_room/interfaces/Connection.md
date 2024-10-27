[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:room"](../README.md) / Connection

# Interface: Connection

## Accessors

### closed

> `get` **closed**(): `boolean`

connection closed

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:74](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L74)

***

### deferred

> `get` **deferred**(): `boolean`

connection is deferred

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:138](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L138)

***

### parameters

> `get` **parameters**(): `any`[]

get the parameters with which the connection was initialized

#### Returns

`any`[]

#### Defined in

[src/modules.d.ts:148](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L148)

***

### ready

> `get` **ready**(): `boolean`

connection open

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:70](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L70)

## Methods

### close()

> **close**(`reason`?): `void`

close client's connection

#### Parameters

• **reason?**: `null` \| `string`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:108](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L108)

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

[src/modules.d.ts:134](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L134)

***

### open()

> **open**(): `this`

Allow the connection to connect

The connection is connected automatically if it has not been deferred.

#### Returns

`this`

#### Defined in

[src/modules.d.ts:144](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L144)

***

### send()

> **send**(...`data`): `this`

send data to connection

#### Parameters

• ...**data**: `any`[]

any serializable arguments

#### Returns

`this`

#### Defined in

[src/modules.d.ts:79](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L79)

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `Promise`\<`R1` \| `R2`\>

Promise like for events "open", "error"
### Using in async context

#### Type Parameters

• **R1** = [[`Connection`](Connection.md)]

• **R2** = `never`

#### Parameters

• **onfulfilled?**: `null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

• **onrejected?**: `null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

#### Returns

`Promise`\<`R1` \| `R2`\>

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

[src/modules.d.ts:63](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L63)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:149](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L149)

***

### valueOf()

> **valueOf**(): `number`

#### Returns

`number`

#### Defined in

[src/modules.d.ts:150](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L150)

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

[src/modules.d.ts:103](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L103)

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

[src/modules.d.ts:87](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L87)

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

[src/modules.d.ts:95](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L95)
