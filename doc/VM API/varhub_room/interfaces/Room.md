[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:room](../README.md) / Room

# Interface: Room\<DESC\>

## Type Parameters

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

`DESC` *extends* [`RoomDesc`](../type-aliases/RoomDesc.md)

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Accessors

### message

#### Get Signature

> **get** **message**(): `null` \| `string`

public message of the room.

##### Returns

`null` \| `string`

#### Set Signature

> **set** **message**(`value`): `void`

change public message of the room. Set null to make room private.

##### Parameters

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

`value`

</td>
<td>

`null` \| `string`

</td>
<td>

</td>
</tr>
</tbody>
</table>

##### Returns

`void`

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

***

### \[dispose\]()

> **\[dispose\]**(): `void`

#### Returns

`void`

***

### broadcast()

> **broadcast**(...`msg`): `this`

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

`this`

***

### destroy()

> **destroy**(): `void`

destroy this room.

#### Returns

`void`

***

### getConnections()

> **getConnections**(`filter`?): `Set`\<[`Connection`](Connection.md)\<`DESC`\>\>

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

\{`closed`: `boolean`;`deferred`: `boolean`;`ready`: `boolean`; \}

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

`Set`\<[`Connection`](Connection.md)\<`DESC`\>\>

connections found

***

### useConnection()

> **useConnection**(): [`Connection`](Connection.md)\<`DESC`\>

Get current [Connection](Connection.md) in scope or throws error.
Use this method in room event handlers or RPC methods.
`useConnection` allowed to be called only in sync code.
```javascript
export async function remoteMethod(){
  const con = room.useConnection(); // OK
  await something();
  const con = room.useConnection(); // throws
}
```

#### Returns

[`Connection`](Connection.md)\<`DESC`\>

Connection

***

### validate()

> **validate**\<`V`\>(`__namedParameters`): `ApplyRoomValidator`\<`DESC`, `V`\> *extends* `T` ? [`Room`](Room.md)\<`T`\> : `never`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`V` *extends* `RoomValidator`

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
</tr>
</thead>
<tbody>
<tr>
<td>

`__namedParameters`

</td>
<td>

`V`

</td>
</tr>
</tbody>
</table>

#### Returns

`ApplyRoomValidator`\<`DESC`, `V`\> *extends* `T` ? [`Room`](Room.md)\<`T`\> : `never`

***

### withType()

> **withType**\<`PARTIAL_DESC`\>(): `OverrideKeys`\<`DESC`, `PARTIAL_DESC`\> *extends* `T` ? [`Room`](Room.md)\<`T`\> : `never`

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

`PARTIAL_DESC` *extends* [`RoomDesc`](../type-aliases/RoomDesc.md)

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

#### Returns

`OverrideKeys`\<`DESC`, `PARTIAL_DESC`\> *extends* `T` ? [`Room`](Room.md)\<`T`\> : `never`

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

`T` *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)\<`DESC`\>

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

"connection", "connectionOpen", "connectionClose" or "connectionMessage"

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

RoomEvents

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

`T` *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)\<`DESC`\>

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

"connection", "connectionOpen", "connectionClose" or "connectionMessage"

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

RoomEvents

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

`T` *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)\<`DESC`\>

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

"connection", "connectionOpen", "connectionClose" or "connectionMessage"

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

RoomEvents
