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

[src/modules.d.ts:561](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L561)

***

### connection

> `get` **connection**(): [`Connection`](../../varhub:room/interfaces/Connection.md)

get client's connection

#### Returns

[`Connection`](../../varhub:room/interfaces/Connection.md)

#### Defined in

[src/modules.d.ts:569](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L569)

***

### source

> `get` **source**(): `S`

get rpc source

#### Returns

`S`

#### Defined in

[src/modules.d.ts:565](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L565)

## Methods

### close()

> **close**(`reason`?): `void`

close this communication channel

#### Parameters

• **reason?**: `any`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:574](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L574)
