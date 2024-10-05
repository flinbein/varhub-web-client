import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { parse, serialize, XJData } from "@flinbein/xjmapper";
import { WebsocketMock, WebsocketMockRoom } from "./WebsocketMocks.js";
import { RoomSocketHandler } from "../src/RoomSocketHandler.js";

describe("Room init", async () => {
	await it("ok with await using", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using ignored = new RoomSocketHandler(wsMock);
		// async dispose
	});

	await it("resolves waitForReady", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
	});

	await it("rejects waitForReady", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.close();
		await assert.rejects(room.waitForReady);
	});

	await it("close backend", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.close();
		await assert.rejects(room.waitForReady);
		assert.equal(room.ready, false);
		assert.equal(room.closed, true);
	});
	
	await it("initialized id, publicMessage, integrity", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id", "msg", "x");
		await using  room = new RoomSocketHandler(wsMock);
		assert.equal(room.ready, false);
		assert.equal(room.closed, false);
		assert.equal(room.id, null);
		assert.equal(room.publicMessage, null);
		assert.equal(room.integrity, null);
		wsMock.backend.open();
		await room.waitForReady;
		assert.equal(room.ready, true);
		assert.equal(room.closed, false);
		assert.equal(room.id, "room-id");
		assert.equal(room.publicMessage, "msg");
		assert.equal(room.integrity, "x");
	});
})

describe("Room methods", async () => {
	await it("throws before ready", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		assert.throws(() => room.setPublicMessage("test"));
		assert.throws(() => room.broadcast("test"));
		assert.throws(() => room.send(1, "test"));
		assert.throws(() => room.kick(1));
		assert.throws(() => room.join(1));
	});
	await it("throws after close", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		wsMock.backend.close();
		await new Promise<void>(r => room.on("close", r));
		assert.throws(() => room.broadcast("test"));
		assert.throws(() => room.setPublicMessage("test"));
		assert.throws(() => room.send(1, "test"));
		assert.throws(() => room.kick(1));
		assert.throws(() => room.join(1));
	});
	
	await it("call room.setPublicMessage", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		assert.equal(room.publicMessage, null);
		room.setPublicMessage("msg");
		await new Promise(resolve => setTimeout(resolve, 31));
		assert.equal(room.publicMessage, "msg");
	});
	
	await it("call room.destroy", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		room.destroy();
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(room.ready, false, "room not ready");
		assert.equal(room.closed, true,  "room closed");
	});
	
	await it("call room.join", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.ok(room.lobbyConnections.has(bobWs.mockId), "bob in lobby");
		assert.ok(!room.onlineConnections.has(bobWs.mockId), "bob in offline");
		assert.equal(bobWs.readyState, WebSocket.CONNECTING, "bob is connecting");
		
		room.join(bobWs.mockId);
		assert.ok(!room.lobbyConnections.has(bobWs.mockId), "bob not in lobby");
		assert.ok(room.onlineConnections.has(bobWs.mockId), "bob is online");
		await new Promise(resolve => bobWs.addEventListener("open", resolve));
		assert.equal(bobWs.readyState, WebSocket.OPEN, "bob is connected");
	});
	
	await it("call room.kick for lobby", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		
		room.kick(bobWs.mockId);
		assert.ok(!room.lobbyConnections.has(bobWs.mockId), "bob not in lobby");
		assert.ok(!room.onlineConnections.has(bobWs.mockId), "bob is offline");
		await new Promise(resolve => bobWs.addEventListener("close", resolve));
		assert.equal(bobWs.readyState, WebSocket.CLOSED, "bob is disconnected");
	});
	
	await it("call room.kick for online", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		
		room.join(bobWs.mockId);
		assert.ok(room.onlineConnections.has(bobWs.mockId), "bob is online");
		await new Promise(resolve => bobWs.addEventListener("open", resolve));
		assert.equal(bobWs.readyState, WebSocket.OPEN, "bob is connected");
		
		room.kick(bobWs.mockId);
		assert.ok(!room.onlineConnections.has(bobWs.mockId), "bob is offline");
		assert.ok(!room.lobbyConnections.has(bobWs.mockId), "bob not in lobby");
		await new Promise(resolve => bobWs.addEventListener("close", resolve));
		assert.equal(bobWs.readyState, WebSocket.CLOSED, "bob is disconnected");
	})
	
	await it("call room.broadcast", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		room.join([bobWs.mockId, eveWs.mockId]);
		await Promise.all([
			new Promise(resolve => bobWs.addEventListener("open", resolve)),
			new Promise(resolve => eveWs.addEventListener("open", resolve))
		]);
		await new Promise(resolve => setTimeout(resolve, 12));
		
		room.broadcast("hello", "world");
		const messages = await Promise.all([
			new Promise<any>(resolve => bobWs.addEventListener("message", (e: any) => resolve(parse(e.data)))),
			new Promise<any>(resolve => eveWs.addEventListener("message", (e: any) => resolve(parse(e.data))))
		]);
		assert.deepEqual(messages, [["hello", "world"], ["hello", "world"]], "messages received");
	})
	
	await it("call room.send", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		
		const eveWs = wsMock.createClientMock("Eve", "player");
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		room.join([bobWs.mockId, eveWs.mockId]);
		await Promise.all([
			new Promise(resolve => eveWs.addEventListener("open", resolve)),
			new Promise(resolve => bobWs.addEventListener("open", resolve))
		]);
		await new Promise(resolve => setTimeout(resolve, 12));
		
		room.send(eveWs.mockId, "hello", "Eve");
		room.send(bobWs.mockId, "hello", "Bob");
		const messages = await Promise.all([
			new Promise<any>(resolve => eveWs.addEventListener("message", (e: any) => resolve(parse(e.data)))),
			new Promise<any>(resolve => bobWs.addEventListener("message", (e: any) => resolve(parse(e.data))))
		]);
		assert.deepEqual(messages, [["hello", "Eve"], ["hello", "Bob"]], "different messages received");
	});
	
	await it("call room.send, multi", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		room.join([bobWs.mockId, eveWs.mockId]);
		await Promise.all([
			new Promise(resolve => eveWs.addEventListener("open", resolve)),
			new Promise(resolve => bobWs.addEventListener("open", resolve))
		]);
		await new Promise(resolve => setTimeout(resolve, 12));
		
		room.send([eveWs.mockId, bobWs.mockId], "hello", "player");
		const messages = await Promise.all([
			new Promise<any>(resolve => bobWs.addEventListener("message", (e: any) => resolve(parse(e.data)))),
			new Promise<any>(resolve => eveWs.addEventListener("message", (e: any) => resolve(parse(e.data))))
		]);
		assert.deepEqual(messages, [["hello", "player"], ["hello", "player"]], "same messages received");
	});
});

