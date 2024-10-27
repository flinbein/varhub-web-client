[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / Player

# Class: Player

## Constructors

### new Player()

> **new Player**(`name`, `controller`): [`Player`](Player.md)

#### Parameters

• **name**: `string`

• **controller**: `any`

#### Returns

[`Player`](Player.md)

#### Defined in

[src/Players.ts:304](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L304)

## Accessors

### connections

> `get` **connections**(): `Set`\<[`Connection`](Connection.md)\>

get all player's connections

#### Returns

`Set`\<[`Connection`](Connection.md)\>

#### Defined in

[src/Players.ts:317](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L317)

***

### group

> `get` **group**(): `undefined` \| `string`

get player's group

> `set` **group**(`value`): `void`

set player's group

#### Parameters

• **value**: `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[src/Players.ts:329](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L329)

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

#### Defined in

[src/Players.ts:312](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L312)

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

#### Defined in

[src/Players.ts:321](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L321)

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

#### Defined in

[src/Players.ts:325](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L325)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](Connection.md)\>

#### Defined in

[src/Players.ts:388](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L388)

***

### kick()

> **kick**(`reason`): `void`

kick player and close all player's connections

#### Parameters

• **reason**: `null` \| `string` = `null`

#### Returns

`void`

#### Defined in

[src/Players.ts:373](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L373)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/Players.ts:377](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L377)

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

#### Defined in

[src/Players.ts:381](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L381)

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)

unsubscribe from event

#### Parameters

• **eventName**: `T`

"leave", "online" or "offline"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/Players.ts:364](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L364)

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)

subscribe on event

#### Parameters

• **eventName**: `T`

"leave", "online" or "offline"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/Players.ts:342](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L342)

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`PlayerEvents`](../type-aliases/PlayerEvents.md)

subscribe on event once

#### Parameters

• **eventName**: `T`

"leave", "online" or "offline"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/Players.ts:353](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/Players.ts#L353)
