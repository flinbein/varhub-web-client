[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:api/network"](../README.md) / FetchResult

# Interface: FetchResult\<T\>

represents the response to a fetch request.

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

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| `body` | `BodyType`\[`T`\] | response body if request type is `"json"` returns json object; if request type is `"text"` returns `string`; if request type is `"arrayBuffer"` returns ArrayBuffer; if request type is `"formData"` returns `Array`<[name: `string`, value: `string`|[FileJson](FileJson.md)]>; |
| `headers` | `Record`\<`string`, `string`\> | The headers object associated with the response. |
| `ok` | `boolean` | A boolean indicating whether the response was successful (status in the range 200 – 299) or not. |
| `redirected` | `boolean` | Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry). |
| `status` | `number` | response status |
| `statusText` | `string` | The status message corresponding to the status code. (e.g., OK for 200). |
| `type` | `string` | **See** [Response.type](https://developer.mozilla.org/en-US/docs/Web/API/Response/type) |
| `url` | `string` | - |
