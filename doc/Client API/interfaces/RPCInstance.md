[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCInstance

# Interface: RPCInstance\<S\>

Methods and properties of [RPCChannel](../variables/RPCChannel.md)

## Extends

- `Disposable`

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

`S`

</td>
</tr>
</tbody>
</table>

## Properties

| Property | Type |
| ------ | ------ |
| `call` | (`path`: `string`[], ...`args`: `any`[]) => `Promise`\<`any`\> |
| `close` | (`reason`?: `string`) => `void` |
| `closed` | `boolean` |
| `create` | (`path`: `string`[], ...`args`: `any`[]) => [`RPCInstance`](RPCInstance.md)\<`any`\> & [`RpcEmitter`](RpcEmitter.md)\<`never`\> |
| `ready` | `boolean` |
| `state` | `S` |

## Methods

### \[dispose\]()

#### \[dispose\]()

> **\[dispose\]**(): `void`

##### Returns

`void`

##### Inherited from

`Disposable.[dispose]`

#### \[dispose\]()

> **\[dispose\]**(): `void`

##### Returns

`void`

##### Inherited from

`Disposable.[dispose]`

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `Promise`\<`R1` \| `R2`\>

#### Type Parameters

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

`R1`

</td>
<td>

[[`RPCInstance`](RPCInstance.md)\<`S`\>]

</td>
</tr>
<tr>
<td>

`R2`

</td>
<td>

`never`

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

`onfulfilled`?

</td>
<td>

`null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

</td>
</tr>
<tr>
<td>

`onrejected`?

</td>
<td>

`null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`R1` \| `R2`\>
