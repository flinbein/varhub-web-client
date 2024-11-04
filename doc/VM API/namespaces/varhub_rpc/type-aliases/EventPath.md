[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:rpc"](../README.md) / EventPath

# Type Alias: EventPath\<T, K\>

> **EventPath**\<`T`, `K`\>: `K` *extends* `string` ? `T`\[`K`\] *extends* `any`[] ? `K` \| [`K`] : [`K`, ...(EventPath\<T\[K\]\> extends infer NEXT extends (...) \| (...) ? NEXT extends (...)\[\] ? NEXT : \[(...)\] : never)] : `never`

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

`T`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`K` *extends* keyof `T`

</td>
<td>

keyof `T`

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:624](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L624)
