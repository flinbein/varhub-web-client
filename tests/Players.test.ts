import * as assert from "node:assert";
import test, { it, mock } from "node:test";
import { WebsocketMockRoom } from "./WebsocketMocks.js";
import Players from "../src/Players.js";
import { RoomSocketHandler } from "../src/RoomSocketHandler.js";

test.describe("Players", () => {
	it("join and leave", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("test");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		
		const players = new Players(room, (_con, name) => name ? String(name) : null);
		const onPlayerJoin = mock.fn();
		const onPlayerOnline = mock.fn();
		const onPlayerOffline = mock.fn();
		const onPlayerLeave = mock.fn();
		players.on("join", onPlayerJoin);
		players.on("leave", onPlayerLeave);
		players.on("online", onPlayerOnline);
		players.on("offline", onPlayerOffline);
		
		assert.deepEqual(players.all(), new Set(), "no players on init");
		
		const bobWs = roomWs.createClientMock("Bob");
		await new Promise(resolve => bobWs.addEventListener("open", resolve, { once: true }));
		
		const bobPlayer = players.get("Bob")!;
		const onOnline = mock.fn();
		const onOffline = mock.fn();
		const onLeave = mock.fn();
		bobPlayer.on("offline", onOffline);
		bobPlayer.on("online", onOnline);
		bobPlayer.on("leave", onLeave);
		
		assert.deepEqual(onPlayerJoin.mock.calls[0]?.arguments, [bobPlayer], "player join event");
		
		assert.equal(players.count, 1, "1 player");
		assert.equal(bobPlayer.online, true, "bob online");
		assert.deepEqual(new Set(players), new Set([bobPlayer]), "players by iterator");
		assert.deepEqual(players.all(), new Set([bobPlayer]), "players.all");
		
		bobWs.close(4000, "close-bob-reason");
		await new Promise<void>(r => bobPlayer.once("offline", r))
		
		assert.deepEqual(onOffline.mock.calls[0]?.arguments, [], "offline event");
		assert.deepEqual(onPlayerOffline.mock.calls[0]?.arguments, [bobPlayer], "player offline event");
		assert.equal(bobPlayer.online, false, "bob offline");
		assert.equal(players.count, 1, "still 1 player");
		
		const bobWs2 = roomWs.createClientMock("Bob");
		await new Promise(resolve => bobWs2.addEventListener("open", resolve, { once: true }));
		
		assert.deepEqual(new Set(players), new Set([bobPlayer]), "still same player");
		assert.deepEqual(onOnline.mock.calls[0]?.arguments, [], "online event");
		assert.deepEqual(onPlayerOnline.mock.calls[0]?.arguments, [bobPlayer], "player online event");
		assert.equal(bobPlayer.registered, true, "bob registered");
		
		bobPlayer.kick("kick-reason");
		await new Promise(resolve => bobWs2.addEventListener("close", resolve, {once: true }));
		
		assert.equal(bobPlayer.registered, false, "bob disposed");
		assert.equal(players.count, 0, "no players after kick");
		assert.equal(bobPlayer.online, false, "player offline");
		assert.deepEqual(onLeave.mock.calls[0]?.arguments, [], "leave event");
		assert.deepEqual(onPlayerLeave.mock.calls[0]?.arguments, [bobPlayer], "player leave event");
		assert.deepEqual(bobWs2.readyState, WebSocket.CLOSED, "bob ws closed");
	});
	
	it("function with validation", {timeout: 3000}, async () => {
		const roomWs = new WebsocketMockRoom("test");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		
		const players = new Players(room, (_connection, name, password) => {
			if (password !== "pass") throw new Error("wrong password");
			if (name == null) return null;
			return String(name);
		});
		
		const bobWs1 = roomWs.createClientMock("Bob", "pass", 1);
		const bobWs2 = roomWs.createClientMock("Bob", "wrong", 2);
		const bobWs3 = roomWs.createClientMock("Bob", "pass", 3);
		const pedroWs = roomWs.createClientMock("Pedro", "wrong");
		const onClose = mock.fn();
		bobWs2.addEventListener("close", onClose);
		await new Promise(r => pedroWs.addEventListener("error", r));
		assert.deepEqual(new Set(players), new Set([players.get("Bob")]), "Bob joined");
		
		assert.equal(bobWs1.readyState, WebSocket.OPEN, "Bob1 ws open");
		assert.equal(bobWs2.readyState, WebSocket.CLOSED, "Bob2 ws closed");
		assert.equal(bobWs3.readyState, WebSocket.OPEN, "Bob3 ws open");
		assert.equal(pedroWs.readyState, WebSocket.CLOSED, "Pedro ws closed");
		assert.deepEqual(players.get("Bob")?.connections.size, 2, "Bob has 2 connections");
		assert.equal(onClose.mock.calls[0].arguments[0].reason, "Error: wrong password", "close reason");
	})
	
	it("async function with connection actions", {timeout: 3000}, async () => {
		const roomWs = new WebsocketMockRoom("test");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		
		const players = new Players(room, async (connection, name, action) => {
			await new Promise(r => setTimeout(r, 10));
			if (action === "close") connection.close();
			if (action === "open") connection.open();
			if (action === "throw") throw new Error();
			await new Promise(r => setTimeout(r, 10));
			return String(name);
		});
		
		const aliceWs = roomWs.createClientMock("Alice");
		const bobWs = roomWs.createClientMock("Bob", "open");
		const charlieWs = roomWs.createClientMock("Charlie", "throw");
		const eveWs = roomWs.createClientMock("Eve", "close");
		
		await new Promise(r => setTimeout(r, 100));
		
		assert.equal(aliceWs.readyState, WebSocket.OPEN, "Alice ws open");
		assert.equal(bobWs.readyState, WebSocket.OPEN, "Bob2 ws open");
		assert.equal(charlieWs.readyState, WebSocket.CLOSED, "Charlie ws close");
		assert.equal(eveWs.readyState, WebSocket.CLOSED, "Eve ws close");
		assert.deepEqual(new Set(players), new Set([players.get("Alice")]), "players Alice only");
	});
	
	it("iterate on connections", {timeout: 3000}, async () => {
		const roomWs = new WebsocketMockRoom("test");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		
		const players = new Players(room, (_con, name) => String(name));
		
		const bobWsList = [
			roomWs.createClientMock("Bob", 1),
			roomWs.createClientMock("Bob", 2),
			roomWs.createClientMock("Bob", 3),
		]
		
		await Promise.all(bobWsList.map(ws => new Promise(r => ws.addEventListener("open", r))))
		
		const params = new Set();
		for (let connection of players.get("Bob")!) {
			params.add(connection.parameters[1])
		}
		assert.deepEqual(params, new Set([1, 2, 3]), "connections successfully iterated");
		
		for (let connection of players.get("Bob")!) connection.close();
		
		assert.equal(players.get("Bob")!.online, false, "bob offline now");
	})
	
	it("groups", {timeout: 3000}, async () => {
		const roomWs = new WebsocketMockRoom("test");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		
		const players = new Players(room, (_con, name) => String(name));
		
		const aliceWs = roomWs.createClientMock("Alice");
		const bobWs = roomWs.createClientMock("Bob");
		const charlieWs = roomWs.createClientMock("Charlie");
		const eveWs = roomWs.createClientMock("Eve");
		
		await Promise.all(
			[aliceWs, bobWs, charlieWs, eveWs].map(
				ws => new Promise(r => ws.addEventListener("open", r))
			)
		);
		const [alice, bob, charlie, eve] = ["Alice", "Bob", "Charlie", "Eve"].map(name => players.get(name)!);
		
		alice.setGroup("redTeam");
		bob.setGroup("redTeam");
		charlie.setGroup("blueTeam");
		
		assert.deepEqual(players.getGroup("redTeam"), new Set([alice, bob]));
		assert.deepEqual(players.getGroup("blueTeam"), new Set([charlie]));
		assert.deepEqual(players.getGroup("greenTeam"), new Set());
		assert.deepEqual(players.getGroup(undefined), new Set(eve));
		
		alice.setGroup("blueTeam");
		assert.deepEqual(players.getGroup("redTeam"), new Set([bob]));
		assert.deepEqual(players.getGroup("blueTeam"), new Set([alice, charlie]));
		
	})
	
	it("new player on new join", {timeout: 3000}, async () => {
		const roomWs = new WebsocketMockRoom("test");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		
		const players = new Players(room, (_con, name) => String(name));
		
		const bobWs1 = roomWs.createClientMock("Bob");
		await new Promise(r => bobWs1.addEventListener("open", r));
		
		const bob1 = players.get("Bob")!;
		bob1.kick();
		
		const bobWs2 = roomWs.createClientMock("Bob");
		await new Promise(r => bobWs2.addEventListener("open", r));
		
		const bob2 = players.get("Bob")!;
		
		assert.notEqual(bob1, bob2, "different players");
		assert.equal(bob1.registered, false, "Bob1 gone");
		assert.equal(bob2.registered, true, "Bob2 here");
	})
	
	it("this leave", {timeout: 3000}, async () => {
		const roomWs = new WebsocketMockRoom("test");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		
		const players = new Players(room, (_con, name) => name ? String(name) : null);
		const joinPromiseThisValue = new Promise<any>(resolve => {
			players.on("join", function (this: any){resolve(this)});
		})
		roomWs.createClientMock("Bob");
		assert.equal(await joinPromiseThisValue, players, "this value is players");
	})
});
// end of file