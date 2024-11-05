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
<th>Defined in</th>
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
<td>

[src/modules.d.ts:868](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L868)

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
<td>

[src/modules.d.ts:876](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L876)

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
<td>

[src/modules.d.ts:864](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L864)

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
<td>

[src/modules.d.ts:860](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L860)

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
<td>

[src/modules.d.ts:880](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L880)

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
<td>

[src/modules.d.ts:872](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L872)

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
<td>

[src/modules.d.ts:884](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L884)

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
<td>

[src/modules.d.ts:888](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L888)

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
<td>

[src/modules.d.ts:856](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L856)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:852](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L852)
