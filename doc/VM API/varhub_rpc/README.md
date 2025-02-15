[**@flinbein/varhub-web-clent**](../../README.md)

***

[@flinbein/varhub-web-clent](../../README.md) / [VM API](../README.md) / varhub:rpc

# varhub:rpc

provides class [RPCSource](classes/default.md) that allows you to handle remote procedure calls

## Example

```javascript
import room from "varhub:room";
import RPCSource from "varhub:rpc";

const mathSource = new RPCSource({
  sum: (x, y) => x + y,
  mul: (x, y) => x * y,
})
RPCSource.start(mathSource, room);
```

## Index

### Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[default](classes/default.md)

</td>
<td>

Remote procedure call handler

</td>
</tr>
</tbody>
</table>

### Type Aliases

<table>
<thead>
<tr>
<th>Type alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[BoxMethods](type-aliases/BoxMethods.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[DeepIterable](type-aliases/DeepIterable.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[EventPath](type-aliases/EventPath.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[EventPathArgs](type-aliases/EventPathArgs.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[MetaScopeValue](type-aliases/MetaScopeValue.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[RestParams](type-aliases/RestParams.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[RPCHandler](type-aliases/RPCHandler.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
