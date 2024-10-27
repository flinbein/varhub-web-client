[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:players"](../README.md) / Player

# Interface: Player

## Accessors

### connections

> `get` **connections**(): `Set`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

get all player's connections

#### Returns

`Set`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

#### Defined in

[src/modules.d.ts:355](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L355)

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

[src/modules.d.ts:368](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L368)

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

#### Defined in

[src/modules.d.ts:351](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L351)

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:360](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L360)

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:364](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L364)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

#### Defined in

[src/modules.d.ts:408](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L408)

***

### kick()

> **kick**(`reason`?): `void`

kick player and close all player's connections

#### Parameters

• **reason?**: `null` \| `string`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:401](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L401)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:402](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L402)

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:403](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L403)

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

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

[src/modules.d.ts:396](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L396)

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

[src/modules.d.ts:380](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L380)

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

[src/modules.d.ts:388](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L388)
