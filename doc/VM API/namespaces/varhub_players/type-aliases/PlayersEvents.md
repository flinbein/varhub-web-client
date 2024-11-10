[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:players"](../README.md) / PlayersEvents

# Type Alias: PlayersEvents\<DESC\>

> **PlayersEvents**\<`DESC`\>: `object`

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`DESC` *extends* `object`

</td>
</tr>
</tbody>
</table>

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`join`

</td>
<td>

[[`Player`](../interfaces/Player.md)\<`DESC`\>]

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
</tr>
<tr>
<td>

`leave`

</td>
<td>

[[`Player`](../interfaces/Player.md)\<`DESC`\>]

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
</tr>
<tr>
<td>

`offline`

</td>
<td>

[[`Player`](../interfaces/Player.md)\<`DESC`\>]

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
</tr>
<tr>
<td>

`online`

</td>
<td>

[[`Player`](../interfaces/Player.md)\<`DESC`\>]

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
</tr>
</tbody>
</table>
