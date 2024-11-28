[**@flinbein/varhub-web-clent**](../../README.md)

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / Varhub

# Class: Varhub

Varhub instance to manage rooms, create clients

## Constructors

### new Varhub()

> **new Varhub**(`url`): [`Varhub`](Varhub.md)

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

`url`

</td>
<td>

`string` \| `URL`

</td>
</tr>
</tbody>
</table>

#### Returns

[`Varhub`](Varhub.md)

## Accessors

### url

#### Get Signature

> **get** **url**(): `string`

get current url as string

##### Returns

`string`

string

## Methods

### createLogger()

> **createLogger**(`loggerId`): `WebSocket`

Create websocket connection for qjs logger or ivm inspector

example to generate random id

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

`loggerId`

</td>
<td>

`string`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`WebSocket`

#### Example

```js
Array.from({length:10}).map(() => Math.random().toString(36).substring(2)).join("")
```

***

### createRoom()

> **createRoom**\<`T`\>(`type`, `options`?): `Promise`\<`RoomCreateResult`\<`T`\>\>

Create new room

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

`T` *extends* keyof `RoomCreateOptionsMap`

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

`type`

</td>
<td>

`T`

</td>
<td>

type of VM

</td>
</tr>
<tr>
<td>

`options`?

</td>
<td>

`RoomCreateOptions`\<`T`\>

</td>
<td>

options

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`RoomCreateResult`\<`T`\>\>

***

### createRoomSocket()

> **createRoomSocket**\<`DESC`\>(`options`?): [`RoomSocketHandler`](RoomSocketHandler.md)\<`DESC`\>

create websocket connection to handle new room

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

`DESC` *extends* `RoomDesc`

</td>
<td>

`object`

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

`options`?

</td>
<td>

\{`integrity`: \`custom:$\{string\}\`;`message`: `string`; \}

</td>
<td>

options

</td>
</tr>
<tr>
<td>

`options.integrity`?

</td>
<td>

\`custom:$\{string\}\`

</td>
<td>

set integrity for new room. Starts with "custom:"

</td>
</tr>
<tr>
<td>

`options.message`?

</td>
<td>

`string`

</td>
<td>

set public message of this room

</td>
</tr>
</tbody>
</table>

#### Returns

[`RoomSocketHandler`](RoomSocketHandler.md)\<`DESC`\>

***

### findRooms()

> **findRooms**(`integrity`): `Promise`\<`Record`\<`string`, `string`\>\>

Find public rooms with `integrity`.
You can find only rooms created with integrity.
If room has no message, it will not be included in result.

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

`integrity`

</td>
<td>

`string`

</td>
<td>

{string}

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

record of <roomId, message>.

***

### getRoomMessage()

> **getRoomMessage**(`roomId`, `integrity`?): `Promise`\<`string`\>

Get public message of room.

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

`roomId`

</td>
<td>

`string`

</td>
<td>

{string} room id

</td>
</tr>
<tr>
<td>

`integrity`?

</td>
<td>

`string`

</td>
<td>

{string} required if room was created with integrity

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`string`\>

string

#### Throws

Error if room not found or room not public or integrity mismatch

***

### join()

> **join**\<`DESC`\>(`roomId`, `options`?): [`VarhubClient`](VarhubClient.md)\<`DESC`\>

Join room.

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

`DESC` *extends* `RoomDesc`

</td>
<td>

`object`

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

`roomId`

</td>
<td>

`string`

</td>
<td>

room id

</td>
</tr>
<tr>
<td>

`options`?

</td>
<td>

`RoomJoinOptions`\<`DESC` *extends* `object` ? `T` : `any`[]\>

</td>
<td>

options

</td>
</tr>
</tbody>
</table>

#### Returns

[`VarhubClient`](VarhubClient.md)\<`DESC`\>

client
