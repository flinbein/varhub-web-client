[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [VM API](../../../README.md) / ["varhub:rpc"](../README.md) / default

# Class: default\<METHODS, STATE, EVENTS\>

Remote procedure call handler

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

`METHODS` *extends* `Record`\<`string`, `any`\>

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`STATE`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`EVENTS`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

## Implements

- `Disposable`

## Constructors

### new default()

> **new default**\<`METHODS`, `STATE`, `EVENTS`\>(`handler`?, `initialState`?): [`default`](default.md)\<`METHODS`, `STATE`, `EVENTS`\>

Create new instance of RPC

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

`handler`?

</td>
<td>

[`RPCHandler`](../type-aliases/RPCHandler.md) \| `METHODS`

</td>
<td>

handler can be:
- function of type [RPCHandler](../type-aliases/RPCHandler.md);
- object with methods for remote call.

</td>
</tr>
<tr>
<td>

`initialState`?

</td>
<td>

`STATE`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

[`default`](default.md)\<`METHODS`, `STATE`, `EVENTS`\>

#### Examples

```typescript
// remote code
const rpcSource = new RPCSource((connection: Connection, path: string[], args: any[], openChannel: boolean) => {
  console.log("connection:", this);
  if (path.length === 0 && path[0] === "sum") return args[0] + args[1];
  throw new Error("method not found");
});
RPCSource.start(rpcSource, room);
```
```typescript
// client code
const rpc = new RPCChannel(client);
const result = await rpc.test(5, 3);
console.assert(result === 8);
```

```typescript
// remote code
const rpcSource = new RPCSource({
  sum(x, y){
    console.log("connection:", this);
    return x + y;
  }
});
RPCSource.start(rpcSource, room);
```
```typescript
// client code
const rpc = new RPCChannel(client);
const result = await rpc.test(5, 3);
console.assert(result === 8);
```

#### Defined in

[src/modules.d.ts:791](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L791)

## Accessors

### disposed

> `get` **disposed**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:807](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L807)

***

### state

> `get` **state**(): `STATE`

get current state

#### Returns

`STATE`

#### Defined in

[src/modules.d.ts:749](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L749)

***

### current

> `get` `static` **current**(): `undefined` \| [`default`](default.md)\<`any`, `undefined`, `any`\>

get the current rpc source, based on exports of main module.
value is undefined while main module is executing

#### Returns

`undefined` \| [`default`](default.md)\<`any`, `undefined`, `any`\>

#### Defined in

[src/modules.d.ts:842](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L842)

## Methods

### \[dispose\]()

> **\[dispose\]**(): `void`

dispose this source and disconnect all channels

#### Returns

`void`

#### Implementation of

`Disposable.[dispose]`

#### Defined in

[src/modules.d.ts:823](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L823)

***

### dispose()

> **dispose**(`reason`?): `void`

dispose this source and disconnect all channels

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

`any`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`void`

#### Defined in

[src/modules.d.ts:819](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L819)

***

### emit()

> **emit**\<`P`\>(`event`, ...`args`): `this`

Emit event for all connected clients.
Reserved event names: `close`, `init`, `error`, `state`

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

`P` *extends* `string` \| [`string`] \| [`string`, `...(EventPath<EVENTS[string], keyof EVENTS[string]> extends NEXT ? NEXT extends any[] ? NEXT<NEXT> : [NEXT] : never)[]`]

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

`P`

</td>
<td>

path for event. String or array of strings.

</td>
</tr>
<tr>
<td>

...`args`

</td>
<td>

[`EventPathArgs`](../type-aliases/EventPathArgs.md)\<`P`, `EVENTS`\>

</td>
<td>

event values

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### Defined in

[src/modules.d.ts:814](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L814)

***

### setState()

> **setState**(`state`): `this`

set new state

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

`state`

</td>
<td>

`STATE` *extends* (...`args`) => `any` ? `never` : `STATE`

</td>
<td>

new state value, if state is not a function.
- function takes the current state and returns a new one

</td>
</tr>
</tbody>
</table>

#### Returns

`this`

#### Defined in

[src/modules.d.ts:802](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L802)

***

### withEventTypes()

> **withEventTypes**\<`E`\>(): [`default`](default.md)\<`METHODS`, `STATE`, `E`\>

apply generic types for events

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

`E`

</td>
<td>

`EVENTS`

</td>
</tr>
</tbody>
</table>

#### Returns

[`default`](default.md)\<`METHODS`, `STATE`, `E`\>

#### Defined in

[src/modules.d.ts:793](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L793)

***

### withState()

#### withState()

> **withState**\<`S`\>(): [`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

apply generic types for state.

##### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`S`

</td>
</tr>
</tbody>
</table>

##### Returns

[`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/modules.d.ts:804](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L804)

#### withState(state)

> **withState**\<`S`\>(`state`): [`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

apply generic types for state and set new state.

##### Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`S`

</td>
</tr>
</tbody>
</table>

##### Parameters

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

`state`

</td>
<td>

`S`

</td>
</tr>
</tbody>
</table>

##### Returns

[`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/modules.d.ts:806](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L806)

***

### start()

> `static` **start**(`rpcSource`, `room`, `options`?): () => `void`

start listening for messages and processing procedure calls

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

`rpcSource`

</td>
<td>

[`default`](default.md)\<`any`, `undefined`, `any`\>

</td>
<td>

message handler

</td>
</tr>
<tr>
<td>

`room`

</td>
<td>

[`Room`](../../varhub:room/interfaces/Room.md)

</td>
<td>

room

</td>
</tr>
<tr>
<td>

`options`?

</td>
<td>

`object`

</td>
<td>

</td>
</tr>
<tr>
<td>

`options.key`?

</td>
<td>

`string`

</td>
<td>

Special key for listening events. Default value: `"$rpc"`

</td>
</tr>
<tr>
<td>

`options.maxChannelsPerClient`?

</td>
<td>

`number`

</td>
<td>

set a limit on the number of opened channels

</td>
</tr>
</tbody>
</table>

#### Returns

`Function`

##### Returns

`void`

#### Defined in

[src/modules.d.ts:833](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L833)

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

`T` *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](../interfaces/RPCSourceChannel.md)\<`this`\>\>

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

"channelOpen", "channelClose", "state" or "dispose"

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

[src/modules.d.ts:745](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L745)

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

`T` *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](../interfaces/RPCSourceChannel.md)\<`this`\>\>

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

"channelOpen", "channelClose", "state" or "dispose"

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

[src/modules.d.ts:729](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L729)

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

`T` *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](../interfaces/RPCSourceChannel.md)\<`this`\>\>

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

"channelOpen", "channelClose", "state" or "dispose"

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

[src/modules.d.ts:737](https://github.com/flinbein/varhub-web-client/blob/44cee252b4129e1cf923ce27478727106d4f6662/src/modules.d.ts#L737)
