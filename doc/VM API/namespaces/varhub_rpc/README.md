[**@flinbein/varhub-web-clent**](../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / "varhub:rpc"

# "varhub:rpc"

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

### Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[RPCSourceChannel](interfaces/RPCSourceChannel.md)

</td>
<td>

Communication channel established between client's RPCChannel and [RPCSource](classes/default.md)

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

[RPCHandler](type-aliases/RPCHandler.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

### Events

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

[RPCSourceEvents](type-aliases/RPCSourceEvents.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
