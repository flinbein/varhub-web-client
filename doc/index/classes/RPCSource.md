[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / RPCSource

# Class: RPCSource\<METHODS, STATE, EVENTS\>

## Type Parameters

• **METHODS** *extends* `Record`\<`string`, `any`\> = `object`

• **STATE** = `undefined`

• **EVENTS** = `object`

## Implements

- `Disposable`

## Constructors

### new RPCSource()

> **new RPCSource**\<`METHODS`, `STATE`, `EVENTS`\>(`handler`?, `initialState`?): [`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `EVENTS`\>

Create new instance of RPC

#### Parameters

• **handler?**: `METHODS` \| [`RPCHandler`](../type-aliases/RPCHandler.md)

handler can be:
- function of type [RPCHandler](../type-aliases/RPCHandler.md);
- object with methods for remote call.

• **initialState?**: `STATE`

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

[src/RPCSource.ts:257](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L257)

## Accessors

### disposed

> `get` **disposed**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/RPCSource.ts:324](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L324)

***

### state

> `get` **state**(): `STATE`

get current state

#### Returns

`STATE`

#### Defined in

[src/RPCSource.ts:214](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L214)

## Methods

### \[dispose\]()

> **\[dispose\]**(): `void`

dispose this source and disconnect all channels

#### Returns

`void`

#### Implementation of

`Disposable.[dispose]`

#### Defined in

[src/RPCSource.ts:354](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L354)

***

### dispose()

> **dispose**(`reason`?): `void`

dispose this source and disconnect all channels

#### Parameters

• **reason?**: `XJData`

#### Returns

`void`

#### Defined in

[src/RPCSource.ts:344](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L344)

***

### emit()

> **emit**\<`P`\>(`event`, ...`args`): `this`

Emit event for all connected clients.
Reserved event names: `close`, `init`, `error`, `state`

#### Type Parameters

• **P** *extends* `string` \| [`string`] \| [`string`, `...(EventPath<EVENTS[string], keyof EVENTS[string]> extends NEXT ? NEXT extends any[] ? NEXT<NEXT> : [NEXT] : never)[]`]

#### Parameters

• **event**: `P`

path for event. String or array of strings.

• ...**args**: `EventPathArgs`\<`P`, `EVENTS`\>

event values

#### Returns

`this`

#### Defined in

[src/RPCSource.ts:334](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L334)

***

### setState()

> **setState**(`state`): `this`

set new state

#### Parameters

• **state**: `STATE` *extends* (...`args`) => `any` ? `never` : `STATE`

new state value, if state is not a function.
- function takes the current state and returns a new one

#### Returns

`this`

#### Defined in

[src/RPCSource.ts:300](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L300)

***

### withEventTypes()

> **withEventTypes**\<`E`\>(): [`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `E`\>

apply generic types for events

#### Type Parameters

• **E** = `EVENTS`

#### Returns

[`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `E`\>

#### Defined in

[src/RPCSource.ts:288](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L288)

***

### withState()

#### withState()

> **withState**\<`S`\>(): [`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

apply generic types for state.

##### Type Parameters

• **S**

##### Returns

[`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/RPCSource.ts:315](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L315)

#### withState(state)

> **withState**\<`S`\>(`state`): [`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

apply generic types for state and set new state.

##### Type Parameters

• **S**

##### Parameters

• **state**: `S`

##### Returns

[`RPCSource`](RPCSource.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/RPCSource.ts:317](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L317)

***

### start()

> `static` **start**(`rpcSource`, `room`, `__namedParameters`): () => `void`

start listening for messages and processing procedure calls

#### Parameters

• **rpcSource**: [`RPCSource`](RPCSource.md)\<`any`, `undefined`, `any`\>

message handler

• **room**: [`RoomSocketHandler`](RoomSocketHandler.md)

room

• **\_\_namedParameters** = `{}`

• **\_\_namedParameters.key**: `undefined` \| `string` = `"$rpc"`

• **\_\_namedParameters.maxChannelsPerClient**: `undefined` \| `number` = `Infinity`

#### Returns

`Function`

##### Returns

`void`

#### Defined in

[src/RPCSource.ts:365](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L365)

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](RPCSourceChannel.md)\<`this`\>\>

unsubscribe from event

#### Parameters

• **eventName**: `T`

"channelOpen", "channelClose", "state" or "dispose"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/RPCSource.ts:206](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L206)

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](RPCSourceChannel.md)\<`this`\>\>

subscribe on event

#### Parameters

• **eventName**: `T`

"channelOpen", "channelClose", "state" or "dispose"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/RPCSource.ts:182](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L182)

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](RPCSourceChannel.md)\<`this`\>\>

subscribe on event once

#### Parameters

• **eventName**: `T`

"channelOpen", "channelClose", "state" or "dispose"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/RPCSource.ts:194](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCSource.ts#L194)
