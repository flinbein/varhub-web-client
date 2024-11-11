[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / Connection

# Class: Connection\<DESC\>

Handler of room connection

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

`DESC` *extends* `object`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| `data?` | `DESC` *extends* `object` ? `T` : `any` | custom data for this connection |

## Accessors

### closed

> `get` **closed**(): `boolean`

connection closed

#### Returns

`boolean`

***

### deferred

> `get` **deferred**(): `boolean`

connection is deferred

#### Returns

`boolean`

***

### parameters

> `get` **parameters**(): `XJData`[]

get the parameters with which the connection was initialized

#### Returns

`XJData`[]

***

### ready

> `get` **ready**(): `boolean`

connection open

#### Returns

`boolean`

## Methods

### close()

> **close**(`reason`?): `void`

close client's connection

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`reason`?

</td>
<td>

`null` \| `string`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`void`

***

### defer()

> **defer**\<`T`, `A`\>(`handler`, ...`args`): `T`

defer connection establishment.
Use this method if you need to perform an asynchronous check to get permission to connect.

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

`T`

</td>
</tr>
<tr>
<td>

`A` *extends* `any`[]

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`handler`

</td>
<td>

(`this`, `connection`, ...`args`) => `T`

</td>
<td>

If the handler completes or resolves successfully, the connection will be opened.
- If the handler throws or rejects an error, the connection will be closed with this error.
- You can close the connection earlier by calling `connection.close(reason)`.
- You can open the connection earlier by calling `connection.open()`.

</td>
</tr>
<tr>
<td>

...`args`

</td>
<td>

`A`

</td>
<td>

additional arguments for handler

</td>
</tr>
</tbody>
</table>

#### Returns

`T`

the result of handler or throws error

#### Example

```typescript
room.on("connection", (connection, ...args) => {
  void connection.defer(checkConnection, ...args);
  console.assert(connection.deferred);
  console.assert(!connection.ready);
  console.assert(!connection.closed);
})
async function checkConnection(connection, ...args) {
  const permitted: boolean = await checkConnectionPermits(connection, args);
  if (!permitted) connection.close("not permitted"); // or throw error
}
```

***

### open()

> **open**(): [`Connection`](Connection.md)\<`DESC`\>

Allow the connection to connect

The connection is connected automatically if it has not been deferred.

#### Returns

[`Connection`](Connection.md)\<`DESC`\>

***

### send()

> **send**(...`data`): [`Connection`](Connection.md)\<`DESC`\>

send data to connection

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

...`data`

</td>
<td>

`XJData`[]

</td>
<td>

any serializable arguments

</td>
</tr>
</tbody>
</table>

#### Returns

[`Connection`](Connection.md)\<`DESC`\>

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `PromiseLike`\<`R1` \| `R2`\>

Promise like for events "open", "error"
### Using in async context

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

`R1`

</td>
<td>

[[`Connection`](Connection.md)\<`DESC`\>]

</td>
</tr>
<tr>
<td>

`R2`

</td>
<td>

`never`

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`onfulfilled`?

</td>
<td>

`null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

</td>
<td>

</td>
</tr>
<tr>
<td>

`onrejected`?

</td>
<td>

`null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`PromiseLike`\<`R1` \| `R2`\>

#### Examples

```typescript
try {
  await connection;
  console.log("client connected");
} catch (error) {
  console.log("connection error");
}
```
### Using in sync context

```
connection.then(([connection]) => {
  console.log("client connected");
});
```

***

### toString()

> **toString**(): `string`

#### Returns

`string`

***

### valueOf()

> **valueOf**(): `number`

#### Returns

`number`

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* keyof [`ConnectionEvents`](../type-aliases/ConnectionEvents.md)

</td>
<td>

unsubscribe from event

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`eventName`

</td>
<td>

`T`

</td>
<td>

"message", "open" or "close"

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(...`args`) => `void`

</td>
<td>

event handler

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* keyof [`ConnectionEvents`](../type-aliases/ConnectionEvents.md)

</td>
<td>

subscribe on event

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`eventName`

</td>
<td>

`T`

</td>
<td>

"message", "open" or "close"

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(...`args`) => `void`

</td>
<td>

event handler

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`T` *extends* keyof [`ConnectionEvents`](../type-aliases/ConnectionEvents.md)

</td>
<td>

subscribe on event once

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`eventName`

</td>
<td>

`T`

</td>
<td>

"message", "open" or "close"

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(...`args`) => `void`

</td>
<td>

event handler

</td>
</tr>
</tbody>
</table>

#### Returns

`this`
