[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCChannel

# Variable: RPCChannel()

> `const` **RPCChannel**: \<`M`\>(`client`, `options`?) => `M` *extends* `MetaScope`\<`METHODS`, `EVENTS`, `unknown`\> ? [`RPCChannel`](RPCChannel.md)\<`METHODS`, `EVENTS`, `undefined`\> : [`RPCChannel`](RPCChannel.md)\<`M`, `any`, `undefined`\>

Constructor for new RPC channel based on [VarhubClient](../classes/VarhubClient.md)

Create new channel for RPC

## Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`client`

</td>
<td>

[`VarhubClient`](../classes/VarhubClient.md)

</td>
<td>

varhub client. Client may not be ready.

</td>
</tr>
<tr>
<td>

`options`?

</td>
<td>

`object`

</td>
<td>

</td>
</tr>
<tr>
<td>

`options.key`?

</td>
<td>

`string`

</td>
<td>

default:`"$rpc"`

</td>
</tr>
</tbody>
</table>

## Returns

`M` *extends* `MetaScope`\<`METHODS`, `EVENTS`, `unknown`\> ? [`RPCChannel`](RPCChannel.md)\<`METHODS`, `EVENTS`, `undefined`\> : [`RPCChannel`](RPCChannel.md)\<`M`, `any`, `undefined`\>

- stateless channel.
- result extends [RPCInstance](../interfaces/RPCInstance.md).
- result extends [RpcEmitter](../interfaces/RpcEmitter.md) and can subscribe on events of current [RPCSource](../classes/RPCSource.md) of room
- result has all methods of current [RPCSource](../classes/RPCSource.md) in room.
- all methods are asynchronous and return a Promise<XJData>
- result has constructors for all constructable methods of [RPCSource](../classes/RPCSource.md) in room.
- all constructors are synchronous and return a new [RPCChannel](RPCChannel.md)

## Defined in

[src/RPCChannel.ts:121](https://github.com/flinbein/varhub-web-client/blob/a1652e820774a8313aee5216c904cce8bc3308f5/src/RPCChannel.ts#L121)
