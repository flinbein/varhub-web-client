[**@flinbein/varhub-web-clent**](../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../modules.md) / [index](../README.md) / RpcInstance

# Interface: RpcInstance\<S\>

Instance of RPC channel

## Extends

- `Disposable`

## Type Parameters

• **S**

## Properties

### call()

> **call**: (`path`, ...`args`) => `Promise`\<`any`\>

#### Parameters

• **path**: `string`[]

• ...**args**: `any`[]

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/RPCChannel.ts:90](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L90)

***

### close()

> **close**: (`reason`?) => `void`

#### Parameters

• **reason?**: `string`

#### Returns

`void`

#### Defined in

[src/RPCChannel.ts:92](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L92)

***

### closed

> **closed**: `boolean`

#### Defined in

[src/RPCChannel.ts:89](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L89)

***

### create()

> **create**: (`path`, ...`args`) => [`RpcInstance`](RpcInstance.md)\<`any`\> & `RpcEmitter`\<`never`\>

#### Parameters

• **path**: `string`[]

• ...**args**: `any`[]

#### Returns

[`RpcInstance`](RpcInstance.md)\<`any`\> & `RpcEmitter`\<`never`\>

#### Defined in

[src/RPCChannel.ts:91](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L91)

***

### ready

> **ready**: `boolean`

#### Defined in

[src/RPCChannel.ts:88](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L88)

***

### state

> **state**: `S`

#### Defined in

[src/RPCChannel.ts:93](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L93)

## Methods

### \[dispose\]()

#### \[dispose\]()

> **\[dispose\]**(): `void`

##### Returns

`void`

##### Inherited from

`Disposable.[dispose]`

##### Defined in

node\_modules/typescript/lib/lib.esnext.disposable.d.ts:36

#### \[dispose\]()

> **\[dispose\]**(): `void`

##### Returns

`void`

##### Inherited from

`Disposable.[dispose]`

##### Defined in

node\_modules/@types/node/globals.d.ts:282

***

### then()

> **then**\<`R1`, `R2`\>(`onfulfilled`?, `onrejected`?): `Promise`\<`R1` \| `R2`\>

#### Type Parameters

• **R1** = [[`RpcInstance`](RpcInstance.md)\<`S`\>]

• **R2** = `never`

#### Parameters

• **onfulfilled?**: `null` \| (`value`) => `R1` \| `PromiseLike`\<`R1`\>

• **onrejected?**: `null` \| (`reason`) => `R2` \| `PromiseLike`\<`R2`\>

#### Returns

`Promise`\<`R1` \| `R2`\>

#### Defined in

[src/RPCChannel.ts:84](https://github.com/flinbein/varhub-web-client/blob/5849e057250037e1be4f38ff522ce95c9f4e116a/src/RPCChannel.ts#L84)
