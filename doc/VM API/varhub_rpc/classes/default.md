[**@flinbein/varhub-web-clent**](../../../README.md)

***

[@flinbein/varhub-web-clent](../../../README.md) / [VM API](../../README.md) / [varhub:rpc](../README.md) / default

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

`METHODS` *extends* `Record`\<`string`, `any`\> \| `string`

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

`any`

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
- `function` of type [RPCHandler](../type-aliases/RPCHandler.md);
- `object` with methods for remote call.
- `string` prefix: use self methods starting with prefix for remote call.

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
    console.log("connection:", room.useConnection());
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

## Accessors

### disposed

#### Get Signature

> **get** **disposed**(): `boolean`

##### Returns

`boolean`

***

### state

#### Get Signature

> **get** **state**(): `STATE`

get current state

##### Returns

`STATE`

***

### default

#### Get Signature

> **get** `static` **default**(): [`default`](default.md)\<`any`, `any`, `any`\>

get the current rpc source, based on exports of main module.
value is undefined while main module is executing

##### Returns

[`default`](default.md)\<`any`, `any`, `any`\>

## Methods

### \[dispose\]()

> **\[dispose\]**(): `void`

dispose this source and disconnect all channels

#### Returns

`void`

#### Implementation of

`Disposable.[dispose]`

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

`P` *extends* `string` \| `number` \| [`string`] \| [`number`] \| [`string`, `...(EventPath<EVENTS[string], keyof EVENTS[string]> extends NEXT ? NEXT extends any[] ? NEXT<NEXT> : [NEXT] : never)[]`] \| [`number`, `...(EventPath<EVENTS[number], keyof EVENTS[number]> extends NEXT ? NEXT extends any[] ? NEXT<NEXT> : [NEXT] : never)[]`]

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

`P` *extends* `string` \| `number` \| [`string`] \| [`number`] \| [`string`, `...(EventPath<EVENTS[string], keyof EVENTS[string]> extends NEXT ? NEXT extends any[] ? NEXT<NEXT> : [NEXT] : never)[]`] \| [`number`, `...(EventPath<EVENTS[number], keyof EVENTS[number]> extends NEXT ? NEXT extends any[] ? NEXT<NEXT> : [NEXT] : never)[]`]

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

`undefined` \| `null` \| [`DeepIterable`](../type-aliases/DeepIterable.md)\<[`Connection`](../../varhub:room/interfaces/Connection.md)\<`object`\>\> \| (`con`) => `any`

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

***

### withState()

#### Call Signature

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

#### Call Signature

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

***

### createDefaultHandler()

#### Call Signature

> `static` **createDefaultHandler**(`parameters`, `prefix`?): [`RPCHandler`](../type-aliases/RPCHandler.md)

create [RPCHandler](../type-aliases/RPCHandler.md) based on object with methods

##### Parameters

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

\{`form`: `any`; \}

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
<tr>
<td>

`prefix`?

</td>
<td>

`string`

</td>
<td>

prefix of used methods, empty by default

</td>
</tr>
</tbody>
</table>

##### Returns

[`RPCHandler`](../type-aliases/RPCHandler.md)

- [RPCHandler](../type-aliases/RPCHandler.md)

#### Call Signature

> `static` **createDefaultHandler**(`parameters`): [`RPCHandler`](../type-aliases/RPCHandler.md)

create [RPCHandler](../type-aliases/RPCHandler.md) based on object with methods

##### Parameters

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

\{`form`: `any`; \}

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

##### Returns

[`RPCHandler`](../type-aliases/RPCHandler.md)

- [RPCHandler](../type-aliases/RPCHandler.md)

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

[`default`](default.md)\<`any`, `any`, `any`\>

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

[`Room`](../../varhub:room/interfaces/Room.md)\<`object`\>

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

\{`key`: `string`;`maxChannelsPerClient`: `number`; \}

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

***

### validate()

> `static` **validate**\<`V`, `A`\>(`validator`, `handler`): `NoInfer`\<`A`\>

Create function with validation of arguments

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

`V` *extends* (`args`) => `false` \| readonly `any`[] \| (`args`) => `args is any[]`

</td>
</tr>
<tr>
<td>

`A` *extends* (...`args`) => `any`

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

`validator`

</td>
<td>

`V`

</td>
<td>

function to validate arguments. `(args) => boolean | any[]`
- args - array of validating values
- returns:
  - `true` - pass args to the target function
  - `false` - validation error will be thrown
  - `any[]` - replace args and pass to the target function
- throws: error will be thrown

</td>
</tr>
<tr>
<td>

`handler`

</td>
<td>

