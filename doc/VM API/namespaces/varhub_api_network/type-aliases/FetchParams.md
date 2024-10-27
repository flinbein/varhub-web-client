[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:api/network"](../README.md) / FetchParams

# Type Alias: FetchParams\<T\>

> **FetchParams**\<`T`\>: `object`

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
<th>Defined in</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`body`?

</td>
<td>

`string` \| `ArrayBuffer` \| ([`string`, `string`] \| [`string`, `FileJson`] \| [`string`, `ArrayBuffer`, `string`])[]

</td>
<td>

[src/modules.d.ts:918](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L918)

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

[src/modules.d.ts:920](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L920)

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

[src/modules.d.ts:917](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L917)

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

[src/modules.d.ts:916](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L916)

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

[src/modules.d.ts:921](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L921)

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

[src/modules.d.ts:919](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L919)

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

[src/modules.d.ts:922](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L922)

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

[src/modules.d.ts:923](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L923)

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

[src/modules.d.ts:915](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L915)

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:914](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L914)
