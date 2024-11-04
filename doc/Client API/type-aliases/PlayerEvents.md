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

[src/Players.ts:286](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/Players.ts#L286)

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

[src/Players.ts:308](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/Players.ts#L308)

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

[src/Players.ts:297](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/Players.ts#L297)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/Players.ts:265](https://github.com/flinbein/varhub-web-client/blob/f2cfd0691254d5f14825d895a437ee15531fc39c/src/Players.ts#L265)
