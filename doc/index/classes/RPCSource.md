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

[src/RPCSource.ts:256](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L256)

## Properties

### \[unscopables\]

> **\[unscopables\]**: `object`

#### \_\_rpc\_events

> **\_\_rpc\_events**: `EVENTS`

#### \_\_rpc\_methods

> **\_\_rpc\_methods**: `METHODS`

#### \_\_rpc\_state

> **\_\_rpc\_state**: `STATE`

#### Defined in

[src/RPCSource.ts:168](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L168)

## Accessors

### disposed

> `get` **disposed**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/RPCSource.ts:323](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L323)

***

### state

> `get` **state**(): `STATE`

get current state

#### Returns

`STATE`

#### Defined in

[src/RPCSource.ts:213](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L213)

## Methods

### \[dispose\]()

> **\[dispose\]**(): `void`

dispose this source and disconnect all channels

#### Returns

`void`

#### Implementation of

`Disposable.[dispose]`

#### Defined in

[src/RPCSource.ts:352](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L352)

***

### dispose()

> **dispose**(`reason`?): `void`

dispose this source and disconnect all channels

#### Parameters

• **reason?**: `XJData`

#### Returns

`void`

#### Defined in

[src/RPCSource.ts:342](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L342)

***

### emit()

> **emit**\<`P`\>(`event`, ...`args`): `this`

Emit event for all connected clients

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

[src/RPCSource.ts:332](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L332)

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

[src/RPCSource.ts:299](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L299)

***

### withEventTypes()

> **withEventTypes**\<`E`\>(): [`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `E`\>

apply generic types for events

#### Type Parameters

• **E** = `EVENTS`

#### Returns

[`RPCSource`](RPCSource.md)\<`METHODS`, `STATE`, `E`\>

#### Defined in

[src/RPCSource.ts:287](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L287)

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

[src/RPCSource.ts:314](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L314)

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

[src/RPCSource.ts:316](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L316)

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

[src/RPCSource.ts:363](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L363)

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

[src/RPCSource.ts:205](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L205)

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

[src/RPCSource.ts:181](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L181)

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

[src/RPCSource.ts:193](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/RPCSource.ts#L193)
