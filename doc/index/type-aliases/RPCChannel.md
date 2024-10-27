[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / RPCChannel

# Type Alias: RPCChannel\<M, E, S\>

> **RPCChannel**\<`M`, `E`, `S`\>: `M` *extends* `MetaScope`\<infer METHODS, infer EVENTS, infer STATE\> ? [`RpcInstance`](../interfaces/RpcInstance.md)\<`STATE`\> & `RpcMapper`\<`METHODS`, `EVENTS` & `RPCChannelEvents`\<`STATE`\>\> : [`RpcInstance`](../interfaces/RpcInstance.md)\<`S`\> & `RpcMapper`\<`M`, `E` & `RPCChannelEvents`\<`S`\>\>

## Type Parameters

• **M** = `any`

• **E** = `any`

• **S** = `undefined`

## Defined in

[src/RPCChannel.ts:119](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCChannel.ts#L119)
