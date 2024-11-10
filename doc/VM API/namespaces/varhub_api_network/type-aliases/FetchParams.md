[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:api/network"](../README.md) / FetchParams

# Type Alias: FetchParams\<T\>

> **FetchParams**\<`T`\>: `object`

options that can be used to configure a fetch request.

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

`T` *extends* keyof `BodyType`

</td>
<td>

keyof `BodyType`

</td>
</tr>
</tbody>
</table>

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`body`?

</td>
<td>

[`FetchRequestBody`](FetchRequestBody.md)

</td>
<td>

request body. Empty by default.

</td>
</tr>
<tr>
<td>

`credentials`?

</td>
<td>

`RequestInit`\[`"credentials"`\]

</td>
<td>

**See**

[RequestInit.credentials](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#credentials)

</td>
</tr>
<tr>
<td>

`headers`?

</td>
<td>

`Record`\<`string`, `string`\>

</td>
<td>

add custom headers to the request

</td>
</tr>
<tr>
<td>

`method`?

</td>
<td>

`RequestInit`\[`"method"`\]

</td>
<td>

http method. `GET` by default

</td>
</tr>
<tr>
<td>

`mode`?

</td>
<td>

`RequestInit`\[`"mode"`\]

</td>
<td>

**See**

[RequestInit.mode](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#mode)

</td>
</tr>
<tr>
<td>

`redirect`?

</td>
<td>

`RequestInit`\[`"redirect"`\]

</td>
<td>

**See**

[RequestInit.redirect](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#redirect)

</td>
</tr>
<tr>
<td>

`referrer`?

</td>
<td>

`RequestInit`\[`"referrer"`\]

</td>
<td>

**See**

[RequestInit.referrer](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrer)

</td>
</tr>
<tr>
<td>

`referrerPolicy`?

</td>
<td>

`RequestInit`\[`"referrerPolicy"`\]

</td>
<td>

**See**

[RequestInit.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrerpolicy)

</td>
</tr>
<tr>
<td>

`type`?

</td>
<td>

`T`

</td>
<td>

`"json"|"text"|"arrayBuffer"|"formData"`. By default, it will define using header content-type

</td>
</tr>
</tbody>
</table>
