import * as assert from "node:assert";
import { describe, it, mock } from "node:test";
import { parse, serialize } from "@flinbein/xjmapper";
import { WebsocketMockRoom } from "./WebsocketMocks.js";
import { RoomSocketHandler } from "../src/RoomSocketHandler.js";
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

describe("Room init", async () => {
	await it("ok with await using", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using _ignored = new RoomSocketHandler(wsMock);
		// async dispose
	});

	await it("resolves waitForReady", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		const room2 = await room.promise;
		assert.equal(room2, room);
	});

	await it("rejects waitForReady", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.close();
		await assert.rejects(room.promise);
	});

	await it("close backend", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.close();
		await assert.rejects(room.promise);
		assert.equal(room.ready, false);
		assert.equal(room.closed, true);
	});
	
	await it("initialized id, publicMessage, integrity", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id", "msg", "x");
		await using room = new RoomSocketHandler(wsMock);
		assert.equal(room.ready, false);
		assert.equal(room.closed, false);
		assert.equal(room.id, null);
		assert.equal(room.message, null);
		assert.equal(room.integrity, null);
		wsMock.backend.open();
		await room.promise;
		assert.equal(room.ready, true);
		assert.equal(room.closed, false);
		assert.equal(room.id, "room-id");
		assert.equal(room.message, "msg");
		assert.equal(room.integrity, "x");
	});
})

describe("Room methods", async () => {
	await it("throws before ready", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		assert.throws(() => room.message = "test");
		assert.throws(() => room.broadcast("test"));
	});
	
	await it("throws after close", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.promise;
		wsMock.createClientMock();
		wsMock.backend.close();
		await new Promise<void>(r => room.on("close", r));
		assert.throws(() => room.broadcast("test"));
		assert.throws(() => room.message = "test");
	});
	
	await it("set room.message", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.promise;
		assert.equal(room.message, null);
		room.message = "msg";
		await new Promise(resolve => setTimeout(resolve, 31));
		assert.equal(room.message, "msg");
	});
	
	await it("call room.destroy", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.promise;
		room.destroy();
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(room.ready, false, "room not ready");
		assert.equal(room.closed, true,  "room closed");
	});
	
	await it("call con.join", {timeout: 5000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		// infinity defer
		room.on("connection", con => con.defer(() => new Promise(() => {})));
		wsMock.backend.open();
		await room.promise;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 52));
		
		// infinity defer
		room.on("connection", con => con.defer(() => new Promise(() => {})));
		
		const bobClient = [...room.getConnections()][0]
		assert.ok(bobClient, "bob in lobby");
		assert.ok(!bobClient.ready, "bob in offline");
		assert.equal(bobWs.readyState, WebSocket.CONNECTING, "bob is connecting");
		
		const onOpen = mock.fn();
		const onClose = mock.fn();
		bobClient.on("open", onOpen);
		bobClient.on("close", onClose);
		bobClient.open();
		assert.ok(bobClient.ready, "bob is online");
		await new Promise(resolve => bobWs.addEventListener("open", resolve));
		assert.equal(bobWs.readyState, WebSocket.OPEN, "bob is connected");
		assert.equal(onOpen.mock.callCount(), 1, "onOpen call 1");
		assert.deepEqual(onOpen.mock.calls[0].arguments, [], "onOpen args");
		
		bobClient.close("kick bob");
		await new Promise(resolve => setTimeout(resolve, 52));
		assert.equal(bobWs.readyState, WebSocket.CLOSED, "bob is discconnected");
		assert.equal(onClose.mock.callCount(), 1, "onClose call 1");
		assert.deepEqual(onClose.mock.calls[0].arguments, ["kick bob", true], "onClose args");
	});
	
	await it("call room.kick for lobby", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		// infinity defer
		room.on("connection", con => con.defer(() => new Promise(() => {})));
		wsMock.backend.open();
		await room.promise;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		
		assert.equal(room.getConnections({ready: false}).size, 1, "bob in lobby");
		
		for (let connection of room.getConnections()) {
			connection.close("reason-to-close");
		}
		
		assert.equal(room.getConnections({ready: false}).size, 0, "bob not in lobby");
		assert.equal(room.getConnections({ready: true}).size, 0, "bob not in ready");
		await new Promise(resolve => bobWs.addEventListener("close", resolve));
		assert.equal(bobWs.readyState, WebSocket.CLOSED, "bob is disconnected");
	});
	
	await it("call room.broadcast", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.promise;
		
		room.on("connection", con => con.open());
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
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
	
	await it("call room.send", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		wsMock.backend.open();
		await room.promise;
		
		room.on("connection", con => con.open());
		const eveWs = wsMock.createClientMock("Eve", "player");
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		await Promise.all([
			new Promise(resolve => eveWs.addEventListener("open", resolve)),
			new Promise(resolve => bobWs.addEventListener("open", resolve))
		]);
		await new Promise(resolve => setTimeout(resolve, 12));
		
		for (let connection of room.getConnections()) {
			connection.send("hello", connection.parameters[0]);
		}
		const messages = await Promise.all([
			new Promise<any>(resolve => eveWs.addEventListener("message", (e: any) => resolve(parse(e.data)))),
			new Promise<any>(resolve => bobWs.addEventListener("message", (e: any) => resolve(parse(e.data))))
		]);
		assert.deepEqual(messages, [["hello", "Eve"], ["hello", "Bob"]], "different messages received");
	});
});

