[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:api/network"](../README.md) / FetchResult

# Interface: FetchResult\<T\>

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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `body` | `BodyType`\[`T`\] | [src/modules.d.ts:835](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L835) |
| `headers` | `Record`\<`string`, `string`\> | [src/modules.d.ts:834](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L834) |
| `ok` | `boolean` | [src/modules.d.ts:829](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L829) |
| `redirected` | `boolean` | [src/modules.d.ts:832](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L832) |
| `status` | `number` | [src/modules.d.ts:833](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L833) |
| `statusText` | `string` | [src/modules.d.ts:831](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L831) |
| `type` | `string` | [src/modules.d.ts:830](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L830) |
| `url` | `string` | [src/modules.d.ts:828](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L828) |
