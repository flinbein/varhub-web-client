[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:players"](../README.md) / PlayerEvents

# Type Alias: PlayerEvents

> **PlayerEvents**: `object`

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

[[`Connection`](../../varhub:room/interfaces/Connection.md), `any`[]]

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

[src/modules.d.ts:412](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L412)

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

[src/modules.d.ts:380](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L380)

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

[src/modules.d.ts:402](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L402)

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

[src/modules.d.ts:391](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L391)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:359](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L359)
