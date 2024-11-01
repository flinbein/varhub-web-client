[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RoomSocketHandler

# Class: RoomSocketHandler

Client-side room handler.
It allows you to handle room events and send messages to connected clients.

## Example

```typescript
import {Varhub} from "@flinbein/varhub-web-client";

const hub = new Varhub("https://example.com/varhub/");
const room: RoomSocketHandler = hub.createRoomSocket();
await room;
console.log(room.id);
```

## Accessors

### closed

> `get` **closed**(): `boolean`

room is closed

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:158](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L158)

***

### id

> `get` **id**(): `null` \| `string`

room id

#### Returns

`null` \| `string`

#### Defined in

[src/RoomSocketHandler.ts:186](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L186)

***

### integrity

> `get` **integrity**(): `null` \| `string`

room integrity

#### Returns

`null` \| `string`

#### Defined in

[src/RoomSocketHandler.ts:193](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L193)

***

### message

> `get` **message**(): `null` \| `string`

public message of the room.

> `set` **message**(`msg`): `void`

change public message of the room. Set null to make room private.

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`msg`

</td>
<td>

`null` \| `string`

</td>
</tr>
</tbody>
</table>

#### Returns

`null` \| `string`

#### Defined in

[src/RoomSocketHandler.ts:163](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L163)

***

### ready

> `get` **ready**(): `boolean`

room is created and `room.id` is defined

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:154](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L154)

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

destroy this room and wait for websocket to close

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/RoomSocketHandler.ts:265](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L265)

***

### \[dispose\]()

> **\[dispose\]**(): `void`

destroy this room

#### Returns

`void`

#### Defined in

[src/RoomSocketHandler.ts:257](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L257)

***

### broadcast()

> **broadcast**(...`msg`): [`RoomSocketHandler`](RoomSocketHandler.md)

send message to all ready connections.

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

...`msg`

</td>
<td>

`any`[]

</td>
</tr>
</tbody>
</table>

#### Returns

[`RoomSocketHandler`](RoomSocketHandler.md)

#### Defined in

[src/RoomSocketHandler.ts:200](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L200)

***

### destroy()

> **destroy**(): `void`

destroy this room.

#### Returns

`void`

#### Defined in

[src/RoomSocketHandler.ts:209](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L209)

***

### getConnections()

> **getConnections**(`filter`?): `Set`\<[`Connection`](Connection.md)\>

get all connections

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`filter`?

</td>
<td>

`object`

</td>
<td>

filter connections, optional.

</td>
</tr>
<tr>
<td>

`filter.closed`?

</td>
<td>

`boolean`

</td>
<td>

get only closed (or not closed) connections.

</td>
</tr>
<tr>
<td>

`filter.deferred`?

</td>
<td>

`boolean`

</td>
<td>

get only deferred (or not deferred) connections.

</td>
</tr>
<tr>
<td>

`filter.ready`?

</td>
<td>

`boolean`

</td>
<td>

get only ready (or not ready) connections.

</td>
</tr>
</tbody>
</table>

#### Returns

`Set`\<[`Connection`](Connection.md)\>

connections found

#### Defined in

[src/RoomSocketHandler.ts:147](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L147)

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `PromiseLike`\<`R1` \| `R2`\>

Promise like for events "init", "error"
### Using in async context

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`R1`

</td>
<td>

[[`RoomSocketHandler`](RoomSocketHandler.md)]

</td>
</tr>
<tr>
<td>

`R2`

</td>
<td>

`never`

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`onfulfilled`?

</td>
<td>

`null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

</td>
<td>

</td>
</tr>
<tr>
<td>

`onrejected`?

</td>
<td>

`null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

</td>
<td>

</td>
</tr>
</tbody>
</table>

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

[src/RoomSocketHandler.ts:132](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L132)

## Events

### off()

> **off**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* keyof [`RoomSocketHandlerEvents`](../type-aliases/RoomSocketHandlerEvents.md)

</td>
<td>

unsubscribe from event

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`event`

</td>
<td>

`T`

</td>
<td>

"init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
<td>

event handler

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### See

RoomSocketHandlerEvents

#### Defined in

[src/RoomSocketHandler.ts:249](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L249)

***

### on()

> **on**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* keyof [`RoomSocketHandlerEvents`](../type-aliases/RoomSocketHandlerEvents.md)

</td>
<td>

subscribe on event

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`event`

</td>
<td>

`T`

</td>
<td>

"init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
<td>

event handler

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### See

RoomSocketHandlerEvents

#### Defined in

[src/RoomSocketHandler.ts:223](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L223)

***

### once()

> **once**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* keyof [`RoomSocketHandlerEvents`](../type-aliases/RoomSocketHandlerEvents.md)

</td>
<td>

subscribe on event once

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`event`

</td>
<td>

`T`

</td>
<td>

"init", "close", "error", "connection", "connectionOpen", "connectionClose" or "connectionMessage"

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
<td>

event handler

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### See

RoomSocketHandlerEvents

#### Defined in

[src/RoomSocketHandler.ts:236](https://github.com/flinbein/varhub-web-client/blob/d93ec9e7d9f0967b9f3ecbfd0f70f402d58e0bea/src/RoomSocketHandler.ts#L236)
