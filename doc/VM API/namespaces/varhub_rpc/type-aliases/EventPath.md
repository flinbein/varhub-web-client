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

[src/modules.d.ts:623](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/modules.d.ts#L623)