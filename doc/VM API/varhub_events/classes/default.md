[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:events](../README.md) / default

# Class: default\<M\>

## Example

```javascript
import EventEmitter from "varhub:event";
const events = new EventEmitter();
events.on("message", (...args) => console.log(...args));
events.emit("message", 1, 2, 3);
```

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

`M` *extends* `Record`\<`any`, `any`[]\>

</td>
</tr>
</tbody>
</table>

## Constructors

### new default()

> **new default**\<`M`\>(): [`default`](default.md)\<`M`\>

#### Returns

[`default`](default.md)\<`M`\>

## Methods

### emit()

> **emit**\<`E`\>(`event`, ...`args`): `boolean`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`E` *extends* `string` \| `number` \| `symbol`

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`event`

</td>
<td>

`E`

</td>
</tr>
<tr>
<td>

...`args`

</td>
<td>

`M`\[`E`\]

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

***

### emitWithTry()

> **emitWithTry**\<`T`\>(`event`, ...`args`): `boolean`

like EventEmitter#emit, but ignore handler errors

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* `string` \| `number` \| `symbol`

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`event`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

...`args`

</td>
<td>

`M`\[`T`\]

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

***

### off()

> **off**\<`E`, `T`\>(`this`, `event`, `handler`): `T`

#### Type Parameters

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

`E` *extends* `string` \| `number` \| `symbol`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`T`

</td>
<td>

[`default`](default.md)\<`M`\>

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`this`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

`event`

</td>
<td>

`E`

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
</tr>
</tbody>
</table>

#### Returns

`T`

***

### on()

> **on**\<`E`, `T`\>(`this`, `event`, `handler`): `T`

#### Type Parameters

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

`E` *extends* `string` \| `number` \| `symbol`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`T`

</td>
<td>

[`default`](default.md)\<`M`\>

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`this`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

`event`

</td>
<td>

`E`

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
</tr>
</tbody>
</table>

#### Returns

`T`

***

### once()

> **once**\<`E`, `T`\>(`this`, `event`, `handler`): `T`

#### Type Parameters

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

`E` *extends* `string` \| `number` \| `symbol`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`T`

</td>
<td>

[`default`](default.md)\<`M`\>

</td>
</tr>
</tbody>
</table>

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`this`

</td>
<td>

`T`

</td>
</tr>
<tr>
<td>

`event`

</td>
<td>

`E`

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
</tr>
</tbody>
</table>

#### Returns

`T`
