import * as assert from "node:assert";
import { describe, it, mock } from "node:test";
import { VarhubClient } from "../src/VarhubClient.js";
import { WebsocketMockClientWithMethods } from "./WebsocketMocks.js";

describe("VarHubRpcClient", () => {
	it("tests ready", {timeout: 3000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.open();
		assert.equal(client.ready, true);
	})
	
	it("tests close now", {timeout: 1000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.close();
		await assert.rejects(client.promise);
		assert.equal(client.ready, false);
		assert.equal(client.closed, true);
	})
	
	it("tests close later", {timeout: 3000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.open();
		await client.promise;
		wsMock.backend.close();
		await new Promise(r => setTimeout(r, 52));
		assert.equal(client.ready, false);
		assert.equal(client.closed, true);
	})
	
	it("tests waitForReady", {timeout: 3000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		let ready = false;
		client.promise.then(() => ready = true);
		assert.equal(ready, false);
		wsMock.backend.open();
		await client.promise;
		assert.equal(ready, true);
	});
	
	it("tests waitForReady promise value", {timeout: 3000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.open();
		const client2 = await client.promise;
		assert.equal(client, client2);
		assert.equal(client.ready, true);
	});

	it("tests async method", {timeout: 3000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: async (x: number, y: number) => x + y
		});
		await using client = new VarhubClient(wsMock);
		wsMock.backend.open();
		const onMessage = mock.fn();
		client.on("message", onMessage);
		client.send("$rpc", undefined, 0, 9999, ["sum"], [100, 200]);
		await new Promise(resolve => setTimeout(resolve, 52));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments, ["$rpc", undefined, 0, 9999, 300]);
	})
	
	it("tests wrong method", {timeout: 1000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		const onMessage = mock.fn();
		wsMock.backend.open();
		client.on("message", onMessage);
		client.send("$rpc", undefined, 0, 9999, ["sum"], [100, 200]);
		await new Promise(resolve => setTimeout(resolve, 52));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments.slice(0, 4), ["$rpc", undefined, 3, 9999]);
	})
	
	it("tests this on event", {timeout: 1000}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubClient(wsMock);
		let thisValue: any;
		client.on("open", function (this: any) {thisValue = this});
		wsMock.backend.open();
		await client.promise;
		assert.equal(thisValue, client, "client this value");
	})
});