[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [index](../README.md) / VarhubClient

# Class: VarhubClient

## Accessors

### closed

> `get` **closed**(): `boolean`

client's connection is closed

#### Returns

`boolean`

#### Defined in

[src/VarhubClient.ts:140](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L140)

***

### ready

> `get` **ready**(): `boolean`

client is successfully joined to the room.

#### Returns

`boolean`

#### Defined in

[src/VarhubClient.ts:135](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L135)

## Methods

### \[asyncDispose\]()

> **\[asyncDispose\]**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/VarhubClient.ts:202](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L202)

***

### \[dispose\]()

> **\[dispose\]**(): `void`

#### Returns

`void`

#### Defined in

[src/VarhubClient.ts:198](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L198)

***

### close()

> **close**(`reason`?): `void`

close client's connection

#### Parameters

• **reason?**: `null` \| `string`

#### Returns

`void`

#### Defined in

[src/VarhubClient.ts:193](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L193)

***

### send()

> **send**(...`data`): `this`

send data to room handler

#### Parameters

• ...**data**: `XJData`[]

any serializable arguments

#### Returns

`this`

#### Defined in

[src/VarhubClient.ts:146](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L146)

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `PromiseLike`\<`R1` \| `R2`\>

Promise like for events "open", "error"
### Using in async context

#### Type Parameters

• **R1** = [[`VarhubClient`](VarhubClient.md)]

• **R2** = `never`

#### Parameters

• **onfulfilled?**: `null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

• **onrejected?**: `null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

#### Returns

`PromiseLike`\<`R1` \| `R2`\>

#### Examples

```typescript
const client = varhub.join(roomId);
try {
  await client;
  console.log("client connected");
} catch (error) {
  console.log("connection error");
}
```

```typescript
const [client] = await varhub.join(roomId);
```
### Using in sync context

```typescript
varhub.join(roomId).then(([client]) => {
  console.log("client connected");
});
```

#### Defined in

[src/VarhubClient.ts:125](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L125)

## Events

### off()

> **off**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)

Unsubscribe from client event

#### Parameters

• **event**: `T`

• **handler**

#### Returns

`this`

#### See

#### Defined in

[src/VarhubClient.ts:184](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L184)

***

### on()

> **on**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)

subscribe on client event

#### Parameters

• **event**: `T`

"message", "open", "close" or "error"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/VarhubClient.ts:159](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L159)

***

### once()

> **once**\<`T`\>(`event`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`VarhubClientEvents`](../type-aliases/VarhubClientEvents.md)

Subscribe on client event once

#### Parameters

• **event**: `T`

• **handler**

#### Returns

`this`

#### See

#### Defined in

[src/VarhubClient.ts:171](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/VarhubClient.ts#L171)
