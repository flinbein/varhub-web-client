[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / VarhubClient

# Class: VarhubClient

Represents a user-controlled connection to the room;

## Example

```typescript
import { Varhub } from "@flinbein/varhub-web-client";

const hub = new Varhub("https://example.com");
const client: VarhubClient = hub.join(roomId);
await client;
client.send("some message");
```

## Accessors

### closed

> `get` **closed**(): `boolean`

client's connection is closed

#### Returns

`boolean`

***

### ready

> `get` **ready**(): `boolean`

client is successfully joined to the room.

#### Returns

`boolean`

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

***

### \[dispose\]()

> **\[dispose\]**(): `void`

#### Returns

`void`

***

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

### send()

> **send**(...`data`): `this`

send data to room handler

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

`this`

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `PromiseLike`\<`R1` \| `R2`\>

Promise like for events "open", "error"

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

[[`VarhubClient`](VarhubClient.md)]

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
// Using in async context
const client = varhub.join(roomId);
try {
  await client;
  console.log("client connected");
} catch (error) {
  console.log("connection error");
}
```

```typescript
// Using in async context
const [client] = await varhub.join(roomId);
```

```typescript
// Using in sync context
varhub.join(roomId).then(([client]) => {
  console.log("client connected");
});
```

## Events

### off()

> **off**\<`T`\>(`event`, `handler`): `this`

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

`T` *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)

</td>
<td>

Unsubscribe from client event

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

`event`

</td>
<td>

`T`

</td>
<td>

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### See

***

### on()

> **on**\<`T`\>(`event`, `handler`): `this`

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

`T` *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)

</td>
<td>

subscribe on client event

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

`event`

</td>
<td>

`T`

</td>
<td>

"message", "open", "close" or "error"

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

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

> **once**\<`T`\>(`event`, `handler`): `this`

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

`T` *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)

</td>
<td>

Subscribe on client event once

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

`event`

</td>
<td>

`T`

</td>
<td>

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

(`this`, ...`args`) => `void`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### See
