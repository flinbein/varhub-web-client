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

[src/modules.d.ts:484](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L484)

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

[src/modules.d.ts:506](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L506)

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

[src/modules.d.ts:530](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L530)

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

[src/modules.d.ts:518](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L518)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:473](https://github.com/flinbein/varhub-web-client/blob/9db988520cfb0824522e6c6d1698d44de5ef3f92/src/modules.d.ts#L473)
