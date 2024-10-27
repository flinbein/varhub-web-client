[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:rpc"](../README.md) / RPCSourceChannel

# Interface: RPCSourceChannel\<S\>

Communication channel established between client's RPCChannel and [RPCSource](../classes/default.md)

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Default type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`S`

</td>
<td>

[`default`](../classes/default.md)

</td>
</tr>
</tbody>
</table>

## Accessors

### closed

> `get` **closed**(): `boolean`

channel is closed

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:633](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L633)

***

### connection

> `get` **connection**(): [`Connection`](../../varhub:room/interfaces/Connection.md)

get client's connection

#### Returns

[`Connection`](../../varhub:room/interfaces/Connection.md)

#### Defined in

[src/modules.d.ts:641](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L641)

***

### source

> `get` **source**(): `S`

get rpc source

#### Returns

`S`

#### Defined in

[src/modules.d.ts:637](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L637)

## Methods

### close()

> **close**(`reason`?): `void`

close this communication channel

#### Parameters

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

`reason`?

</td>
<td>

`any`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`void`

#### Defined in

[src/modules.d.ts:646](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L646)
