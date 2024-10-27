[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:events"](../README.md) / EventEmitter

# Class: EventEmitter\<M\>

## Type Parameters

• **M** *extends* `Record`\<`any`, `any`[]\>

## Constructors

### new EventEmitter()

> **new EventEmitter**\<`M`\>(): [`EventEmitter`](EventEmitter.md)\<`M`\>

#### Returns

[`EventEmitter`](EventEmitter.md)\<`M`\>

## Methods

### emit()

> **emit**\<`T`\>(`event`, ...`args`): `boolean`

#### Type Parameters

• **T** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `T`

• ...**args**: `M`\[`T`\]

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:296](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L296)

***

### off()

> **off**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `T`

• **handler**

#### Returns

`this`

#### Defined in

[src/modules.d.ts:295](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L295)

***

### on()

> **on**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `T`

• **handler**

#### Returns

`this`

#### Defined in

[src/modules.d.ts:293](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L293)

***

### once()

> **once**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* `string` \| `number` \| `symbol`

#### Parameters

• **event**: `T`

• **handler**

#### Returns

`this`

#### Defined in

[src/modules.d.ts:294](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L294)
