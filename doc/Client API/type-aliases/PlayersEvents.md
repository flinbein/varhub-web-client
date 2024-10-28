[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / PlayersEvents

# Type Alias: PlayersEvents

> **PlayersEvents**: `object`

events of [Players](../classes/Players.md) object

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`join`

</td>
<td>

[[`Player`](../classes/Player.md)]

</td>
<td>

new player joined

**Example**

```typescript
const players = new Players((con, name) => String(name));
players.on("join", (player) => {
  console.log("player joined:", player.name);
})
```

</td>
<td>

[src/Players.ts:20](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/Players.ts#L20)

</td>
</tr>
<tr>
<td>

`leave`

</td>
<td>

[[`Player`](../classes/Player.md)]

</td>
<td>

player leaves the game

**Examples**

```typescript
const players = new Players((con, name) => String(name));
players.on("leave", (player) => {
  console.log("player leaves:", player.name);
})
```

Attention!

If the player's last connection is closed, he does not leave the game, but goes offline.

You can kick player when he goes offline

```typescript
const players = new Players((con, name) => String(name));
players.on("offline", player => player.kick("disconnected"))
```

</td>
<td>

[src/Players.ts:42](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/Players.ts#L42)

</td>
</tr>
<tr>
<td>

`offline`

</td>
<td>

[[`Player`](../classes/Player.md)]

</td>
<td>

player goes offline, last player's connection is closed.

**Example**

```typescript
const players = new Players((con, name) => String(name));
players.on("offline", (player) => {
  console.log("player offline now!", player.name);
  console.assert(!player.online);
})
```

</td>
<td>

[src/Players.ts:66](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/Players.ts#L66)

</td>
</tr>
<tr>
<td>

`online`

</td>
<td>

[[`Player`](../classes/Player.md)]

</td>
<td>

player goes online

**Example**

```typescript
const players = new Players((con, name) => String(name));
players.on("online", (player) => {
  console.log("player online now!", player.name);
  console.assert(player.online);
})
```

</td>
<td>

[src/Players.ts:54](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/Players.ts#L54)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/Players.ts:9](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/Players.ts#L9)
