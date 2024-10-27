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

[src/modules.d.ts:497](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L497)

## Accessors

### count

> `get` **count**(): `number`

get number of players

#### Returns

`number`

#### Defined in

[src/modules.d.ts:507](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L507)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<[`Player`](../interfaces/Player.md)\>

iterate on all players

#### Returns

`MapIterator`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:544](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L544)

***

### all()

> **all**(): `Set`\<[`Player`](../interfaces/Player.md)\>

get all players

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:516](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L516)

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

[src/modules.d.ts:502](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L502)

***

### getGroup()

> **getGroup**(`group`): `Set`\<[`Player`](../interfaces/Player.md)\>

get all players with specified group. If group is undefined - get all players without group.

#### Parameters

• **group**: `undefined` \| `string`

#### Returns

`Set`\<[`Player`](../interfaces/Player.md)\>

#### Defined in

[src/modules.d.ts:512](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L512)

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

[src/modules.d.ts:540](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L540)

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

[src/modules.d.ts:524](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L524)

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

[src/modules.d.ts:532](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L532)
