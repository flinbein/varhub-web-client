[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:rpc"](../README.md) / BoxMethods

# Type Alias: BoxMethods\<T, PREFIX\>

> **BoxMethods**\<`T`, `PREFIX`\>: \{ \[KEY in keyof T as KEY extends \`$\{PREFIX\}$\{infer NAME\}\` ? NAME : never\]: T\[KEY\] \}

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

`T`

</td>
</tr>
<tr>
<td>

`PREFIX` *extends* `string`

</td>
</tr>
</tbody>
</table>
