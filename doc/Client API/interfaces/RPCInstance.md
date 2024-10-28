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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `call` | (`path`: `string`[], ...`args`: `any`[]) => `Promise`\<`any`\> | [src/RPCChannel.ts:93](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RPCChannel.ts#L93) |
| `close` | (`reason`?: `string`) => `void` | [src/RPCChannel.ts:95](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RPCChannel.ts#L95) |
| `closed` | `boolean` | [src/RPCChannel.ts:92](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RPCChannel.ts#L92) |
| `create` | (`path`: `string`[], ...`args`: `any`[]) => [`RPCInstance`](RPCInstance.md)\<`any`\> & [`RpcEmitter`](RpcEmitter.md)\<`never`\> | [src/RPCChannel.ts:94](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RPCChannel.ts#L94) |
| `ready` | `boolean` | [src/RPCChannel.ts:91](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RPCChannel.ts#L91) |
| `state` | `S` | [src/RPCChannel.ts:96](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RPCChannel.ts#L96) |

## Methods

### \[dispose\]()

#### \[dispose\]()

> **\[dispose\]**(): `void`

##### Returns

`void`

##### Inherited from

`Disposable.[dispose]`

##### Defined in

node\_modules/typescript/lib/lib.esnext.disposable.d.ts:36

#### \[dispose\]()

> **\[dispose\]**(): `void`

##### Returns

`void`

##### Inherited from

`Disposable.[dispose]`

##### Defined in

node\_modules/@types/node/globals.d.ts:282

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

#### Defined in

[src/RPCChannel.ts:87](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RPCChannel.ts#L87)