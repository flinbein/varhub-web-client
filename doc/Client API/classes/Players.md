[**@flinbein/varhub-web-clent**](../../README.md)

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / Players

# Class: Players\<PLAYER_DESC, ROOM_DESC\>

List of players based on named connections.

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

`PLAYER_DESC` *extends* `Record`\<keyof `PlayerDesc`, `any`\> *extends* `PLAYER_DESC` ? `PlayerDesc` : `never`

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`ROOM_DESC` *extends* `Record`\<keyof `RoomDesc`, `any`\> *extends* `ROOM_DESC` ? `RoomDesc` : `never`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Constructors

### new Players()

> **new Players**\<`PLAYER_DESC`, `ROOM_DESC`\>(`room`, `registerPlayerHandler`): [`Players`](Players.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

[`RoomSocketHandler`](RoomSocketHandler.md)\<`ROOM_DESC`\>

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

[`Players`](Players.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

> **get** **room**(): [`RoomSocketHandler`](RoomSocketHandler.md)\<`ROOM_DESC`\>

get current Room

##### Returns

[`RoomSocketHandler`](RoomSocketHandler.md)\<`ROOM_DESC`\>

## Methods

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<[`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

iterate on all players

#### Returns

`MapIterator`\<[`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

***

### all()

> **all**(): `Set`\<[`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

get all players

#### Returns

`Set`\<[`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

***

### get()

> **get**(`nameOrConnection`): `undefined` \| [`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

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

`string` \| [`Connection`](Connection.md)\<`RoomDesc`\>

</td>
<td>

name or connection

</td>
</tr>
</tbody>
</table>

#### Returns

`undefined` \| [`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>

***

### getTeam()

> **getTeam**(`team`): `Set`\<[`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

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

`team`

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

`Set`\<[`Player`](Player.md)\<`PLAYER_DESC`, `ROOM_DESC`\>\>

***

### withType()

> **withType**\<`DESC`\>(): [`Players`](Players.md)\<`DESC`, `ROOM_DESC`\>

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

`DESC` *extends* `PlayerDesc`

</td>
<td>

`object`

</td>
<td>

DESC.team - (optional, extends string) available teams of players
DESC.data - (optional, any) custom data of player ([Player#data](Player.md#data))

</td>
</tr>
</tbody>
</table>

#### Returns

[`Players`](Players.md)\<`DESC`, `ROOM_DESC`\>

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
