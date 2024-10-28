[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / Connection

# Class: Connection

Handler of room connection

## Accessors

### closed

> `get` **closed**(): `boolean`

connection closed

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:510](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L510)

***

### deferred

> `get` **deferred**(): `boolean`

connection is deferred

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:449](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L449)

***

### parameters

> `get` **parameters**(): `XJData`[]

get the parameters with which the connection was initialized

#### Returns

`XJData`[]

#### Defined in

[src/RoomSocketHandler.ts:442](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L442)

***

### ready

> `get` **ready**(): `boolean`

connection open

#### Returns

`boolean`

#### Defined in

[src/RoomSocketHandler.ts:503](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L503)

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

#### Defined in

[src/RoomSocketHandler.ts:573](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L573)

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

#### Defined in

[src/RoomSocketHandler.ts:477](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L477)

***

### open()

> **open**(): [`Connection`](Connection.md)

Allow the connection to connect

The connection is connected automatically if it has not been deferred.

#### Returns

[`Connection`](Connection.md)

#### Defined in

[src/RoomSocketHandler.ts:519](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L519)

***

### send()

> **send**(...`data`): [`Connection`](Connection.md)

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

[`Connection`](Connection.md)

#### Defined in

[src/RoomSocketHandler.ts:528](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L528)

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

[[`Connection`](Connection.md)]

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

#### Defined in

[src/RoomSocketHandler.ts:432](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L432)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/RoomSocketHandler.ts:577](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L577)

***

### valueOf()

> **valueOf**(): `number`

#### Returns

`number`

#### Defined in

[src/RoomSocketHandler.ts:581](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L581)

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

#### Defined in

[src/RoomSocketHandler.ts:564](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L564)

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

#### Defined in

[src/RoomSocketHandler.ts:540](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L540)

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

#### Defined in

[src/RoomSocketHandler.ts:552](https://github.com/flinbein/varhub-web-client/blob/aa083d0edbc5407bd7a683b04a67f4c55c217aa3/src/RoomSocketHandler.ts#L552)
