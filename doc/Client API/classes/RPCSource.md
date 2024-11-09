[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../README.md) / [Client API](../README.md) / RPCSource

# Class: RPCSource\<METHODS, STATE, EVENTS\>

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

### new RPCSource()

> **new RPCSource**\<`METHODS`, `STATE`, `EVENTS`\>(`handler`?, `initialState`?): [`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `EVENTS`\>

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

`METHODS` \| [`RPCHandler`](../type-aliases/RPCHandler.md)

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

[`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `EVENTS`\>

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

[src/RPCSource.ts:176](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L176)

## Accessors

### disposed

> `get` **disposed**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/RPCSource.ts:244](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L244)

***

### state

> `get` **state**(): `STATE`

get current state

#### Returns

`STATE`

#### Defined in

[src/RPCSource.ts:133](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L133)

## Methods

### \[dispose\]()

> **\[dispose\]**(): `void`

dispose this source and disconnect all channels

#### Returns

`void`

#### Implementation of

`Disposable.[dispose]`

#### Defined in

[src/RPCSource.ts:306](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L306)

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

`XJData`

</td>
<td>

</td>
</tr>
</tbody>
</table>

#### Returns

`void`

#### Defined in

[src/RPCSource.ts:297](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L297)

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

`EventPathArgs`\<`P`, `EVENTS`\>

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

[src/RPCSource.ts:254](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L254)

***

### emitFor()

> **emitFor**\<`P`\>(`predicate`, `event`, ...`args`): `this`

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

`predicate`

</td>
<td>

`undefined` \| `null` \| `DeepIterable`\<[`Connection`](Connection.md)\> \| (`con`) => `any`

</td>
<td>

event will be sent only to the listed connections.

</td>
</tr>
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

`EventPathArgs`\<`P`, `EVENTS`\>

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

[src/RPCSource.ts:265](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L265)

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

[src/RPCSource.ts:224](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L224)

***

### withEventTypes()

> **withEventTypes**\<`E`\>(): [`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `E`\>

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

[`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `E`\>

#### Defined in

[src/RPCSource.ts:212](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L212)

***

### withState()

#### withState()

> **withState**\<`S`\>(): [`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

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

[`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/RPCSource.ts:235](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L235)

#### withState(state)

> **withState**\<`S`\>(`state`): [`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

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

[`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/RPCSource.ts:237](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L237)

***

### createDefaultHandler()

> `static` **createDefaultHandler**(`parameters`): [`RPCHandler`](../type-aliases/RPCHandler.md)

create [RPCHandler](../type-aliases/RPCHandler.md) based on object with methods

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

`parameters`

</td>
<td>

`object`

</td>
<td>

</td>
</tr>
<tr>
<td>

`parameters.form`

</td>
<td>

`any`

</td>
<td>

object with methods.

</td>
</tr>
</tbody>
</table>

#### Returns

[`RPCHandler`](../type-aliases/RPCHandler.md)

- [RPCHandler](../type-aliases/RPCHandler.md)

#### Defined in

[src/RPCSource.ts:188](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L188)

***

### start()

> `static` **start**(`rpcSource`, `room`, `__namedParameters`): () => `void`

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

[`RPCSource`](RPCSource.md)\<`any`, `any`, `any`\>

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

[`RoomSocketHandler`](RoomSocketHandler.md)

</td>
<td>

room

</td>
</tr>
<tr>
<td>

`__namedParameters`

</td>
<td>

`object`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`__namedParameters.key`

</td>
<td>

`undefined` \| `string`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`__namedParameters.maxChannelsPerClient`

</td>
<td>

`undefined` \| `number`

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

#### Returns

`Function`

##### Returns

`void`

#### Defined in

[src/RPCSource.ts:317](https://github.com/flinbein/varhub-web-client/blob/03abd2bf517b76514fc1e5aae61e36810a87369c/src/RPCSource.ts#L317)
