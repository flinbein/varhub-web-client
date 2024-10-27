[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / RoomSocketHandler

# Class: RoomSocketHandler

## Accessors

### closed

> `get` **closed**(): `boolean`

room is closed

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:124](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L124)

***

### id

> `get` **id**(): `null` \| `string`

room id

#### Returns

`null` \| `string`

#### Defined in

[src/RoomSocketHandler.ts:152](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L152)

***

### integrity

> `get` **integrity**(): `null` \| `string`

room integrity

#### Returns

`null` \| `string`

#### Defined in

[src/RoomSocketHandler.ts:159](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L159)

***

### message

> `get` **message**(): `null` \| `string`

public message of the room.

> `set` **message**(`msg`): `void`

change public message of the room. Set null to make room private.

#### Parameters

• **msg**: `null` \| `string`

#### Returns

`null` \| `string`

#### Defined in

[src/RoomSocketHandler.ts:129](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L129)

***

### ready

> `get` **ready**(): `boolean`

room is created and `room.id` is defined

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:120](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L120)

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

destroy this room and wait for websocket to close

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/RoomSocketHandler.ts:231](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L231)

***

### \[dispose\]()

> **\[dispose\]**(): `void`

destroy this room

#### Returns

`void`

#### Defined in

[src/RoomSocketHandler.ts:223](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L223)

***

### broadcast()

> **broadcast**(...`msg`): [`RoomSocketHandler`](RoomSocketHandler.md)

send message to all ready connections.

#### Parameters

• ...**msg**: `any`[]

#### Returns

[`RoomSocketHandler`](RoomSocketHandler.md)

#### Defined in

[src/RoomSocketHandler.ts:166](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L166)

***

### destroy()

> **destroy**(): `void`

destroy this room.

#### Returns

`void`

#### Defined in

[src/RoomSocketHandler.ts:175](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L175)

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

[src/RoomSocketHandler.ts:113](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L113)

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `PromiseLike`\<`R1` \| `R2`\>

Promise like for events "init", "error"
### Using in async context

#### Type Parameters

• **R1** = [[`RoomSocketHandler`](RoomSocketHandler.md)]

• **R2** = `never`

#### Parameters

• **onfulfilled?**: `null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

• **onrejected?**: `null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

#### Returns

`PromiseLike`\<`R1` \| `R2`\>

#### Examples

```typescript
const room = varhub.createRoomSocket();
try {
  await room;
  console.log("room ready");
} catch (error) {
  console.log("room error");
}
```

```typescript
const [room] = await varhub.createRoomSocket();
```
### Using in sync context

```typescript
varhub.createRoomSocket().then(([room]) => {
  console.log("room ready", room.id);
});
```

#### Defined in

[src/RoomSocketHandler.ts:98](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L98)

## Events

### off()

> **off**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RoomSocketHandlerEvents`](../type-aliases/RoomSocketHandlerEvents.md)

unsubscribe from event

#### Parameters

• **event**: `T`

"init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"

• **handler**

event handler

#### Returns

`this`

#### See

RoomSocketHandlerEvents

#### Defined in

[src/RoomSocketHandler.ts:215](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L215)

***

### on()

> **on**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RoomSocketHandlerEvents`](../type-aliases/RoomSocketHandlerEvents.md)

subscribe on event

#### Parameters

• **event**: `T`

"init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"

• **handler**

event handler

#### Returns

`this`

#### See

RoomSocketHandlerEvents

#### Defined in

[src/RoomSocketHandler.ts:189](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L189)

***

### once()

> **once**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RoomSocketHandlerEvents`](../type-aliases/RoomSocketHandlerEvents.md)

subscribe on event once

#### Parameters

• **event**: `T`

"init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"

• **handler**

event handler

#### Returns

`this`

#### See

RoomSocketHandlerEvents

#### Defined in

[src/RoomSocketHandler.ts:202](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RoomSocketHandler.ts#L202)
