[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:api/network"](../README.md) / NetworkApi

# Interface: NetworkApi

## Methods

### fetch()

> **fetch**\<`T`\>(`url`, `params`?): `Promise`\<[`FetchResult`](FetchResult.md)\<`T`\>\>

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

`T` *extends* keyof `BodyType`

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

`url`

</td>
<td>

`string`

</td>
</tr>
<tr>
<td>

`params`?

</td>
<td>

[`FetchParams`](../type-aliases/FetchParams.md)\<`T`\>

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<[`FetchResult`](FetchResult.md)\<`T`\>\>

#### Defined in

[src/modules.d.ts:798](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/modules.d.ts#L798)
