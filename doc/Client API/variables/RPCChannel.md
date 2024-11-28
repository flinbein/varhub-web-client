[**@flinbein/varhub-web-clent**](../../README.md)

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCChannel

# Variable: RPCChannel()

> **RPCChannel**: \<`M`\>(`client`, `options`?) => [`RPCChannel`](../type-aliases/RPCChannel.md)\<`M`\>

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

[`VarhubClient`](../classes/VarhubClient.md)\<`object`\>

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

\{`key`: `string`; \}

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

[`RPCChannel`](../type-aliases/RPCChannel.md)\<`M`\>

- stateless channel.
- result extends RPCChannelInstance.
- result has all methods of current [RPCSource](../classes/RPCSource.md) in room.
- all methods are asynchronous and return a Promise<XJData>
- result has constructors for all constructable methods of [RPCSource](../classes/RPCSource.md) in room.
- all constructors are synchronous and return a new [RPCChannel](RPCChannel.md)
