[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:room"](../README.md) / Room

# Interface: Room

## Accessors

### message

> `get` **message**(): `null` \| `string`

public message of the room.

> `set` **message**(`value`): `void`

change public message of the room. Set null to make room private.

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

#### Returns

`null` \| `string`

#### Defined in

[src/modules.d.ts:256](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L256)

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/modules.d.ts:312](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L312)

***

### \[dispose\]()

> **\[dispose\]**(): `void`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:311](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L311)

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

#### Defined in

[src/modules.d.ts:271](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L271)

***

### destroy()

> **destroy**(): `void`

destroy this room.

#### Returns

`void`

#### Defined in

[src/modules.d.ts:266](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L266)

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

[src/modules.d.ts:281](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L281)

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

`T` *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)

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

(...`args`) => `void`

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

#### Defined in

[src/modules.d.ts:309](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L309)

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

`T` *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)

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

(...`args`) => `void`

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

#### Defined in

[src/modules.d.ts:291](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L291)

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

`T` *extends* keyof [`RoomEvents`](../type-aliases/RoomEvents.md)

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

(...`args`) => `void`

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

#### Defined in

[src/modules.d.ts:300](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/modules.d.ts#L300)
