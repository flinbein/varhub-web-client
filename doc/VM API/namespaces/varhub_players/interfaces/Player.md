[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:players"](../README.md) / Player

# Interface: Player

Player represents a list of [Connection](../../varhub:room/interfaces/Connection.md)s with same name.

## Accessors

### connections

> `get` **connections**(): `Set`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

get all player's connections

#### Returns

`Set`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

#### Defined in

[src/modules.d.ts:415](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L415)

***

### group

> `get` **group**(): `undefined` \| `string`

get player's group

#### Returns

`undefined` \| `string`

#### Defined in

[src/modules.d.ts:428](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L428)

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

#### Defined in

[src/modules.d.ts:411](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L411)

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:420](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L420)

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:424](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L424)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

#### Defined in

[src/modules.d.ts:468](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L468)

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

#### Defined in

[src/modules.d.ts:461](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L461)

***

### setGroup()

> **setGroup**(`value`): `any`

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

`any`

#### Defined in

[src/modules.d.ts:432](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L432)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:462](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L462)

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:463](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L463)

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

[src/modules.d.ts:456](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L456)

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

[src/modules.d.ts:440](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L440)

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

[src/modules.d.ts:448](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L448)
