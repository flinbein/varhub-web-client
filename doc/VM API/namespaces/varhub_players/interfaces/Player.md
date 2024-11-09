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

[src/modules.d.ts:426](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L426)

***

### group

> `get` **group**(): `undefined` \| `string`

get player's group

#### Returns

`undefined` \| `string`

#### Defined in

[src/modules.d.ts:439](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L439)

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

#### Defined in

[src/modules.d.ts:422](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L422)

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:431](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L431)

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:435](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L435)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

#### Defined in

[src/modules.d.ts:484](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L484)

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

[src/modules.d.ts:477](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L477)

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

`any`[]

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### Defined in

[src/modules.d.ts:448](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L448)

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

[src/modules.d.ts:443](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L443)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:478](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L478)

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:479](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L479)

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

#### Defined in

[src/modules.d.ts:472](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L472)

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

#### Defined in

[src/modules.d.ts:456](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L456)

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

#### Defined in

[src/modules.d.ts:464](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/modules.d.ts#L464)
