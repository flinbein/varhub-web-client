[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:players"](../README.md) / PlayersEvents

# Type Alias: PlayersEvents

> **PlayersEvents**: `object`

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

[[`Player`](../interfaces/Player.md)]

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

[src/modules.d.ts:499](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L499)

</td>
</tr>
<tr>
<td>

`leave`

</td>
<td>

[[`Player`](../interfaces/Player.md)]

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

[src/modules.d.ts:521](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L521)

</td>
</tr>
<tr>
<td>

`offline`

</td>
<td>

[[`Player`](../interfaces/Player.md)]

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

[src/modules.d.ts:545](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L545)

</td>
</tr>
<tr>
<td>

`online`

</td>
<td>

[[`Player`](../interfaces/Player.md)]

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

[src/modules.d.ts:533](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L533)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:488](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L488)
