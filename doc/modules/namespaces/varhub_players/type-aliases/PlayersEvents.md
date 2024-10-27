[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:players"](../README.md) / PlayersEvents

# Type Alias: PlayersEvents

> **PlayersEvents**: `object`

## Type declaration

### join

> **join**: [[`Player`](../interfaces/Player.md)]

new player joined

#### Example

```typescript
const players = new Players((con, name) => String(name));
players.on("join", (player) => {
  console.log("player joined:", player.name);
})
```

### leave

> **leave**: [[`Player`](../interfaces/Player.md)]

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

> **offline**: [[`Player`](../interfaces/Player.md)]

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

> **online**: [[`Player`](../interfaces/Player.md)]

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

[src/modules.d.ts:412](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L412)