describe("Room props", async () => {
	await it("props lobbyConnections, onlineConnections", {timeout: 200}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.waitForReady;
		assert.deepEqual(room.lobbyConnections, new Set([]));
		assert.deepEqual(room.onlineConnections, new Set([]));
		
		const aliceWs = wsMock.createClientMock("Alice");
		const bobWs = wsMock.createClientMock("Bob");
		const charlieWs = wsMock.createClientMock("Charlie");
		const eveWs = wsMock.createClientMock("Eve");
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.deepEqual(room.lobbyConnections, new Set([aliceWs.mockId, bobWs.mockId, charlieWs.mockId, eveWs.mockId]));
		assert.deepEqual(room.onlineConnections, new Set());
		
		room.join(bobWs.mockId);
		room.kick(eveWs.mockId);
		charlieWs.close();
		await new Promise(resolve => setTimeout(resolve, 32));
		assert.deepEqual(room.lobbyConnections, new Set([aliceWs.mockId]));
		assert.deepEqual(room.onlineConnections, new Set([bobWs.mockId]));
		
		room.join(aliceWs.mockId);
		room.kick(bobWs.mockId);
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.deepEqual(room.lobbyConnections, new Set([]));
		assert.deepEqual(room.onlineConnections, new Set([aliceWs.mockId]));
	})
})