`A`

</td>
<td>

target function

</td>
</tr>
</tbody>
</table>

#### Returns

`NoInfer`\<`A`\>

a new function with validation of arguments

#### Example

```typescript
const validateString = (args: any[]) => args.length === 1 && [String(args[0])] as const;

const fn = RPCSource.validate(validateString, (arg) => {
  return arg.toUpperCase() // <-- string
});

fn("foo") // "FOO"
fn(10) // "10"
fn(); // throws error
fn("foo", "bar"); // throws error
```

***

### with()

#### Call Signature

> `static` **with**\<`BIND_METHODS`, `BIND_STATE`, `BIND_EVENTS`\>(): \<`METHODS`, `STATE`, `EVENTS`\>(`methods`, `state`?) => [`default`](default.md)\<`METHODS`, `STATE`, `EVENTS`\>

##### Type Parameters

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

`BIND_METHODS` *extends* `string` \| `Record`\<`string`, `any`\>

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`BIND_STATE`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`BIND_EVENTS`

</td>
<td>

`object`

</td>
</tr>
</tbody>
</table>

##### Returns

`Function`

###### Parameters

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

`methods`

</td>
<td>

`METHODS`

</td>
</tr>
<tr>
<td>

`state`?

</td>
<td>

`STATE`

</td>
</tr>
</tbody>
</table>

###### Returns

[`default`](default.md)\<`METHODS`, `STATE`, `EVENTS`\>

| Name | Type |
| ------ | ------ |
| `prototype` | [`default`](default.md)\<`any`, `any`, `any`\> |

#### Call Signature

> `static` **with**\<`BIND_METHODS`, `BIND_STATE`, `BIND_EVENTS`\>(`methods`): \<`STATE`, `EVENTS`\>(`state`?) => [`default`](default.md)\<`BIND_METHODS`, `STATE`, `EVENTS`\>

Create a new constructor of [RPCSource](default.md) with bound methods.

##### Type Parameters

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

`BIND_METHODS` *extends* `string` \| `Record`\<`string`, `any`\>

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`BIND_STATE`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`BIND_EVENTS`

</td>
<td>

`object`

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`methods`

</td>
<td>

[`RPCHandler`](../type-aliases/RPCHandler.md) \| `BIND_METHODS`

</td>
<td>

bound methods for remote call

</td>
</tr>
</tbody>
</table>

##### Returns

`Function`

###### Parameters

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

`state`?

</td>
<td>

`STATE`

</td>
</tr>
</tbody>
</table>

###### Returns

[`default`](default.md)\<`BIND_METHODS`, `STATE`, `EVENTS`\>

| Name | Type |
| ------ | ------ |
| `prototype` | [`default`](default.md)\<`any`, `any`, `any`\> |

##### Example

```typescript
export class Counter extends RPCSource.with("$_")<number> {
  $_increment(){
    this.setState(this.state + 1);
  }
}
// client code
const rpc = new RPCChannel(client);
const rpcCounter = new rpc.Counter(100);
await rpcCounter.increment();
console.log(rpcCounter.state) // 101
```

#### Call Signature

> `static` **with**\<`BIND_METHODS`, `BIND_STATE`, `BIND_EVENTS`\>(`methods`, `state`): \<`EVENTS`\>() => [`default`](default.md)\<`BIND_METHODS`, `BIND_STATE`, `EVENTS`\>

Create a new constructor of [RPCSource](default.md) with bound methods and initial state.

##### Type Parameters

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

`BIND_METHODS` *extends* `string` \| `Record`\<`string`, `any`\>

</td>
<td>

`object`

</td>
</tr>
<tr>
<td>

`BIND_STATE`

</td>
<td>

`undefined`

</td>
</tr>
<tr>
<td>

`BIND_EVENTS`

</td>
<td>

`object`

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
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`methods`

</td>
<td>

[`RPCHandler`](../type-aliases/RPCHandler.md) \| `BIND_METHODS`

</td>
<td>

bound methods for remote call

</td>
</tr>
<tr>
<td>

`state`

</td>
<td>

`BIND_STATE`

</td>
<td>

initial state

</td>
</tr>
</tbody>
</table>

##### Returns

`Function`

###### Returns

[`default`](default.md)\<`BIND_METHODS`, `BIND_STATE`, `EVENTS`\>

| Name | Type |
| ------ | ------ |
| `prototype` | [`default`](default.md)\<`any`, `any`, `any`\> |

##### Example

```typescript
const Counter = RPCSource.with({}, 0);
export const counter = new Counter();
setInterval(() => {
  counter.setState(state => state+1)
}, 1000);
```
