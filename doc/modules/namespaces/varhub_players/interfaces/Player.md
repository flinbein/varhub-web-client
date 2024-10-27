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

[src/modules.d.ts:358](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L358)

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

[src/modules.d.ts:371](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L371)

***

### name

> `get` **name**(): `string`

player's name

#### Returns

`string`

#### Defined in

[src/modules.d.ts:354](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L354)

***

### online

> `get` **online**(): `boolean`

player is online (has at least one opened connection)

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:363](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L363)

***

### registered

> `get` **registered**(): `boolean`

player is registered in list of players

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:367](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L367)

## Methods

### \[iterator\]()

> **\[iterator\]**(): `SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

iterate on all player's connections

#### Returns

`SetIterator`\<[`Connection`](../../varhub:room/interfaces/Connection.md)\>

#### Defined in

[src/modules.d.ts:411](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L411)

***

### kick()

> **kick**(`reason`?): `void`

kick player and close all player's connections

#### Parameters

• **reason?**: `null` \| `string`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:404](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L404)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:405](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L405)

***

### valueOf()

> **valueOf**(): `string`

#### Returns

`string`

#### Defined in

[src/modules.d.ts:406](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L406)

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

[src/modules.d.ts:399](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L399)

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

[src/modules.d.ts:383](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L383)

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

[src/modules.d.ts:391](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L391)
