[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RpcEmitter

# Interface: RpcEmitter\<E\>

Methods to handle events of [RPCChannel](../variables/RPCChannel.md)

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`E`

</td>
</tr>
</tbody>
</table>

## Methods

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* `string` \| `number` \| `symbol`

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`eventName`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

`E`\[`T`\] *extends* `any`[] ? (`this`, ...`args`) => `void` : `never`

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* `string` \| `number` \| `symbol`

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`eventName`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

`E`\[`T`\] *extends* `any`[] ? (`this`, ...`args`) => `void` : `never`

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* `string` \| `number` \| `symbol`

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`eventName`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

`E`\[`T`\] *extends* `any`[] ? (`this`, ...`args`) => `void` : `never`

</td>
</tr>
</tbody>
</table>

#### Returns

`this`
