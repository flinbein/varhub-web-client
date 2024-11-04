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

[src/modules.d.ts:416](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L416)

***

### group

> `get` **group**(): `undefined` \| `string`

get player's group

#### Returns

`undefined` \| `string`

#### Defined in

[src/modules.d.ts:429](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L429)

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

#### Defined in

[src/modules.d.ts:412](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L412)

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:421](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L421)

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:425](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L425)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

#### Defined in

[src/modules.d.ts:469](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L469)

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

[src/modules.d.ts:462](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L462)

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

[src/modules.d.ts:433](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L433)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:463](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L463)

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:464](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L464)

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

[src/modules.d.ts:457](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L457)

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

[src/modules.d.ts:441](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L441)

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

[src/modules.d.ts:449](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L449)
