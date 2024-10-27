[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../README.md) / [modules](../../../README.md) / ["varhub:rpc"](../README.md) / EventPath

# Type Alias: EventPath\<T, K\>

> **EventPath**\<`T`, `K`\>: `K` *extends* `string` ? `T`\[`K`\] *extends* `any`[] ? `K` \| [`K`] : [`K`, ...(EventPath\<T\[K\]\> extends infer NEXT extends (...) \| (...) ? NEXT extends (...)\[\] ? NEXT : \[(...)\] : never)] : `never`

## Type Parameters

• **T**

• **K** *extends* keyof `T` = keyof `T`

## Defined in

[src/modules.d.ts:551](https://github.com/flinbein/varhub-web-client/blob/4a94dc210f3c914d7323a6335e147e209d01f647/src/modules.d.ts#L551)
