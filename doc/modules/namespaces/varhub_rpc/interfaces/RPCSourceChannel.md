[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:rpc"](../README.md) / RPCSourceChannel

# Interface: RPCSourceChannel\<S\>

Communication channel established between client's RPCChannel and [RPCSource](../classes/default.md)

## Type Parameters

• **S** = [`default`](../classes/default.md)

## Accessors

### closed

> `get` **closed**(): `boolean`

channel is closed

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:558](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L558)

***

### connection

> `get` **connection**(): [`Connection`](../../varhub:room/interfaces/Connection.md)

get client's connection

#### Returns

[`Connection`](../../varhub:room/interfaces/Connection.md)

#### Defined in

[src/modules.d.ts:566](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L566)

***

### source

> `get` **source**(): `S`

get rpc source

#### Returns

`S`

#### Defined in

[src/modules.d.ts:562](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L562)

## Methods

### close()

> **close**(`reason`?): `void`

close this communication channel

#### Parameters

• **reason?**: `any`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:571](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L571)
