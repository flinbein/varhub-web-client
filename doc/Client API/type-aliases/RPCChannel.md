[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCChannel

# Type Alias: RPCChannel\<T\>

> **RPCChannel**\<`T`\>: `ExtractMetaType`\<`T`\> *extends* `object` ? `Disposable` & `MetaScope`\<`M`, `E`, `S`\> & `RPCChannelInstance`\<`S`\> & `RPCEventsPart`\<`E`, keyof [`RPCChannelEvents`](RPCChannelEvents.md)\<`any`\>\> & `RPCMethodsPart`\<`M`, `Exclude`\<keyof `RPCChannelInstance` \| `ExtraKeys`, `"notify"`\>\> : `never`

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

`T` *extends* `MetaScope` \| `MetaDesc`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>
