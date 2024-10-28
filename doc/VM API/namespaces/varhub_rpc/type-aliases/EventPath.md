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

[src/modules.d.ts:623](https://github.com/flinbein/varhub-web-client/blob/5e789e48d34c1b3a28fc8322cbb077cc651a1ead/src/modules.d.ts#L623)
