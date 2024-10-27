[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / PlayersEvents

# Type Alias: PlayersEvents

> **PlayersEvents**: `object`

## Type declaration

### join

> **join**: [[`Player`](../classes/Player.md)]

new player joined

#### Example

```typescript
const players = new Players((con, name) => String(name));
players.on("join", (player) => {
  console.log("player joined:", player.name);
})
```

### leave

> **leave**: [[`Player`](../classes/Player.md)]

player leaves the game

#### Examples

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

### offline

> **offline**: [[`Player`](../classes/Player.md)]

player goes offline, last player's connection is closed.

#### Example

```typescript
const players = new Players((con, name) => String(name));
players.on("offline", (player) => {
  console.log("player offline now!", player.name);
  console.assert(!player.online);
})
```

### online

> **online**: [[`Player`](../classes/Player.md)]

player goes online

#### Example

```typescript
const players = new Players((con, name) => String(name));
players.on("online", (player) => {
  console.log("player online now!", player.name);
  console.assert(player.online);
})
```

## Defined in

[src/Players.ts:6](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Players.ts#L6)
