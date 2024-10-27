[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCSourceChannel

# Class: RPCSourceChannel\<S\>

Communication channel established between the [RPCChannel](../variables/RPCChannel.md) and [RPCSource](RPCSource.md)

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

[`RPCSource`](RPCSource.md)

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

[src/RPCSource.ts:87](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L87)

***

### connection

> `get` **connection**(): [`Connection`](Connection.md)

get client's connection

#### Returns

[`Connection`](Connection.md)

#### Defined in

[src/RPCSource.ts:95](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L95)

***

### source

> `get` **source**(): `S`

get rpc source

#### Returns

`S`

#### Defined in

[src/RPCSource.ts:91](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L91)

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

`XJData`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`void`

#### Defined in

[src/RPCSource.ts:101](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/RPCSource.ts#L101)
