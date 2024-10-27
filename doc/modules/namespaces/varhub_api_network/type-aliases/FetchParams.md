[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [modules](../../../README.md) / ["varhub:api/network"](../README.md) / FetchParams

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

[src/modules.d.ts:806](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/modules.d.ts#L806)
