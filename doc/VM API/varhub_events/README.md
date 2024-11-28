[**@flinbein/varhub-web-clent**](../../README.md)

***

[@flinbein/varhub-web-clent](../../README.md) / [VM API](../README.md) / varhub:events

# varhub:events

provides class [EventEmitter](classes/default.md)

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

**Example**

```javascript
import EventEmitter from "varhub:event";
const events = new EventEmitter();
events.on("message", (...args) => console.log(...args));
events.emit("message", 1, 2, 3);
```

</td>
</tr>
</tbody>
</table>
