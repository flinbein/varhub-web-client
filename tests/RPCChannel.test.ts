import * as assert from "node:assert";
import test, { it } from "node:test";
import { RPCChannel } from "../src/RPCChannel.js";
import { VarhubClient } from "../src/VarhubClient.js";
import { WebsocketMockClientWithMethods } from "./WebsocketMocks.js";

test.describe("RPCChannel", () => {
	it("tests ready", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel(client);
		assert.equal(rpc.ready, false);
		wsMock.backend.open();
		assert.equal(rpc.ready, true);
	})

	it("tests close now", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel(client);
		assert.equal(rpc.ready, false);
		wsMock.backend.close();
		await assert.rejects(async () => await rpc);
		assert.equal(rpc.ready, false);
		assert.equal(rpc.closed, true);
	})

	it("tests close later", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel(client);
		assert.equal(rpc.ready, false);
		wsMock.backend.open();
		await rpc;
		wsMock.backend.close();
		await new Promise(r => setTimeout(r, 12));
		assert.equal(rpc.ready, false);
		assert.equal(rpc.closed, true);
	})

	it("tests method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: (x: number, y: number) => x + y
		});
			await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		const result = await rpc.sum(1, 2);
		assert.equal(result, 3);
	})

	it("tests method deep", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			math: {
				sum: (x: number, y: number) => x + y
			}
		});
			await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		const result = await rpc.math.sum(1, 2);
		assert.equal(result, 3);
	})

	it("tests async method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: async (x: number, y: number) => x + y
		});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		const result = await rpc.sum(100, 200);
		assert.equal(result, 300);
	})

	it("tests wrong method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: (x: number, y: number) => x + y
		});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		await assert.rejects((rpc as any).notexist(100, 200));
	})

	it("tests throw method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sumThrow: (x: number, y: number) => { throw x + y }
		});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		await assert.rejects(rpc.sumThrow(100, 200), error => error === 300);
	})

	it("tests call", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: (x: number, y: number) => x + y
		});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		const result = await rpc.call(["sum"], 1, 2);
		assert.equal(result, 3);
	})

	it("tests async call", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: async (x: number, y: number) => x + y
		});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		const result = await rpc.call(["sum"], 1, 2);
		assert.equal(result, 3);
	})

	it("tests messages", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods, {greet: [string]}>(client);
		wsMock.backend.open();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		rpc.on("greet", addGreet);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["hi", "world"]);
		wsMock.backend.sendData("$rpc", undefined, 4, ["not-greet"], ["none"]);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["hello"]);
		await new Promise(r => setTimeout(r, 20));
		rpc.off("greet", addGreet);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["unexpected"]);
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(greetEvents, [["hi", "world"], ["hello"]]);
	});
	
	it("tests deep message", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<{}, {data: {greet: [string]}}>(client);
		wsMock.backend.open();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args);
		rpc.data.on("greet", addGreet);
		wsMock.backend.sendData("$rpc", undefined, 4, ["data", "wrong"], ["unexpected"]);
		wsMock.backend.sendData("$rpc", undefined, 4, ["data", "greet"], ["hi", "world"]);
		wsMock.backend.sendData("$rpc", undefined, 4, ["wrong", "greet"], ["unexpected"]);
		await new Promise(r => setTimeout(r, 20));
		rpc.data.off("greet", addGreet);
		wsMock.backend.sendData("$rpc", undefined, 4, ["data", "greet"], ["unexpected"]);
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(greetEvents, [["hi", "world"]]);
	})

	it("tests once messages", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock)
		using rpc = new RPCChannel<typeof wsMock.methods, {greet: [string]}>(client);
		wsMock.backend.open();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		rpc.once("greet", addGreet);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["hi"]);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["hello"]);
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(greetEvents, [["hi"]]);
	});

	it("tests once messages off", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods, {greet: [string]}>(client);
		wsMock.backend.open();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		rpc.once("greet", addGreet);
		rpc.off("greet", addGreet);
		wsMock.backend.sendData("$rpc", undefined, 0, ["greet"], ["hi"]);
		wsMock.backend.sendData("$rpc", undefined, 0, ["greet"], ["hello"]);
		await new Promise(r => setTimeout(r, 20));
		assert.deepEqual(greetEvents, []);
	})

	it("tests event message", {timeout: 1200}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods, {greet: [string]}>(client);
		wsMock.backend.open();
		const messageEvents: any[] = [];
		const addEvent = (...args: any[]) => void messageEvents.push(args)
		rpc.on("greet", addEvent);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["hi"]);
		wsMock.backend.sendData("$rpc", undefined, 4, ["not-greet"], ["none"]);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["hello"]);
		await new Promise(r => setTimeout(r, 120));
		rpc.off("greet", addEvent);
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["unexpected"]);
		await new Promise(r => setTimeout(r, 120));
		assert.deepEqual(messageEvents, [["hi"], ["hello"]]);
	})

	it("tests event close self", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel(client);
		wsMock.backend.open();
		await rpc;
		assert.equal(rpc.ready, true);
		assert.equal(rpc.closed, false);
		client.close("closeReason");
		const reason = await new Promise(r => rpc.once("close", r));
		assert.equal(rpc.ready, false);
		assert.equal(rpc.closed, true);
		assert.equal(reason, "closeReason");
	})

	it("tests event close host", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel(client);
		wsMock.backend.open();
		await rpc;
		assert.equal(rpc.ready, true);
		assert.equal(rpc.closed, false);
		wsMock.close(4000, "closeReason");
		const reason = await new Promise(r => rpc.once("close", r));
		assert.equal(rpc.ready, false);
		assert.equal(rpc.closed, true);
		assert.equal(reason, "closeReason");
	})

	it("tests method throws on close", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			delay: () => new Promise(() => {}) // always pending
		});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods>(client);
		wsMock.backend.open();
		const delayPromise = rpc.delay();
		assert.equal(rpc.ready, true);
		wsMock.close(4000, "closeReason");
		await assert.rejects(delayPromise, (error: any) => error.message === "closeReason");
		assert.equal(rpc.ready, false);
	})

	it("tests method this", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<typeof wsMock.methods, {greet: [string]}>(client);
		wsMock.backend.open();
		let refThis1: any = "unexpected";
		rpc.once("greet", function(){refThis1 = this as any});
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["data"]);
		await new Promise(r => setTimeout(r, 20));
		assert.equal(rpc, refThis1);
	})
	
	it("this event init", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel(client);
		let thisEventValue: any;
		rpc.on("init", function(this: any){thisEventValue = this});
		wsMock.backend.open();
		await rpc;
		assert.equal(thisEventValue, rpc, "this event value");
	})
	
	it("this event custom", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<{}, {greet: []}>(client);
		const eventFormPromise = new Promise<{value: any}>((resolve) => {
			rpc.on("greet", function(this: any){resolve({value: this})});
		})
		wsMock.backend.open();
		wsMock.backend.sendData("$rpc", undefined, 4, ["greet"], ["data"]);
		assert.equal((await eventFormPromise).value, rpc, "this event value");
	})
	
	it("this event deep custom", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		using rpc = new RPCChannel<{}, {deep: {greet: []}}>(client);
		const eventFormPromise = new Promise<{value: any}>((resolve) => {
			rpc.deep.once("greet", function(this: any){resolve({value: this})});
		})
		wsMock.backend.open();
		wsMock.backend.sendData("$rpc", undefined, 4, ["deep", "greet"], ["data"]);
		assert.equal((await eventFormPromise).value, rpc.deep, "this event value");
	})
});