[**@flinbein/varhub-web-clent**](../../README.md)

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / VarhubClient

# Class: VarhubClient\<DESC\>

Represents a user-controlled connection to the room;

## Example

```typescript
import { Varhub } from "@flinbein/varhub-web-client";

const hub = new Varhub("https://example.com");
const client: VarhubClient = hub.join(roomId);
await client;
client.send("some message");
```

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

`DESC` *extends* `Record`\<keyof `RoomDesc`, `any`\> *extends* `DESC` ? `RoomDesc` : `never`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Accessors

### closed

#### Get Signature

> **get** **closed**(): `boolean`

client's connection is closed

##### Returns

`boolean`

***

### promise

#### Get Signature

> **get** **promise**(): `Promise`\<`this`\>

##### Returns

`Promise`\<`this`\>

***

### ready

#### Get Signature

> **get** **ready**(): `boolean`

client is successfully joined to the room.

##### Returns

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

`DESC` *extends* `object` ? `R` : `XJData`[]

</td>
<td>

any serializable arguments

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

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

`T` *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)\<`DESC`\>

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

`T` *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)\<`DESC`\>

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

`T` *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)\<`DESC`\>

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
