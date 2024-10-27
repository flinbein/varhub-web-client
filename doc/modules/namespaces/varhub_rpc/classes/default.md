[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:rpc"](../README.md) / default

# Class: default\<METHODS, STATE, EVENTS\>

## Type Parameters

• **METHODS** *extends* `Record`\<`string`, `any`\> = `object`

• **STATE** = `undefined`

• **EVENTS** = `object`

## Implements

- `Disposable`

## Constructors

### new default()

> **new default**\<`METHODS`, `STATE`, `EVENTS`\>(`handler`?, `initialState`?): [`default`](default.md)\<`METHODS`, `STATE`, `EVENTS`\>

Create new instance of RPC

#### Parameters

• **handler?**: [`RPCHandler`](../type-aliases/RPCHandler.md) \| `METHODS`

handler can be:
- function of type [RPCHandler](../type-aliases/RPCHandler.md);
- object with methods for remote call.

• **initialState?**: `STATE`

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

[src/modules.d.ts:716](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L716)

## Accessors

### disposed

> `get` **disposed**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/modules.d.ts:732](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L732)

***

### state

> `get` **state**(): `STATE`

get current state

#### Returns

`STATE`

#### Defined in

[src/modules.d.ts:674](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L674)

***

### current

> `get` `static` **current**(): `undefined` \| [`default`](default.md)\<`any`, `undefined`, `any`\>

get the current rpc source, based on exports of main module.
value is undefined while main module is executing

#### Returns

`undefined` \| [`default`](default.md)\<`any`, `undefined`, `any`\>

#### Defined in

[src/modules.d.ts:767](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L767)

## Methods

### \[dispose\]()

> **\[dispose\]**(): `void`

dispose this source and disconnect all channels

#### Returns

`void`

#### Implementation of

`Disposable.[dispose]`

#### Defined in

[src/modules.d.ts:748](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L748)

***

### dispose()

> **dispose**(`reason`?): `void`

dispose this source and disconnect all channels

#### Parameters

• **reason?**: `any`

#### Returns

`void`

#### Defined in

[src/modules.d.ts:744](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L744)

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

• ...**args**: [`EventPathArgs`](../type-aliases/EventPathArgs.md)\<`P`, `EVENTS`\>

event values

#### Returns

`this`

#### Defined in

[src/modules.d.ts:739](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L739)

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

[src/modules.d.ts:727](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L727)

***

### withEventTypes()

> **withEventTypes**\<`E`\>(): [`default`](default.md)\<`METHODS`, `STATE`, `E`\>

apply generic types for events

#### Type Parameters

• **E** = `EVENTS`

#### Returns

[`default`](default.md)\<`METHODS`, `STATE`, `E`\>

#### Defined in

[src/modules.d.ts:718](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L718)

***

### withState()

#### withState()

> **withState**\<`S`\>(): [`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

apply generic types for state.

##### Type Parameters

• **S**

##### Returns

[`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/modules.d.ts:729](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L729)

#### withState(state)

> **withState**\<`S`\>(`state`): [`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

apply generic types for state and set new state.

##### Type Parameters

• **S**

##### Parameters

• **state**: `S`

##### Returns

[`default`](default.md)\<`METHODS`, `S`, `EVENTS`\>

##### Defined in

[src/modules.d.ts:731](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L731)

***

### start()

> `static` **start**(`rpcSource`, `room`, `options`?): () => `void`

start listening for messages and processing procedure calls

#### Parameters

• **rpcSource**: [`default`](default.md)\<`any`, `undefined`, `any`\>

message handler

• **room**: [`Room`](../../varhub:room/interfaces/Room.md)

room

• **options?**

• **options.key?**: `string`

Special key for listening events. Default value: `"$rpc"`

• **options.maxChannelsPerClient?**: `number`

set a limit on the number of opened channels

#### Returns

`Function`

##### Returns

`void`

#### Defined in

[src/modules.d.ts:758](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L758)

## Events

### off()

> **off**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](../interfaces/RPCSourceChannel.md)\<`this`\>\>

unsubscribe from event

#### Parameters

• **eventName**: `T`

"channelOpen", "channelClose", "state" or "dispose"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/modules.d.ts:670](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L670)

***

### on()

> **on**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](../interfaces/RPCSourceChannel.md)\<`this`\>\>

subscribe on event

#### Parameters

• **eventName**: `T`

"channelOpen", "channelClose", "state" or "dispose"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/modules.d.ts:654](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L654)

***

### once()

> **once**\<`T`\>(`eventName`, `handler`): `this`

#### Type Parameters

• **T** *extends* keyof [`RPCSourceEvents`](../type-aliases/RPCSourceEvents.md)\<`STATE`, [`RPCSourceChannel`](../interfaces/RPCSourceChannel.md)\<`this`\>\>

subscribe on event once

#### Parameters

• **eventName**: `T`

"channelOpen", "channelClose", "state" or "dispose"

• **handler**

event handler

#### Returns

`this`

#### Defined in

[src/modules.d.ts:662](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/modules.d.ts#L662)
