[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:rpc"](../README.md) / EventPathArgs

# Type Alias: EventPathArgs\<PATH, FORM\>

> **EventPathArgs**\<`PATH`, `FORM`\>: `PATH` *extends* keyof `FORM` ? `FORM`\[`PATH`\] *extends* `any`[] ? `FORM`\[`PATH`\] : `never` : `PATH` *extends* [] ? `FORM` *extends* `any`[] ? `FORM` : `never` : `PATH` *extends* [infer STEP, `...(infer TAIL extends string[])`] ? `STEP` *extends* keyof `FORM` ? [`EventPathArgs`](EventPathArgs.md)\<`TAIL`, `FORM`\[`STEP`\]\> : `never` : `never`

## Type Parameters

• **PATH**

• **FORM**

## Defined in

[src/modules.d.ts:549](https://github.com/flinbein/varhub-web-client/blob/aa44d85b8fc9ef58d47827a2d69f4ed0b37f6112/src/modules.d.ts#L549)
