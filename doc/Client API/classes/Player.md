[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / Player

# Class: Player

Player represents a list of [Connection](Connection.md)s with same name.

## Accessors

### connections

> `get` **connections**(): `Set`\<[`Connection`](Connection.md)\>

get all player's connections

#### Returns

`Set`\<[`Connection`](Connection.md)\>

***

### group

> `get` **group**(): `undefined` \| `string`

get player's group

#### Returns

`undefined` \| `string`

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](Connection.md)\>

***

### kick()

> **kick**(`reason`): `void`

kick player and close all player's connections

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Default value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`reason`

</td>
<td>

`null` \| `string`

</td>
<td>

`null`

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

`XJData`[]

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

***

### setGroup()

> **setGroup**(`value`): `this`

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

`undefined` \| `string`

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

`T` *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)

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

`T` *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)

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

`T` *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)

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