describe("Room props", async () => {
	await it("props lobbyConnections, onlineConnections", {timeout: 5000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		// infinity defer
		room.on("connection", con => con.defer(() => new Promise(() => {})));
		
		wsMock.backend.open();
		await room.promise;
		
		assert.deepEqual(room.getConnections({ready: true}), new Set([]));
		assert.deepEqual(room.getConnections({ready: false}), new Set([]));
		assert.deepEqual(room.getConnections(), new Set([]));
		
		const aliceWs = wsMock.createClientMock("Alice");
		const bobWs = wsMock.createClientMock("Bob");
		const charlieWs = wsMock.createClientMock("Charlie");
		const eveWs = wsMock.createClientMock("Eve");
		await new Promise(resolve => setTimeout(resolve, 52));
		
		const connectionsMap = new Map([...room.getConnections()].map((con) => [con.parameters[0] as string, con]))
		const alice = connectionsMap.get("Alice")!;
		const bob = connectionsMap.get("Bob")!;
		const charlie = connectionsMap.get("Charlie")!;
		const eve = connectionsMap.get("Eve")!;
		
		assert.deepEqual(room.getConnections(), new Set([alice, bob, charlie, eve]));
		assert.deepEqual(room.getConnections({ready: false}), new Set([alice, bob, charlie, eve]));
		assert.deepEqual(room.getConnections({ready: true}), new Set());
		
		bob.open()
		eve.close("eve-close");
		charlieWs.close();
		await new Promise(resolve => setTimeout(resolve, 32));
		assert.deepEqual(room.getConnections(), new Set([alice, bob]));
		assert.deepEqual(room.getConnections({ready: false}), new Set([alice]));
		assert.deepEqual(room.getConnections({ready: true}), new Set([bob]));
		
		alice.open()
		bob.close("bob-close")
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.deepEqual(room.getConnections(), new Set([alice]));
		assert.deepEqual(room.getConnections({ready: false}), new Set([]));
		assert.deepEqual(room.getConnections({ready: true}), new Set([alice]));
	})
})

