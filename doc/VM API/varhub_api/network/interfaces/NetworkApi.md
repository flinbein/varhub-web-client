[**@flinbein/varhub-web-clent**](../../../../README.md)

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / [varhub:api/network](../README.md) / NetworkApi

# Interface: NetworkApi

## Methods

### fetch()

> **fetch**\<`T`\>(`url`, `params`?): `Promise`\<[`FetchResult`](FetchResult.md)\<`T`\>\>

customized fetch function

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
<th>Description</th>
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
<td>

url to fetch as string

</td>
</tr>
<tr>
<td>

`params`?

</td>
<td>

[`FetchParams`](../type-aliases/FetchParams.md)\<`T`\>

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<[`FetchResult`](FetchResult.md)\<`T`\>\>

- Promise<[FetchResult](FetchResult.md)>

#### See

 - [RequestInit.redirect](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#redirect)
 - [RequestInit.credentials](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#credentials)
 - [RequestInit.mode](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#mode)
 - [RequestInit.referrer](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrer)
 - [RequestInit.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrerpolicy)
