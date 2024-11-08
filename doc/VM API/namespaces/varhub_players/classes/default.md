[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:players"](../README.md) / default

# Class: default

## Constructors

### new default()

> **new default**(`room`, `registerPlayerHandler`): [`default`](default.md)

Create a player list based on connections.

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

`room`

</td>
<td>

[`Room`](../../varhub:room/interfaces/Room.md)

</td>
<td>

room

</td>
</tr>
<tr>
<td>

`registerPlayerHandler`

</td>
<td>

(`connection`, ...`args`) => `undefined` \| `null` \| `string` \| `void` \| `Promise`\<`undefined` \| `null` \| `string` \| `void`\>

</td>
<td>

handler to get the player's name.
- if handler returns or resolves a string - it will be the player's name
- if handler returns or resolves a null or undefined - the connection will be opened without a player
- if handler throws or rejects - the connection will be closed
- async handler will defer the connection

</td>
</tr>
</tbody>
</table>

#### Returns

[`default`](default.md)

#### Examples

```typescript
const players = new Players(room, (connection, ...args) => String(args[0]));
```

```typescript
const players = new Players(room, async (connection, name, password) => {
  const permitted: boolean = await checkUser(name, password);
  if (!permitted) throw "wrong password";
  return name;
});
```

#### Defined in

[src/modules.d.ts:570](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L570)

## Accessors

### count

> `get` **count**(): `number`

get number of players

#### Returns

`number`

#### Defined in

[src/modules.d.ts:580](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L580)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<[`Player`](../interfaces/Player.md)\>

iterate on all players

#### Returns

`MapIterator`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:617](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L617)

***

### all()

> **all**(): `Set`\<[`Player`](../interfaces/Player.md)\>

get all players

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:589](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L589)

***

### get()

> **get**(`nameOrConnection`): `undefined` \| [`Player`](../interfaces/Player.md)

get player by name or connection

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

`nameOrConnection`

</td>
<td>

`string` \| [`Connection`](../../varhub:room/interfaces/Connection.md)

</td>
<td>

name or connection

</td>
</tr>
</tbody>
</table>

#### Returns

`undefined` \| [`Player`](../interfaces/Player.md)

#### Defined in

[src/modules.d.ts:575](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L575)

***

### getGroup()

> **getGroup**(`group`): `Set`\<[`Player`](../interfaces/Player.md)\>

get all players with specified group. If group is undefined - get all players without group.

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

`group`

</td>
<td>

`undefined` \| `string`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:585](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L585)

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

`T` *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)

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

"join", "leave", "online" or "offline"

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

[src/modules.d.ts:613](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L613)

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

`T` *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)

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

"join", "leave", "online" or "offline"

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

[src/modules.d.ts:597](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L597)

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

`T` *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)

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

"join", "leave", "online" or "offline"

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

[src/modules.d.ts:605](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/modules.d.ts#L605)
