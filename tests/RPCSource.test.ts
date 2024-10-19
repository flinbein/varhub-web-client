import * as assert from "node:assert";
import { describe, it, mock } from "node:test";
import { RPCChannel } from "../src/RPCChannel.js";
import { VarhubClient } from "../src/VarhubClient.js";
import { RoomSocketHandler } from "../src/RoomSocketHandler.js";
import { WebsocketMockRoom } from "./WebsocketMocks.js";
import { RPCSource } from "../src/RPCSource.js";

describe("RPCSource", () => {
	it("tests rpc", {timeout: 400}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource({
			test(value: number) {
				deck.emit(["deep","tested"], value);
				return true
			}
		}).withEventTypes<{deep: {tested: [number]}}>();
		
		const rpcRoom = new RPCSource({
			math: {sum: (x: number, y: number) => x + y},
			deck: () =>  deck,
			hello: (name: string) => "Hello, " + name + "!",
		}).withEventTypes<{test: [number], deep: {deepTest: [boolean]}}>();
		
		RPCSource.start(rpcRoom, room, "$rpc");
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client, "$rpc");
		await rpcClient;
		
		assert.equal(await rpcClient.hello("Bobby"), "Hello, Bobby!", "hello message");
		assert.equal(await rpcClient.math.sum(100, 200), 300, "math.sum");
		
		const clientDeck = new rpcClient.deck();
		const testedPromise = new Promise(r => clientDeck.deep.on("tested", r));
		assert.equal(clientDeck.ready, false, "clientDeck not ready");
		assert.equal(await clientDeck.test(99), true, "clientDeck call test");
		assert.equal(clientDeck.ready, true, "clientDeck ready");
		assert.equal(await testedPromise, 99, "got test message");
	})
	
	it("multi channels", {timeout: 1000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		
		const rpcRoom = new RPCSource({
			deck: () =>  deck,
			emitDeck: (value: number) => {
				deck.emit("test", value)
			},
			disposeDeck: (reason: any) => {
				deck.dispose(reason);
			}
		});
		
		RPCSource.start(rpcRoom, room, "$rpc");
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client, "$rpc");
		await rpcClient;
		
		const testMock1 = mock.fn();
		const testMock2 = mock.fn();
		const [clientDeck1] = await new rpcClient.deck();
		const [clientDeck2] = await new rpcClient.deck();
		clientDeck1.on("test", testMock1);
		clientDeck2.on("test", testMock2);
		
		await rpcClient.emitDeck(99);
		assert.deepEqual(testMock1.mock.calls[0].arguments, [99], "mock1 1st event");
		assert.deepEqual(testMock2.mock.calls[0].arguments, [99], "mock2 1st event");
		
		clientDeck1.close("close-just-ok");
		assert.ok(clientDeck1.closed, "mock1 closed");
		assert.ok(!clientDeck2.closed, "mock2 not closed");
		await rpcClient.emitDeck(55);
		assert.deepEqual(testMock1.mock.callCount(), 1, "mock1 no 2nd event");
		assert.deepEqual(testMock2.mock.calls?.[1]?.arguments, [55], "mock2 2nd event");
		
		const onClose2 = mock.fn();
		
		clientDeck2.on("close", onClose2);
		await rpcClient.disposeDeck("dispose-deck-reason");
		await assert.rejects(rpcClient.emitDeck(66), "can not emit on disposed source");
		assert.ok(clientDeck2.closed, "mock2 closed");
		assert.deepEqual(onClose2.mock.calls[0].arguments, ["dispose-deck-reason"], "mock 2 close event");
	});
	
	it("close channels", {timeout: 1000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		
		const rpcRoom = new RPCSource({deck: () =>  deck});
		
		RPCSource.start(rpcRoom, room, "$rpc");
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client, "$rpc");
		await rpcClient;
		
		const onError = mock.fn();
		const onClose = mock.fn();
		const onMessage = mock.fn();
		client.on("message", onMessage);
		const [clientDeck] = await new rpcClient.deck(); // wait for add client
		clientDeck.on("error", onError)
		clientDeck.on("close", onClose)
		deck.emit("test", 1);
		deck.emit("test", 2);
		clientDeck.close();
		await new Promise(resolve => setTimeout(resolve, 32)); // wait for close on backend
		deck.emit("test", 3);
		deck.emit("test", 4);
		await new Promise(resolve => setTimeout(resolve, 32)); // wait for collect message
		assert.equal(onMessage.mock.callCount(), 3, "no other messages");
		assert.equal(onError.mock.callCount(), 0, "no errors");
		assert.equal(onClose.mock.callCount(), 1, "1 close event");
	})
	
	it("disposed channel", {timeout: 1000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		deck.dispose();
		
		const rpcRoom = new RPCSource({deck: () =>  deck});
		
		RPCSource.start(rpcRoom, room, "$rpc");
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client, "$rpc");
		await rpcClient;
		
		const onError = mock.fn();
		const onClose = mock.fn();
		const clientDeck = new rpcClient.deck();
		clientDeck.on("error", onError);
		clientDeck.on("close", onClose);
		await assert.rejects(Promise.resolve(clientDeck), "client deck disposed");
		assert.equal(onError.mock.callCount(), 1, "emit error 1 time");
		assert.equal(onError.mock.calls[0].arguments.length, 1, "emit error");
		assert.ok(onError.mock.calls[0].arguments[0] instanceof Error, "emit error type");
		assert.equal(onClose.mock.callCount(), 1, "emit close 1 time");
		assert.equal(onClose.mock.calls[0].arguments.length, 1, "emit close");
		assert.ok(onClose.mock.calls[0].arguments[0] instanceof Error, "emit error type");
	});
	
	it("channels limit", {timeout: 1000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource();
		const rpcRoom = new RPCSource({deck: () =>  deck});
		
		RPCSource.start(rpcRoom, room, "$rpc", {maxChannelsPerClient: 2});
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client, "$rpc");
		await rpcClient;
		
		new rpcClient.deck();
		new rpcClient.deck();
		await assert.rejects(Promise.resolve(new rpcClient.deck()), "limit for 2 channels per client");
	})
});