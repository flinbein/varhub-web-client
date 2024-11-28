[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:players](../README.md) / Player

# Interface: Player\<DESC, ROOM_DESC\>

Player represents a list of [Connection](../../varhub:room/interfaces/Connection.md)s with same name.

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

`DESC` *extends* [`PlayerDesc`](../type-aliases/PlayerDesc.md)

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`ROOM_DESC` *extends* [`RoomDesc`](../../varhub:room/type-aliases/RoomDesc.md)

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| `data?` | `DESC` *extends* `object` ? `T` : `any` | custom data for this player |

## Accessors

### connections

#### Get Signature

> **get** **connections**(): `Set`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\<`ROOM_DESC`\>\>

get all player's connections

##### Returns

`Set`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\<`ROOM_DESC`\>\>

***

### name

#### Get Signature

> **get** **name**(): `string`

player's name

##### Returns

`string`

***

### online

#### Get Signature

> **get** **online**(): `boolean`

player is online (has at least one opened connection)

##### Returns

`boolean`

***

### registered

#### Get Signature

> **get** **registered**(): `boolean`

player is registered in list of players

##### Returns

`boolean`

***

### team

#### Get Signature

> **get** **team**(): `undefined` \| `DESC` *extends* `object` ? `T` : `string`

get player's group

##### Returns

`undefined` \| `DESC` *extends* `object` ? `T` : `string`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\<`ROOM_DESC`\>\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\<`ROOM_DESC`\>\>

***

### kick()

> **kick**(`reason`?): `void`

kick player and close all player's connections

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

`reason`?

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

`void`

***

### send()

> **send**(...`args`): `this`

send message for all connections

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

...`args`

</td>
<td>

`ROOM_DESC` *extends* `object` ? `R` : `any`[]

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

***

### setTeam()

> **setTeam**(`value`): `this`

set player's group

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

`value`

</td>
<td>

`undefined` \| `DESC` *extends* `object` ? `T` : `string`

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

***

### toString()

> **toString**(): `string`

#### Returns

`string`

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

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

`T` *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)\<`ROOM_DESC`\>

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

`eventName`

</td>
<td>

`T`

</td>
<td>

"leave", "online", "connectionMessage" or "offline"

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

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

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

`T` *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)\<`ROOM_DESC`\>

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

`eventName`

</td>
<td>

`T`

</td>
<td>

"leave", "online", "connectionMessage" or "offline"

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

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

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

`T` *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)\<`ROOM_DESC`\>

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

`eventName`

</td>
<td>

`T`

</td>
<td>

"leave", "online", "connectionMessage" or "offline"

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
