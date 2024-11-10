[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / Players

# Class: Players

List of players based on named connections.

## Constructors

### new Players()

> **new Players**(`room`, `registerPlayerHandler`): [`Players`](Players.md)

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

[`RoomSocketHandler`](RoomSocketHandler.md)

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

[`Players`](Players.md)

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

## Accessors

### count

> `get` **count**(): `number`

get number of players

#### Returns

`number`

***

### room

> `get` **room**(): [`RoomSocketHandler`](RoomSocketHandler.md)

#### Returns

[`RoomSocketHandler`](RoomSocketHandler.md)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<[`Player`](Player.md)\>

iterate on all players

#### Returns

`MapIterator`\<[`Player`](Player.md)\>

***

### all()

> **all**(): `Set`\<[`Player`](Player.md)\>

get all players

#### Returns

`Set`\<[`Player`](Player.md)\>

***

### get()

> **get**(`nameOrConnection`): `undefined` \| [`Player`](Player.md)

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

`string` \| [`Connection`](Connection.md)

</td>
<td>

name or connection

</td>
</tr>
</tbody>
</table>

#### Returns

`undefined` \| [`Player`](Player.md)

***

### getGroup()

> **getGroup**(`group`): `Set`\<[`Player`](Player.md)\>

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

`Set`\<[`Player`](Player.md)\>

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
