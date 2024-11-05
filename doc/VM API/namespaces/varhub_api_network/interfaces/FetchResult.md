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

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `body` | `BodyType`\[`T`\] | response body if request type is `"json"` returns json object; if request type is `"text"` returns `string`; if request type is `"arrayBuffer"` returns ArrayBuffer; if request type is `"formData"` returns `Array`<[name: `string`, value: `string`|[FileJson](FileJson.md)]>; | [src/modules.d.ts:931](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L931) |
| `headers` | `Record`\<`string`, `string`\> | The headers object associated with the response. | [src/modules.d.ts:919](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L919) |
| `ok` | `boolean` | A boolean indicating whether the response was successful (status in the range 200 – 299) or not. | [src/modules.d.ts:899](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L899) |
| `redirected` | `boolean` | Indicates whether or not the response is the result of a redirect (that is, its URL list has more than one entry). | [src/modules.d.ts:911](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L911) |
| `status` | `number` | response status | [src/modules.d.ts:915](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L915) |
| `statusText` | `string` | The status message corresponding to the status code. (e.g., OK for 200). | [src/modules.d.ts:907](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L907) |
| `type` | `string` | **See** [Response.type](https://developer.mozilla.org/en-US/docs/Web/API/Response/type) | [src/modules.d.ts:903](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L903) |
| `url` | `string` | - | [src/modules.d.ts:895](https://github.com/flinbein/varhub-web-client/blob/7d6a2e3812e654c01a487ef0fcd6a83839993854/src/modules.d.ts#L895) |
