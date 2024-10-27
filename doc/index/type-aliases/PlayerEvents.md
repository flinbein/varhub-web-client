[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / PlayerEvents

# Type Alias: PlayerEvents

> **PlayerEvents**: `object`

## Type declaration

### leave

> **leave**: []

player leaves the game

#### Examples

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

### offline

> **offline**: []

player goes offline

#### Example

```typescript
player.on("offline", () => {
  console.log("player offline now!", player.name);
  console.assert(!player.online);
})
```

### online

> **online**: []

player goes online

#### Example

```typescript
player.on("online", () => {
  console.log("player online now!", player.name);
  console.assert(player.online);
})
```

## Defined in

[src/Players.ts:255](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Players.ts#L255)
