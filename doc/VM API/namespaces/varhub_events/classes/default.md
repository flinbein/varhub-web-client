[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:events"](../README.md) / default

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

> **emit**\<`T`\>(`event`, ...`args`): `boolean`

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

#### Defined in

[src/modules.d.ts:341](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/modules.d.ts#L341)

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

#### Defined in

[src/modules.d.ts:345](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/modules.d.ts#L345)

***

### off()

> **off**\<`T`\>(`event`, `handler`): `this`

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

`handler`

</td>
<td>

(...`args`) => `void`

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### Defined in

[src/modules.d.ts:340](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/modules.d.ts#L340)

***

### on()

> **on**\<`T`\>(`event`, `handler`): `this`

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

`handler`

</td>
<td>

(...`args`) => `void`

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### Defined in

[src/modules.d.ts:338](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/modules.d.ts#L338)

***

### once()

> **once**\<`T`\>(`event`, `handler`): `this`

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

`handler`

</td>
<td>

(...`args`) => `void`

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### Defined in

[src/modules.d.ts:339](https://github.com/flinbein/varhub-web-client/blob/b2c7452db78660a1bdfa3d020ebdb763c07db886/src/modules.d.ts#L339)
