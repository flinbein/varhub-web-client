[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

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

#### Defined in

[src/Varhub.ts:77](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L77)

## Accessors

### url

> `get` **url**(): `string`

get current url as string

#### Returns

`string`

string

#### Defined in

[src/Varhub.ts:85](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L85)

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

#### Defined in

[src/Varhub.ts:166](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L166)

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

#### Defined in

[src/Varhub.ts:94](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L94)

***

### createRoomSocket()

> **createRoomSocket**(`options`?): [`RoomSocketHandler`](RoomSocketHandler.md)

create websocket connection to handle new room

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

`object`

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

[`RoomSocketHandler`](RoomSocketHandler.md)

#### Defined in

[src/Varhub.ts:104](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L104)

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

#### Defined in

[src/Varhub.ts:116](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L116)

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

#### Defined in

[src/Varhub.ts:127](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L127)

***

### join()

> **join**(`roomId`, `options`?): [`VarhubClient`](VarhubClient.md)

Join room.

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

`RoomJoinOptions`

</td>
<td>

options

</td>
</tr>
</tbody>
</table>

#### Returns

[`VarhubClient`](VarhubClient.md)

client

#### Defined in

[src/Varhub.ts:150](https://github.com/flinbein/varhub-web-client/blob/80de56149525d89cae98259b8f2326dc12362fbf/src/Varhub.ts#L150)
