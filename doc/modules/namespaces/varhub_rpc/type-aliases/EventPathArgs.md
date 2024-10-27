[**@flinbein/varhub-web-clent**](../../../../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../../../../modules.md) / [modules](../../../README.md) / ["varhub:rpc"](../README.md) / EventPathArgs

# Type Alias: EventPathArgs\<PATH, FORM\>

> **EventPathArgs**\<`PATH`, `FORM`\>: `PATH` *extends* keyof `FORM` ? `FORM`\[`PATH`\] *extends* `any`[] ? `FORM`\[`PATH`\] : `never` : `PATH` *extends* [] ? `FORM` *extends* `any`[] ? `FORM` : `never` : `PATH` *extends* [infer STEP, `...(infer TAIL extends string[])`] ? `STEP` *extends* keyof `FORM` ? [`EventPathArgs`](EventPathArgs.md)\<`TAIL`, `FORM`\[`STEP`\]\> : `never` : `never`

## Type Parameters

• **PATH**

• **FORM**

## Defined in

[src/modules.d.ts:552](https://github.com/flinbein/varhub-web-client/blob/b4c6fcf02a5379525d4b3a67611612cbdf92318f/src/modules.d.ts#L552)
