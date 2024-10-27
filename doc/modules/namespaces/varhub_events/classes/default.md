[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:events"](../README.md) / default

# Class: default\<M\>

## Type Parameters

• **M** *extends* `Record`\<`any`, `any`[]\>

## Constructors

### new default()

> **new default**\<`M`\>(): [`default`](default.md)\<`M`\>

#### Returns

[`default`](default.md)\<`M`\>

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

[src/modules.d.ts:296](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L296)

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

[src/modules.d.ts:295](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L295)

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

[src/modules.d.ts:293](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L293)

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

[src/modules.d.ts:294](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L294)