describe("Room events", async () => {
	await it("emit init", {timeout: 2000}, async () => {
		const onReady = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		room.on("ready", onReady);
		assert.equal(onReady.mock.callCount(), 0);
		wsMock.backend.open();
		await room.promise;
		assert.equal(onReady.mock.callCount(), 1);
		assert.deepEqual(onReady.mock.calls[0].arguments, []);
	});
	
	await it("emit close and error", {timeout: 2000}, async () => {
		const onClose = mock.fn();
		const onError = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		const errorPromise = Promise.resolve("error-message");
		const getError = () => errorPromise;
		await using room = new RoomSocketHandler(wsMock, getError);
		room.on("close", onClose);
		room.on("error", onError);
		assert.equal(onClose.mock.callCount(), 0);
		assert.equal(onError.mock.callCount(), 0);
		wsMock.backend.close();
		await Promise.allSettled([room.promise]);
		assert.equal(onClose.mock.callCount(), 1);
		assert.equal(onError.mock.callCount(), 1);
		assert.deepEqual(onClose.mock.calls[0].arguments, []);
		assert.deepEqual(onError.mock.calls[0].arguments, [errorPromise]);
	})
	
	await it("async error", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		const errorPromise = Promise.resolve("error-message");
		const getError = () => errorPromise;
		await using room = new RoomSocketHandler(wsMock, getError);
		wsMock.backend.close();
		const [roomPromiseResult] = await Promise.allSettled([room.promise]);
		assert.equal(roomPromiseResult.status, "rejected");
		assert.equal(await (roomPromiseResult as any).reason.cause, "error-message");
	})
	
	await it("emit close only", {timeout: 2000}, async () => {
		const onClose = mock.fn();
		const onError = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		room.on("close", onClose);
		wsMock.backend.open();
		await room.promise;
		assert.equal(onClose.mock.callCount(), 0);
		wsMock.backend.close();
		await new Promise(resolve => setTimeout(resolve, 12));
		assert.equal(onClose.mock.callCount(), 1);
		assert.equal(onError.mock.callCount(), 0);
		assert.deepEqual(onClose.mock.calls[0].arguments, []);
	})
	
	
	await it("emit enter", {timeout: 2000}, async () => {
		const onConnection = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		room.on("connection", onConnection);
		wsMock.backend.open();
		await room.promise;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		const connectionsMap = new Map([...room.getConnections()].map((con) => [con.parameters[0] as string, con]))
		
		assert.equal(onConnection.mock.callCount(), 2);
		assert.deepEqual(onConnection.mock.calls[0].arguments, [connectionsMap.get("Bob"), "Bob", "player"]);
		assert.deepEqual(onConnection.mock.calls[1].arguments, [connectionsMap.get("Eve"), "Eve", "player"]);
	});
	
	await it("emit join", {timeout: 2000}, async () => {
		const onConnectionOpen = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		room.on("connection", (c) => c.open());
		room.on("connectionOpen", onConnectionOpen);
		wsMock.backend.open();
		await room.promise;
		
		const eveWs = wsMock.createClientMock("Eve", "player");
		const bobWs = wsMock.createClientMock("Bob", "player");
		await new Promise(resolve => setTimeout(resolve, 32));
		
		const connectionsMap = new Map([...room.getConnections()].map((con) => [con.parameters[0] as string, con]))
		
		assert.equal(onConnectionOpen.mock.callCount(), 2);
		assert.deepEqual(onConnectionOpen.mock.calls[0].arguments, [connectionsMap.get("Eve")]);
		assert.deepEqual(onConnectionOpen.mock.calls[1].arguments, [connectionsMap.get("Bob")]);
	})
	
	await it("emit leave", {timeout: 2000}, async () => {
		const onConnectionClose = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock)
		room.on("connectionClose", onConnectionClose);
		
		// infinity defer
		room.on("connection", con => con.defer(() => new Promise(() => {})));
		
		wsMock.backend.open();
		await room.promise;
		
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await new Promise(resolve => setTimeout(resolve, 12));
		
		const connectionsMap = new Map([...room.getConnections()].map((con) => [con.parameters[0] as string, con]))
		
		connectionsMap.get("Eve")!.open();
		await new Promise(resolve => setTimeout(resolve, 12));
		bobWs.close(4000, "bob-close");
		eveWs.close(4000, "eve-close");
		await new Promise(resolve => setTimeout(resolve, 32));
		assert.equal(onConnectionClose.mock.callCount(), 2);
		assert.deepEqual(onConnectionClose.mock.calls[0].arguments, [connectionsMap.get("Bob"), "bob-close", false]);
		assert.deepEqual(onConnectionClose.mock.calls[1].arguments, [connectionsMap.get("Eve"), "eve-close", true]);
	})
	
	await it("emit message", {timeout: 2000}, async () => {
		const onMessage = mock.fn();
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock)
		room.on("connection", con => con.open());
		room.on("connectionMessage", onMessage);
		wsMock.backend.open();
		await room.promise;

		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock("Eve", "player");
		await Promise.all([bobWs, eveWs].map((ws) => new Promise(r => ws.addEventListener("open", r))))
		const connectionsMap = new Map([...room.getConnections()].map((con) => [con.parameters[0] as string, con]));
		
		const bobOnMessage = mock.fn();
		const bob = connectionsMap.get("Bob")!;
		bob.on("message", bobOnMessage);
		
		const eveOnMessage = mock.fn();
		const eve = connectionsMap.get("Eve")!;
		eve.on("message", eveOnMessage);
		
		
		bobWs.send(serialize("hello", "from Bob"));
		eveWs.send(serialize("hello", "from Eve"));
		await new Promise(resolve => setTimeout(resolve, 42));
		assert.equal(onMessage.mock.callCount(), 2);
		assert.deepEqual(onMessage.mock.calls[0].arguments, [bob, "hello", "from Bob"]);
		assert.deepEqual(onMessage.mock.calls[1].arguments, [eve, "hello", "from Eve"]);
		
		assert.equal(bobOnMessage.mock.callCount(), 1);
		assert.deepEqual(bobOnMessage.mock.calls[0].arguments, ["hello", "from Bob"]);
		
		assert.equal(eveOnMessage.mock.callCount(), 1);
		assert.deepEqual(eveOnMessage.mock.calls[0].arguments, ["hello", "from Eve"]);
	});
	
	await it("this on event", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock);
		let thisEventValue: any;
		room.on("ready", function () {thisEventValue = this})
		wsMock.backend.open();
		await room.promise;
		assert.equal(thisEventValue, room, "this on event");
	});
	
	await it("validate and change parameters", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock).validate({
			parameters: (params) => params.length ? [String(params[0])] as const : false
		});
		const onConnection = mock.fn();
		room.on("connection", onConnection);
		wsMock.backend.open();
		const aliceWs = wsMock.createClientMock();
		const bobWs = wsMock.createClientMock("Bob", "player");
		const eveWs = wsMock.createClientMock(100, "ignored");
		
		await Promise.allSettled([aliceWs, bobWs, eveWs].map(ws => ws.promise));
		
		// check auto-inject types, typescript
		if (1 + 1 > 3) room.on("connection", (_con, ...args) => {
			void (true satisfies Equal<typeof args, [string]>)
		});
		// @ts-expect-error
		if (1 + 1 > 3) room.on("connection", (_con, name, unexpected) => {});
		
		// sockets
		assert.equal(aliceWs.readyState, WebSocket.CLOSED, "Alice ws closed");
		assert.equal(bobWs.readyState, WebSocket.OPEN, "Bob ws open");
		assert.equal(eveWs.readyState, WebSocket.OPEN, "Eve ws open");
		
		// connections
		const connections = [...room.getConnections()];
		assert.equal(connections.length, 2, "Only 2 connections");
		const bobConnection = connections.find(c => +c === bobWs.mockId)!;
		const eveConnection = connections.find(c => +c === eveWs.mockId)!;
		assert.deepEqual(bobConnection.parameters, ["Bob"], "valid Bob parameters");
		assert.deepEqual(eveConnection.parameters, ["100"], "valid Eve parameters");
		
		// connection types
		void (true satisfies Equal<typeof bobConnection.parameters, [string]>)
		
		// events
		assert.equal(onConnection.mock.callCount(), 2, "2 events");
		assert.deepEqual(onConnection.mock.calls[0].arguments, [bobConnection, "Bob"], "bob event");
		assert.deepEqual(onConnection.mock.calls[1].arguments, [eveConnection, "100"], "eve event");
	});
	
	await it("validate true parameters", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock).validate({
			parameters: (params) => params.every(p => typeof p === "number")
		});
		const onConnection = mock.fn();
		room.on("connection", onConnection);
		wsMock.backend.open();
		const aliceWs = wsMock.createClientMock();
		const bobWs = wsMock.createClientMock("Bob", 200);
		const eveWs = wsMock.createClientMock(100, 200);
		
		await Promise.allSettled([aliceWs, bobWs, eveWs].map(ws => ws.promise));
		
		// check auto-inject types, typescript
		if (1 + 1 > 3) room.on("connection", (_con, ...args) => {
			void (true satisfies Equal<typeof args, number[]>)
		});
		
		// sockets
		assert.equal(aliceWs.readyState, WebSocket.OPEN, "Alice ws open");
		assert.equal(bobWs.readyState, WebSocket.CLOSED, "Bob ws closed");
		assert.equal(eveWs.readyState, WebSocket.OPEN, "Eve ws open");
		
		// connections
		const connections = [...room.getConnections()];
		assert.equal(connections.length, 2, "Only 2 connections");
		const aliceConnection = connections.find(c => +c === aliceWs.mockId)!;
		const eveConnection = connections.find(c => +c === eveWs.mockId)!;
		assert.deepEqual(aliceConnection.parameters, [], "valid Alice parameters");
		assert.deepEqual(eveConnection.parameters, [100, 200], "valid Eve parameters");
		
		// connection types
		void (true satisfies Equal<typeof eveConnection.parameters, number[]>)
		
		// events
		assert.equal(onConnection.mock.callCount(), 2, "2 events");
		assert.deepEqual(onConnection.mock.calls[0].arguments, [aliceConnection], "alice event");
		assert.deepEqual(onConnection.mock.calls[1].arguments, [eveConnection, 100, 200], "eve event");
	});
	
	await it("validate message", {timeout: 2000}, async () => {
		const wsMock = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(wsMock).validate({
			clientMessage: (params) => params.length >= 2 && params.map(p => String(p))
		});
		const onConnectionMessage = mock.fn();
		room.on("connectionMessage", onConnectionMessage);
		wsMock.backend.open();
		const aliceWs = wsMock.createClientMock("Alice");
		const bobWs = wsMock.createClientMock("Bob");
		const eveWs = wsMock.createClientMock("Eve");
		await Promise.allSettled([aliceWs, bobWs, eveWs].map(ws => ws.promise));
		
		// sockets
		assert.equal(aliceWs.readyState, WebSocket.OPEN, "Alice ws open");
		assert.equal(bobWs.readyState, WebSocket.OPEN, "Bob ws open");
		assert.equal(eveWs.readyState, WebSocket.OPEN, "Eve ws open");
		
		// check auto-inject types, typescript
		if (1 + 1 > 3) {
			room.on("connectionMessage", (_con, ...args) => {
				void (true satisfies Equal<typeof args, string[]>)
			});
			const connection = [...room.getConnections()][0]!;
			connection.on("message", (...args) => {
				void (true satisfies Equal<typeof args, string[]>)
			})
		}
		
		bobWs.send(serialize("hello", "world", 100, true));
		eveWs.send(serialize("short"));
		await eveWs.closePromise; // close because only 1 arg;
		
		// events
		assert.equal(onConnectionMessage.mock.callCount(), 1, "1 event");
		assert.deepEqual(onConnectionMessage.mock.calls[0].arguments.slice(1), ["hello", "world", "100", "true"], "bob message as string");
	})
});