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

#### Defined in

[src/Players.ts:332](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L332)

***

### group

> `get` **group**(): `undefined` \| `string`

get player's group

#### Returns

`undefined` \| `string`

#### Defined in

[src/Players.ts:344](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L344)

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

#### Defined in

[src/Players.ts:327](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L327)

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

#### Defined in

[src/Players.ts:336](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L336)

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

#### Defined in

[src/Players.ts:340](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L340)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](Connection.md)\>

#### Defined in

[src/Players.ts:403](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L403)

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

#### Defined in

[src/Players.ts:388](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L388)

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

#### Defined in

[src/Players.ts:348](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L348)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/Players.ts:392](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L392)

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

#### Defined in

[src/Players.ts:396](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L396)

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

"leave", "online" or "offline"

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

#### Defined in

[src/Players.ts:379](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L379)

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

"leave", "online" or "offline"

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

#### Defined in

[src/Players.ts:357](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L357)

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

"leave", "online" or "offline"

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

#### Defined in

[src/Players.ts:368](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Players.ts#L368)
