import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { VarhubRawClient } from "../src/VarhubRawClient.js";
import { WebsocketMockClientWithMethods } from "./WebsocketMocks.js";

describe("VarHubRpcClient", () => {
	it("test ready", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
			await using  client = new VarhubRawClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.open();
		assert.equal(client.ready, true);
	})
	
	it("test close now", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using  client = new VarhubRawClient(wsMock);
		assert.equal(client.ready, false);
		wsMock.backend.close();
		await assert.rejects(client.waitForReady);
		assert.equal(client.ready, false);
		assert.equal(client.closed, true);
	})
	
	it("test close later", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using  client = new VarhubRawClient(wsMock);
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
		await using  client = new VarhubRawClient(wsMock);
		let ready = false;
		client.waitForReady.then(() => ready = true);
		assert.equal(ready, false);
		wsMock.backend.open();
		await client.waitForReady;
		assert.equal(ready, true);
	});

	it("test async method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({
			sum: async (x: number, y: number) => x + y
		});
		await using client = new VarhubRawClient(wsMock);
		wsMock.backend.open();
		const onMessage = mock.fn();
		client.on("message", onMessage);
		client.send("$rpc", 100500, "sum", 1, 2);
		await new Promise(resolve => setTimeout(resolve, 32));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments, ["$rpcResult", 100500, 0, 3]);
	})

	it("test wrong method", {timeout: 100}, async () => {
		const wsMock = new WebsocketMockClientWithMethods({});
		await using client = new VarhubRawClient(wsMock);
		const onMessage = mock.fn();
		wsMock.backend.open();
		client.on("message", onMessage);
		client.send("$rpc", 100500, "sum", 1, 2);
		await new Promise(resolve => setTimeout(resolve, 32));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments.slice(0, 3), ["$rpcResult", 100500, 1]);
	})
});