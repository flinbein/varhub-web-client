[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / RPCChannel

# Variable: RPCChannel()

> `const` **RPCChannel**: \<`M`\>(`client`, `options`?) => `M` *extends* `MetaScope`\<`METHODS`, `EVENTS`, `unknown`\> ? [`RPCChannel`](../type-aliases/RPCChannel.md)\<`METHODS`, `EVENTS`, `undefined`\> : [`RPCChannel`](../type-aliases/RPCChannel.md)\<`M`, `any`, `undefined`\>

Constructor for new RPC channel

Create new channel for RPC

## Parameters

• **client**: [`VarhubClient`](../classes/VarhubClient.md)

varhub client. Client may not be ready.

• **options?**

• **options.key?**: `string`

Default: `"$rpc"`

## Returns

`M` *extends* `MetaScope`\<`METHODS`, `EVENTS`, `unknown`\> ? [`RPCChannel`](../type-aliases/RPCChannel.md)\<`METHODS`, `EVENTS`, `undefined`\> : [`RPCChannel`](../type-aliases/RPCChannel.md)\<`M`, `any`, `undefined`\>

- stateless channel

## Defined in

[src/RPCChannel.ts:119](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/RPCChannel.ts#L119)
