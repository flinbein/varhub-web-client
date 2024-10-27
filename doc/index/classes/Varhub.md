[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / Varhub

# Class: Varhub

Varhub instance to manage rooms, create clients

## Constructors

### new Varhub()

> **new Varhub**(`url`): [`Varhub`](Varhub.md)

#### Parameters

• **url**: `string` \| `URL`

#### Returns

[`Varhub`](Varhub.md)

#### Defined in

[src/Varhub.ts:77](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L77)

## Accessors

### url

> `get` **url**(): `string`

get current url as string

#### Returns

`string`

string

#### Defined in

[src/Varhub.ts:85](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L85)

## Methods

### createLogger()

> **createLogger**(`loggerId`): `WebSocket`

Create websocket connection for qjs logger or ivm inspector

example to generate random id

#### Parameters

• **loggerId**: `string`

#### Returns

`WebSocket`

#### Example

```js
Array.from({length:10}).map(() => Math.random().toString(36).substring(2)).join("")
```

#### Defined in

[src/Varhub.ts:166](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L166)

***

### createRoom()

> **createRoom**\<`T`\>(`type`, `options`?): `Promise`\<`RoomCreateResult`\<`T`\>\>

Create new room

#### Type Parameters

• **T** *extends* keyof `RoomCreateOptionsMap`

#### Parameters

• **type**: `T`

type of VM

• **options?**: `RoomCreateOptions`\<`T`\>

options

#### Returns

`Promise`\<`RoomCreateResult`\<`T`\>\>

#### Defined in

[src/Varhub.ts:94](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L94)

***

### createRoomSocket()

> **createRoomSocket**(`options`?): [`RoomSocketHandler`](RoomSocketHandler.md)

create websocket connection to handle new room

#### Parameters

• **options?** = `{}`

options

• **options.integrity?**: \`custom:$\{string\}\`

set integrity for new room. Starts with "custom:"

• **options.message?**: `string`

set public message of this room

#### Returns

[`RoomSocketHandler`](RoomSocketHandler.md)

#### Defined in

[src/Varhub.ts:104](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L104)

***

### findRooms()

> **findRooms**(`integrity`): `Promise`\<`Record`\<`string`, `string`\>\>

Find public rooms with `integrity`.
You can find only rooms created with integrity.
If room has no message, it will not be included in result.

#### Parameters

• **integrity**: `string`

{string}

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

record of <roomId, message>.

#### Defined in

[src/Varhub.ts:116](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L116)

***

### getRoomMessage()

> **getRoomMessage**(`roomId`, `integrity`?): `Promise`\<`string`\>

Get public message of room.

#### Parameters

• **roomId**: `string`

{string} room id

• **integrity?**: `string`

{string} required if room was created with integrity

#### Returns

`Promise`\<`string`\>

string

#### Throws

Error if room not found or room not public or integrity mismatch

#### Defined in

[src/Varhub.ts:127](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L127)

***

### join()

> **join**(`roomId`, `options`?): [`VarhubClient`](VarhubClient.md)

Join room.

#### Parameters

• **roomId**: `string`

room id

• **options?**: `RoomJoinOptions` = `{}`

options

#### Returns

[`VarhubClient`](VarhubClient.md)

client

#### Defined in

[src/Varhub.ts:150](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/Varhub.ts#L150)
