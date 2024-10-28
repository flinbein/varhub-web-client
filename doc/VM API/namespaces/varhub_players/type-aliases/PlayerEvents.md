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

[src/modules.d.ts:379](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L379)

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

[src/modules.d.ts:401](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L401)

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

[src/modules.d.ts:390](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L390)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:358](https://github.com/flinbein/varhub-web-client/blob/9ecf9faa0473dfd9f06f675501d3dfc1416cf094/src/modules.d.ts#L358)
