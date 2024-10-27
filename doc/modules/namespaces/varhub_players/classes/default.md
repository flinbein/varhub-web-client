[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:players"](../README.md) / default

# Class: default

## Constructors

### new default()

> **new default**(`room`, `registerPlayerHandler`): [`default`](default.md)

Create a player list based on connections.

#### Parameters

• **room**: [`Room`](../../varhub:room/interfaces/Room.md)

room

• **registerPlayerHandler**

handler to get the player's name.
- if handler returns or resolves a string - it will be the player's name
- if handler returns or resolves a null or undefined - the connection will be opened without a player
- if handler throws or rejects - the connection will be closed
- async handler will defer the connection

#### Returns

[`default`](default.md)

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

[src/modules.d.ts:494](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L494)

## Accessors

### count

> `get` **count**(): `number`

get number of players

#### Returns

`number`

#### Defined in

[src/modules.d.ts:504](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L504)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<[`Player`](../interfaces/Player.md)\>

iterate on all players

#### Returns

`MapIterator`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:541](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L541)

***

### all()

> **all**(): `Set`\<[`Player`](../interfaces/Player.md)\>

get all players

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:513](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L513)

***

### get()

> **get**(`nameOrConnection`): `undefined` \| [`Player`](../interfaces/Player.md)

get player by name or connection

#### Parameters

• **nameOrConnection**: `string` \| [`Connection`](../../varhub:room/interfaces/Connection.md)

name or connection

#### Returns

`undefined` \| [`Player`](../interfaces/Player.md)

#### Defined in

[src/modules.d.ts:499](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L499)

***

### getGroup()

> **getGroup**(`group`): `Set`\<[`Player`](../interfaces/Player.md)\>

get all players with specified group. If group is undefined - get all players without group.

#### Parameters

• **group**: `undefined` \| `string`

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:509](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L509)

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

[src/modules.d.ts:537](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L537)

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

[src/modules.d.ts:521](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L521)

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

[src/modules.d.ts:529](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L529)
