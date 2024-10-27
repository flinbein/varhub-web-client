[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:room"](../README.md) / Room

# Interface: Room

## Accessors

### message

> `get` **message**(): `null` \| `string`

public message of the room.

> `set` **message**(`value`): `void`

change public message of the room. Set null to make room private.

#### Parameters

• **value**: `null` \| `string`

#### Returns

`null` \| `string`

#### Defined in

[src/modules.d.ts:223](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L223)

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/modules.d.ts:279](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L279)

***

### \[dispose\]()

> **\[dispose\]**(): `void`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:278](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L278)

***

### broadcast()

> **broadcast**(...`msg`): `this`

send message to all ready connections.

#### Parameters

• ...**msg**: `any`[]

#### Returns

`this`

#### Defined in

[src/modules.d.ts:238](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L238)

***

### destroy()

> **destroy**(): `void`

destroy this room.

#### Returns

`void`

#### Defined in

[src/modules.d.ts:233](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L233)

***

### getConnections()

> **getConnections**(`filter`?): `Set`\<[`Connection`](Connection.md)\>

get all connections

#### Parameters

• **filter?**

filter connections, optional.

• **filter.closed?**: `boolean`

get only closed (or not closed) connections.

• **filter.deferred?**: `boolean`

get only deferred (or not deferred) connections.

• **filter.ready?**: `boolean`

get only ready (or not ready) connections.

#### Returns

`Set`\<[`Connection`](Connection.md)\>

connections found

#### Defined in

[src/modules.d.ts:248](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L248)

## Events

### off()

> **off**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)

unsubscribe from event

#### Parameters

• **event**: `T`

"connection", "connectionOpen", "connectionClose" or "connectionMessage"

• **handler**

event handler

#### Returns

`this`

#### See

RoomEvents

#### Defined in

[src/modules.d.ts:276](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L276)

***

### on()

> **on**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)

subscribe on event

#### Parameters

• **event**: `T`

"connection", "connectionOpen", "connectionClose" or "connectionMessage"

• **handler**

event handler

#### Returns

`this`

#### See

RoomEvents

#### Defined in

[src/modules.d.ts:258](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L258)

***

### once()

> **once**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)

subscribe on event once

#### Parameters

• **event**: `T`

"connection", "connectionOpen", "connectionClose" or "connectionMessage"

• **handler**

event handler

#### Returns

`this`

#### See

RoomEvents

#### Defined in

[src/modules.d.ts:267](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L267)
