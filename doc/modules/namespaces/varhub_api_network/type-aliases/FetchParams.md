[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:api/network"](../README.md) / FetchParams

# Type Alias: FetchParams\<T\>

> **FetchParams**\<`T`\>: `object`

## Type Parameters

• **T** *extends* keyof `BodyType` = keyof `BodyType`

## Type declaration

### body?

> `optional` **body**: `string` \| `ArrayBuffer` \| ([`string`, `string`] \| [`string`, `FileJson`] \| [`string`, `ArrayBuffer`, `string`])[]

### credentials?

> `optional` **credentials**: `RequestInit`\[`"credentials"`\]

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

### method?

> `optional` **method**: `RequestInit`\[`"method"`\]

### mode?

> `optional` **mode**: `RequestInit`\[`"mode"`\]

### redirect?

> `optional` **redirect**: `RequestInit`\[`"redirect"`\]

### referrer?

> `optional` **referrer**: `RequestInit`\[`"referrer"`\]

### referrerPolicy?

> `optional` **referrerPolicy**: `RequestInit`\[`"referrerPolicy"`\]

### type?

> `optional` **type**: `T`

## Defined in

[src/modules.d.ts:795](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L795)
