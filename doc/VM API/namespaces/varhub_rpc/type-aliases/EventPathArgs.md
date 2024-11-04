[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:rpc"](../README.md) / EventPathArgs

# Type Alias: EventPathArgs\<PATH, FORM\>

> **EventPathArgs**\<`PATH`, `FORM`\>: `PATH` *extends* keyof `FORM` ? `FORM`\[`PATH`\] *extends* `any`[] ? `FORM`\[`PATH`\] : `never` : `PATH` *extends* [] ? `FORM` *extends* `any`[] ? `FORM` : `never` : `PATH` *extends* [infer STEP, `...(infer TAIL extends string[])`] ? `STEP` *extends* keyof `FORM` ? [`EventPathArgs`](EventPathArgs.md)\<`TAIL`, `FORM`\[`STEP`\]\> : `never` : `never`

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`PATH`

</td>
</tr>
<tr>
<td>

`FORM`

</td>
</tr>
</tbody>
</table>

## Defined in

[src/modules.d.ts:625](https://github.com/flinbein/varhub-web-client/blob/e65e01813e5de867041177e674157476c2502975/src/modules.d.ts#L625)
