[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:players](../README.md) / PlayerEvents

# Type Alias: PlayerEvents\<ROOM_DESC\>

> **PlayerEvents**\<`ROOM_DESC`\>: `object`

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

`ROOM_DESC` *extends* [`RoomDesc`](../../varhub:room/type-aliases/RoomDesc.md)

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

`connectionMessage`

</td>
<td>

[[`Connection`](../../varhub:room/interfaces/Connection.md)\<`ROOM_DESC`\>, `ROOM_DESC` *extends* `object` ? `T` : `any`[]]

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
</tr>
</tbody>
</table>
