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

[src/modules.d.ts:635](https://github.com/flinbein/varhub-web-client/blob/4b277cc940da1f35f3cf26aba33bb11aae1725b5/src/modules.d.ts#L635)
