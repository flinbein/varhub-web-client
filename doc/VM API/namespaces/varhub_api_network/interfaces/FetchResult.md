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
| `body` | `BodyType`\[`T`\] | [src/modules.d.ts:934](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L934) |
| `headers` | `Record`\<`string`, `string`\> | [src/modules.d.ts:933](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L933) |
| `ok` | `boolean` | [src/modules.d.ts:928](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L928) |
| `redirected` | `boolean` | [src/modules.d.ts:931](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L931) |
| `status` | `number` | [src/modules.d.ts:932](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L932) |
| `statusText` | `string` | [src/modules.d.ts:930](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L930) |
| `type` | `string` | [src/modules.d.ts:929](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L929) |
| `url` | `string` | [src/modules.d.ts:927](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L927) |