describe("Room events", async () => {
	await it("emit init", {timeout: 200}, async () => {
		const onInit = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		room.on("init", onInit);
		assert.equal(onInit.mock.callCount(), 0);
		wsMock.backend.open();
		await room.waitForReady;
		assert.equal(onInit.mock.callCount(), 1);
		assert.deepEqual(onInit.mock.calls[0].arguments, []);
	});
	
	await it("emit close and error", {timeout: 200}, async () => {
		const onClose = mock.fn();
		const onError = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		room.on("close", onClose);
		room.on("error", onError);
		assert.equal(onClose.mock.callCount(), 0);
		assert.equal(onError.mock.callCount(), 0);
		wsMock.backend.close();
		await Promise.allSettled([room.waitForReady]);
		assert.equal(onClose.mock.callCount(), 1);
		assert.equal(onError.mock.callCount(), 1);
		assert.deepEqual(onClose.mock.calls[0].arguments, []);
		assert.deepEqual(onError.mock.calls[0].arguments, []);
	})
	
	
	await it("emit close only", {timeout: 200}, async () => {
		const onClose = mock.fn();
		const onError = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		room.on("close", onClose);
		wsMock.backend.open();
		await room.waitForReady;
		assert.equal(onClose.mock.callCount(), 0);
		wsMock.backend.close();
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(onClose.mock.callCount(), 1);
		assert.equal(onError.mock.callCount(), 0);
		assert.deepEqual(onClose.mock.calls[0].arguments, []);
	})
	
	
	await it("emit enter", {timeout: 200}, async () => {
		const onEnter = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		room.on("enter", onEnter);
		wsMock.backend.open();
		await room.waitForReady;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		
		assert.equal(onEnter.mock.callCount(), 2);
		assert.deepEqual(onEnter.mock.calls[0].arguments, [bobWs.mockId, "Bob", "player"]);
		assert.deepEqual(onEnter.mock.calls[1].arguments, [eveWs.mockId, "Eve", "player"]);
	});
	
	await it("emit join", {timeout: 200}, async () => {
		const onJoin = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using  room = new RoomSocketHandler(wsMock);
		room.on("enter", (c) => room.join(c));
		room.on("join", onJoin);
		wsMock.backend.open();
		await room.waitForReady;
		
		const eveWs = wsMock.createClientMock("Eve", "player");
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 32));
		
		assert.equal(onJoin.mock.callCount(), 2);
		assert.deepEqual(onJoin.mock.calls[0].arguments, [eveWs.mockId]);
		assert.deepEqual(onJoin.mock.calls[1].arguments, [bobWs.mockId]);
	})
	
	await it("emit messageChange", {timeout: 200}, async () => {
		const onMessageChange = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id", "a");
		await using room = new RoomSocketHandler(wsMock);
		room.on("messageChange", onMessageChange);
		wsMock.backend.open();
		await room.waitForReady;
		room.setPublicMessage("b");
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(onMessageChange.mock.callCount(), 1);
		assert.deepEqual(onMessageChange.mock.calls[0].arguments, ["b", "a"]);
	})
	
	await it("emit leave", {timeout: 200}, async () => {
		const onLeave = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock)
		room.on("leave", onLeave);
		wsMock.backend.open();
		await room.waitForReady;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		
		room.join(eveWs.mockId);
		await new Promise(resolve => setTimeout(resolve, 12));
		bobWs.close();
		eveWs.close();
		await new Promise(resolve => setTimeout(resolve, 32));
		assert.equal(onLeave.mock.callCount(), 2);
		assert.deepEqual(onLeave.mock.calls[0].arguments, [bobWs.mockId, false]);
		assert.deepEqual(onLeave.mock.calls[1].arguments, [eveWs.mockId, true]);
	})
	
	await it("emit message", {timeout: 200}, async () => {
		const onMessage = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock)
		room.on("enter", id => room.join(id));
		room.on("message", onMessage);
		wsMock.backend.open();
		await room.waitForReady;

		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		room.join(eveWs.mockId);
		room.join(eveWs.mockId);
		await new Promise(resolve => setTimeout(resolve, 12));
		bobWs.send(serialize("hello", "from Bob"));
		eveWs.send(serialize("hello", "from Eve"));
		await new Promise(resolve => setTimeout(resolve, 42));
		assert.equal(onMessage.mock.callCount(), 2);
		assert.deepEqual(onMessage.mock.calls[0].arguments, [bobWs.mockId, "hello", "from Bob"]);
		assert.deepEqual(onMessage.mock.calls[1].arguments, [eveWs.mockId, "hello", "from Eve"]);
	});
})
