[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCHandler

# Type Alias: RPCHandler()

> **RPCHandler**: (`connection`, `path`, `args`, `openChannel`) => `XJData` \| `Promise`\<`XJData`\> \| [`RPCSource`](../classes/RPCSource.md)

remote call handler for [RPCSource](../classes/RPCSource.md)

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

`connection`

</td>
<td>

[`Connection`](../classes/Connection.md)

</td>
<td>

client's connection

</td>
</tr>
<tr>
<td>

`path`

</td>
<td>

`string`[]

</td>
<td>

path of remote function.
For example, when client call `rpc.math.sum(1, 2)` path will be `["math", "summ"]`.

</td>
</tr>
<tr>
<td>

`args`

</td>
<td>

`XJData`[]

</td>
<td>

arguments with which the remote function was called
For example, when client call `rpc.math.sum(1, 2)` args will be `[1, 2]`.

</td>
</tr>
<tr>
<td>

`openChannel`

</td>
<td>

`boolean`

</td>
<td>

true if the client called rpc as constructor (with `new`).
In this case the handler must return a [RPCSource](../classes/RPCSource.md) or Promise<[RPCSource](../classes/RPCSource.md)>.

</td>
</tr>
</tbody>
</table>

## Returns

`XJData` \| `Promise`\<`XJData`\> \| [`RPCSource`](../classes/RPCSource.md)

## Defined in

[src/RPCSource.ts:15](https://github.com/flinbein/varhub-web-client/blob/abccc7889bafc435c87bb6b71784735c5faeff42/src/RPCSource.ts#L15)
