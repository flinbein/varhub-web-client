import assert from "node:assert";
import { describe, it } from "node:test";
import { serialize } from "@flinbein/xjmapper";
import { VarhubRpcClient } from "../src/VarhubRpcClient.js";
import { WebsocketMockClientWithMethods } from "./WebsocketMocks.js";

describe("VarHubRpcClient", () => {
	it("test ready", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using  client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.open();
		assert.equal(client.ready, true);
	})
	
	it("test close now", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using  client = new VarhubRpcClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.close();
		await assert.rejects(client.waitForReady);
		assert.equal(client.ready, false);
		assert.equal(client.closed, true);
	})
	
	it("test close later", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using  client = new VarhubRpcClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.open();
		await client.waitForReady;
		wsMock.backend.close();
		await new Promise(r => setTimeout(r, 12));
		assert.equal(client.ready, false);
		assert.equal(client.closed, true);
	})

	it("test waitForReady", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using  client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		let ready = false;
		client.waitForReady.then(() => ready = true);
		assert.equal(ready, false);
		wsMock.backend.open();
		await client.waitForReady;
		assert.equal(ready, true);
	});

	it("test method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: (x: number, y: number) => x + y
		});
		await using client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		wsMock.backend.open();
		const result = await client.methods.sum(1, 2);
		assert.equal(result, 3);
	})

	it("test async method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: async (x: number, y: number) => x + y
		});
		await using client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		wsMock.backend.open();
		const result = await client.methods.sum(1, 2);
		assert.equal(result, 3);
	})

	it("test wrong method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: (x: number, y: number) => x + y
		});
		await using client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		wsMock.backend.open();
		await assert.rejects(client.methods["notexist" as keyof typeof client.methods](1, 2));
	})

	it("test throw method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sumThrow: (x: number, y: number) => { throw x + y }
		});
		await using client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		wsMock.backend.open();
		await assert.rejects(client.methods.sumThrow(1, 2), error => error === 3);
	})

	it("test call", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: (x: number, y: number) => x + y
		});
		await using client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		wsMock.backend.open();
		const result = await client.call("sum", 1, 2);
		assert.equal(result, 3);
	})

	it("test async call", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: async (x: number, y: number) => x + y
		});
		await using client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		wsMock.backend.open();
		const result = await client.call("sum", 1, 2);
		assert.equal(result, 3);
	})

	it("test messages", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRpcClient<typeof wsMock.methods, {greet: [string]}>(wsMock);
		wsMock.backend.open();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		client.messages.on("greet", addGreet);
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hi"));
		wsMock.backend.send(serialize("$rpcEvent", "not-greet", "none"));
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hello"));
		await new Promise(r => setTimeout(r, 20));
		client.messages.off("greet", addGreet);
		wsMock.backend.send(serialize("$rpcEvent", "greet", "unexpected"));
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(greetEvents, [["hi"], ["hello"]]);
	})

	it("test once messages", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRpcClient<typeof wsMock.methods, {greet: [string]}>(wsMock);
		wsMock.backend.open();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		client.messages.once("greet", addGreet);
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hi"));
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hello"));
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(greetEvents, [["hi"]]);
	});



	it("test once messages off", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRpcClient<typeof wsMock.methods, {greet: [string]}>(wsMock);
		wsMock.backend.open();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		client.messages.once("greet", addGreet);
		client.messages.off("greet", addGreet);
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hi"));
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hello"));
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(greetEvents, []);
	})

	it("test event message", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRpcClient<typeof wsMock.methods, {greet: [string]}>(wsMock);
		wsMock.backend.open();
		const messageEvents: any[] = [];
		const addEvent = (...args: any[]) => void messageEvents.push(args)
		client.on("message", addEvent);
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hi"));
		wsMock.backend.send(serialize("$rpcEvent", "not-greet", "none"));
		wsMock.backend.send(serialize("$rpcEvent", "greet", "hello"));
		await new Promise(r => setTimeout(r, 20));
		client.off("message", addEvent);
		wsMock.backend.send(serialize("$rpcEvent", "greet", "unexpected"));
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(messageEvents, [["greet","hi"], ["not-greet", "none"], ["greet","hello"]]);
	})

	it("test event close self", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRpcClient(wsMock);
		wsMock.backend.open();
		assert.equal(client.online, true);
		client.close("closeReason");
		assert.equal(client.online, false);
		const reason = await new Promise(r => client.once("close", r));
		assert.equal(client.online, false);
		assert.equal(reason, "closeReason");
	})

	it("test event close host", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRpcClient(wsMock);
		wsMock.backend.open();
		assert.equal(client.online, true);
		wsMock.close(4000, "closeReason");
		assert.equal(client.online, false);
		const reason = await new Promise(r => client.once("close", r));
		assert.equal(client.online, false);
		assert.equal(reason, "closeReason");
	})

	it("test method throws on close", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			delay: () => new Promise(() => {}) // always pending
		});
		await using client = new VarhubRpcClient<typeof wsMock.methods>(wsMock);
		wsMock.backend.open();
		const delayPromise = client.methods.delay();
		assert.equal(client.online, true);
		wsMock.close(4000, "closeReason");
		assert.equal(client.online, false);
		await assert.rejects(delayPromise, (error: any) => error.message === "closeReason");
	})

	it("test method this", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRpcClient<typeof wsMock.methods, {greet: [string]}>(wsMock);
		wsMock.backend.open();
		let refThis1: any = undefined;
		let refThis2: any = undefined;
		client.messages.once("greet", function(){refThis1 = this as any});
		client.on("message",  function(){refThis2 = this as any});
		wsMock.backend.send(serialize("$rpcEvent", "greet"));
		await new Promise(r => setTimeout(r, 20));
		assert.equal(client, refThis1);
		assert.equal(refThis2, client);
	})
});