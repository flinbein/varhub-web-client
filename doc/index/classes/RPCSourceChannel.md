[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / RPCSourceChannel

# Class: RPCSourceChannel\<S\>

Communication channel established between the [RPCChannel](../type-aliases/RPCChannel.md) and [RPCSource](RPCSource.md)

## Type Parameters

• **S** = [`RPCSource`](RPCSource.md)

## Accessors

### closed

> `get` **closed**(): `boolean`

channel is closed

#### Returns

`boolean`

#### Defined in

[src/RPCSource.ts:75](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L75)

***

### connection

> `get` **connection**(): [`Connection`](Connection.md)

get client's connection

#### Returns

[`Connection`](Connection.md)

#### Defined in

[src/RPCSource.ts:83](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L83)

***

### source

> `get` **source**(): `S`

get rpc source

#### Returns

`S`

#### Defined in

[src/RPCSource.ts:79](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L79)

## Methods

### close()

> **close**(`reason`?): `void`

close this communication channel

#### Parameters

• **reason?**: `XJData`

#### Returns

`void`

#### Defined in

[src/RPCSource.ts:89](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L89)
