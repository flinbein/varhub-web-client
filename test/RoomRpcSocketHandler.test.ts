import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { WebsocketMockRoom } from "./WebsocketMocks.js";
import { RoomRpcSocketHandler } from "../src/RoomRpcSocketHandler.js";
import { VarhubRpcClient } from "../src/VarhubRpcClient.js";

describe("RpcRoom", async () => {
	await it("call method", {timeout: 200}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomRpcSocketHandler(roomWs, {
			sum: (x: number, y: number) => x + y
		});
		roomWs.backend.open();
		await room.waitForReady;
		room.on("enter", id => room.join(id));
		const bobWs = roomWs.createClientMock("Bob");
		const client = new VarhubRpcClient<typeof room.methods>(bobWs);
		await client.waitForReady;
		assert.equal(await client.methods.sum(1, 2), 3);
	});
	
	await it("send event on join", {timeout: 200}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomRpcSocketHandler(roomWs, {});
		roomWs.backend.open();
		await room.waitForReady;
		room.on("enter", id => {
			room.join(id);
			room.sendEvent(id, "hello", "world")
		});
		const bobWs = roomWs.createClientMock("Bob");
		const client = new VarhubRpcClient<typeof room.methods>(bobWs);
		const onMessage = mock.fn();
		client.on("message", onMessage);
		await client.waitForReady;
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments, ["hello", "world"]);
	});
	
	await it("send event by method", {timeout: 200}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomRpcSocketHandler(roomWs, {
			send() {
				room.sendEvent(this.connection, "hello", "world")
			}
		});
		roomWs.backend.open();
		await room.waitForReady;
		
		room.on("enter", id => room.join(id));
		const bobWs = roomWs.createClientMock("Bob");
		const client = new VarhubRpcClient<typeof room.methods, {hello: [string]}>(bobWs);
		const onMessage = mock.fn();
		client.messages.on("hello", onMessage);
		await client.waitForReady;
		
		await client.methods.send();
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments, ["world"]);
	});
	
	await it("broadcast event on join", {timeout: 200}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomRpcSocketHandler(roomWs, {});
		roomWs.backend.open();
		await room.waitForReady;
		room.on("enter", id => {
			room.join(id);
			room.broadcastEvent("hello", "world")
		});
		const bobWs = roomWs.createClientMock("Bob");
		const client = new VarhubRpcClient<typeof room.methods, {hello: [string]}>(bobWs);
		const onMessage = mock.fn();
		client.messages.on("hello", onMessage);
		await client.waitForReady;
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments, ["world"]);
	});
	
	await it("send event by method", {timeout: 200}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomRpcSocketHandler(roomWs, {
			send() {
				room.broadcastEvent("hello", "world")
			}
		});
		roomWs.backend.open();
		await room.waitForReady;
		room.on("enter", id => room.join(id));
		const bobWs = roomWs.createClientMock("Bob");
		const client = new VarhubRpcClient<typeof room.methods>(bobWs);
		const onMessage = mock.fn();
		client.on("message", onMessage);
		await client.waitForReady;
		await client.methods.send();
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(onMessage.mock.callCount(), 1);
		assert.deepEqual(onMessage.mock.calls[0].arguments, ["hello", "world"]);
	});
})