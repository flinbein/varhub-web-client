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

[src/modules.d.ts:483](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L483)

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

[src/modules.d.ts:505](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L505)

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

[src/modules.d.ts:529](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L529)

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

[src/modules.d.ts:517](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L517)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:472](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L472)
