[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / PlayerEvents

# Type Alias: PlayerEvents

> **PlayerEvents**: `object`

Events of [Player](../classes/Player.md)

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

`connectionMessage`

</td>
<td>

[[`Connection`](../classes/Connection.md), `XJData`[]]

</td>
<td>

message from player
```typescript
player.on("connectionMessage", (connection, ...msg) => {
  console.log(player.name, "said:", ...msg);
  connection.send("thanks for a message");
});
```

</td>
<td>

[src/Players.ts:327](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/Players.ts#L327)

</td>
</tr>
<tr>
<td>

`leave`

</td>
<td>

[]

</td>
<td>

player leaves the game

**Examples**

```typescript
player.on("leave", () => {
  console.log("player leaves:", player.name);
})
```

Attention!

If the player's last connection is closed, he does not leave the game, but goes offline.

You can kick player when he goes offline

```typescript
const players = new Players((con, name) => String(name));
players.on("offline", player => player.kick("disconnected"));
```

</td>
<td>

[src/Players.ts:294](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/Players.ts#L294)

</td>
</tr>
<tr>
<td>

`offline`

</td>
<td>

[]

</td>
<td>

player goes offline

**Example**

```typescript
player.on("offline", () => {
  console.log("player offline now!", player.name);
  console.assert(!player.online);
})
```

</td>
<td>

[src/Players.ts:316](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/Players.ts#L316)

</td>
</tr>
<tr>
<td>

`online`

</td>
<td>

[]

</td>
<td>

player goes online

**Example**

```typescript
player.on("online", () => {
  console.log("player online now!", player.name);
  console.assert(player.online);
})
```

</td>
<td>

[src/Players.ts:305](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/Players.ts#L305)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/Players.ts:273](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/Players.ts#L273)
