[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:players](../README.md) / default

# Class: default\<PLAYER_DESC, ROOM_DESC\>

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

`PLAYER_DESC` *extends* `Record`\<keyof [`PlayerDesc`](../type-aliases/PlayerDesc.md), `any`\> *extends* `PLAYER_DESC` ? [`PlayerDesc`](../type-aliases/PlayerDesc.md) : `never`

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`ROOM_DESC` *extends* `Record`\<keyof [`RoomDesc`](../../varhub:room/type-aliases/RoomDesc.md), `any`\> *extends* `ROOM_DESC` ? [`RoomDesc`](../../varhub:room/type-aliases/RoomDesc.md) : `never`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Constructors

### new default()

> **new default**\<`PLAYER_DESC`, `ROOM_DESC`\>(`room`, `registerPlayerHandler`): [`default`](default.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

[`Room`](../../varhub:room/interfaces/Room.md)\<`ROOM_DESC`\>

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

[`default`](default.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

#### Get Signature

> **get** **count**(): `number`

get number of players

##### Returns

`number`

***

### room

#### Get Signature

> **get** **room**(): [`Room`](../../varhub:room/interfaces/Room.md)\<`ROOM_DESC`\>

get current Room

##### Returns

[`Room`](../../varhub:room/interfaces/Room.md)\<`ROOM_DESC`\>

## Methods

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<[`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

iterate on all players

#### Returns

`MapIterator`\<[`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

***

### all()

> **all**(): `Set`\<[`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

get all players

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

***

### get()

> **get**(`nameOrConnection`): `undefined` \| [`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

`string` \| [`Connection`](../../varhub:room/interfaces/Connection.md)\<`object`\>

</td>
<td>

name or connection

</td>
</tr>
</tbody>
</table>

#### Returns

`undefined` \| [`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

***

### getTeam()

> **getTeam**(`group`): `Set`\<[`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

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

`undefined` \| `PLAYER_DESC` *extends* `object` ? `T` : `string`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

***

### withType()

> **withType**\<`DESC`\>(): [`default`](default.md)\<`DESC`, `ROOM_DESC`\>

override current type of Players (typescript)

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
<th>Description</th>
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
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

[`default`](default.md)\<`DESC`, `ROOM_DESC`\>

#### Example

```typescript
const players = _players.withType<
  team: "red"|"blue",
  data: number
>()
```

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

`T` *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

`T` *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

`T` *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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
