[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / Players

# Class: Players

## Constructors

### new Players()

> **new Players**(`room`, `registerPlayerHandler`): [`Players`](Players.md)

Create a player list based on connections.

#### Parameters

• **room**: [`RoomSocketHandler`](RoomSocketHandler.md)

room

• **registerPlayerHandler**

handler to get the player's name.
- if handler returns or resolves a string - it will be the player's name
- if handler returns or resolves a null or undefined - the connection will be opened without a player
- if handler throws or rejects - the connection will be closed
- async handler will defer the connection

#### Returns

[`Players`](Players.md)

#### Examples

```typescript
const players = new Players(room, (connection, ...args) => String(args[0]));
```

```typescript
const players = new Players(room, async (connection, name, password) => {
  const permitted: boolean = await checkUser(name, password);
  if (!permitted) throw "wrong password";
  return name;
});
```

#### Defined in

[src/Players.ts:118](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L118)

## Accessors

### count

> `get` **count**(): `number`

get number of players

#### Returns

`number`

#### Defined in

[src/Players.ts:193](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L193)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<[`Player`](Player.md)\>

iterate on all players

#### Returns

`MapIterator`\<[`Player`](Player.md)\>

#### Defined in

[src/Players.ts:249](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L249)

***

### all()

> **all**(): `Set`\<[`Player`](Player.md)\>

get all players

#### Returns

`Set`\<[`Player`](Player.md)\>

#### Defined in

[src/Players.ts:208](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L208)

***

### get()

> **get**(`nameOrConnection`): `undefined` \| [`Player`](Player.md)

get player by name or connection

#### Parameters

• **nameOrConnection**: `string` \| [`Connection`](Connection.md)

name or connection

#### Returns

`undefined` \| [`Player`](Player.md)

#### Defined in

[src/Players.ts:184](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L184)

***

### getGroup()

> **getGroup**(`group`): `Set`\<[`Player`](Player.md)\>

get all players with specified group. If group is undefined - get all players without group.

#### Parameters

• **group**: `undefined` \| `string`

#### Returns

`Set`\<[`Player`](Player.md)\>

#### Defined in

[src/Players.ts:201](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L201)

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)

unsubscribe from event

#### Parameters

• **eventName**: `T`

"join", "leave", "online" or "offline"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/Players.ts:241](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L241)

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)

subscribe on event

#### Parameters

• **eventName**: `T`

"join", "leave", "online" or "offline"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/Players.ts:219](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L219)

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`PlayersEvents`](../type-aliases/PlayersEvents.md)

subscribe on event once

#### Parameters

• **eventName**: `T`

"join", "leave", "online" or "offline"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/Players.ts:230](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/Players.ts#L230)
