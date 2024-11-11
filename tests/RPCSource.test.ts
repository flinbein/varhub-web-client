import * as assert from "node:assert";
import { describe, it, mock } from "node:test";
import { RPCSource, RPCChannel, VarhubClient, Connection, Players } from "../src/index.js";
import { RoomSocketHandler } from "../src/RoomSocketHandler.js";
import { WebsocketMockRoom } from "./WebsocketMocks.js";

describe("RPCSource", () => {
	it("tests rpc", {timeout: 4000}, async () => {
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
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
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
	
	it("multi channels", {timeout: 10000}, async () => {
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
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
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
	
	it("close channels", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		
		const rpcRoom = new RPCSource({deck: () =>  deck, ping(){}});
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
		await rpcClient;
		
		const onError = mock.fn();
		const onClose = mock.fn();
		const onMessage = mock.fn();
		client.on("message", onMessage);
		const [clientDeck] = await new rpcClient.deck(); // wait for add client
		clientDeck.on("error", onError);
		clientDeck.on("close", onClose);
		deck.emit("test", 1);
		deck.emit("test", 2);
		deck.emit("test", 3);
		deck.emit("test", 4);
		deck.emit("test", 5);
		deck.emit("test", 6);
		clientDeck.close();
		await rpcClient.ping()
		deck.emit("test", 7);
		deck.emit("test", 8);
		deck.emit("test", 9);
		deck.emit("test", 10);
		deck.emit("test", 11);
		deck.emit("test", 12);
		await rpcClient.ping();
		assert.equal(onMessage.mock.callCount(), 9, "no other messages"); // [baseState, event x 6, callResult x 2]
		assert.equal(onError.mock.callCount(), 0, "no errors");
		assert.equal(onClose.mock.callCount(), 1, "1 close event");
	})
	
	it("disposed channel", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		deck.dispose();
		
		const rpcRoom = new RPCSource({deck: () =>  deck});
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
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
	
	it("channels limit", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource();
		const rpcRoom = new RPCSource({deck: () =>  deck});
		
		RPCSource.start(rpcRoom, room, {maxChannelsPerClient: 2});
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
		await rpcClient;
		
		new rpcClient.deck();
		new rpcClient.deck();
		await assert.rejects(Promise.resolve(new rpcClient.deck()), "limit for 2 channels per client");
	})
	
	it("constructor channel", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room;
		
		class Deck extends RPCSource<{getMyName(): string, changeState(a: number): void}, number, unknown> {
			constructor(baseState: number) {
				super({
					getMyName(this: Connection){
						return String(this.parameters[0]);
					},
					changeState: (value: number) => {
						this.setState(value);
					},
				}, baseState);
			}
		}
		const rpcRoom = new RPCSource({Deck});
		
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const [rpcClient] = await new RPCChannel<typeof rpcRoom>(client);
		const deck = new rpcClient.Deck(99);
		const onState = mock.fn();
		deck.on("state", onState);
		assert.equal(await deck.getMyName(), "Bob", "deck returns name");
		assert.equal(deck.state, 99, "deck base state");
		await deck.changeState(55);
		assert.equal(deck.state, 55, "deck next state");
	})
	
	it("connection in RPCSource constructor", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room;
		
		class Deck extends RPCSource<{getMyName(): string}> {
			declare private static connection: Connection;
			constructor() {
				const connection = new.target.connection;
				super({
					getMyName(this: Connection){
						return String(connection.parameters[0]);
					}
				});
			}
		}
		const rpcRoom = new RPCSource({Deck});
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const [rpcClient] = await new RPCChannel<typeof rpcRoom>(client);
		const deck = new rpcClient.Deck();
		assert.equal(await deck.getMyName(), "Bob", "deck returns name");
	})
	
	it("RPCSource base channel events", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room;
		
		const rpcRoom = new RPCSource({}).withEventTypes<{test: [string]}>();
		void RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const [rpcClient] = await new RPCChannel<typeof rpcRoom>(client);
		const onTest = mock.fn()
		rpcClient.on("test", onTest);
		rpcRoom.emit("test", "msg");
		await new Promise(r => setTimeout(r, 60));
		assert.equal(onTest.mock.callCount(), 1, "one event");
		assert.deepEqual(onTest.mock.calls[0].arguments, ["msg"], "event arguments exact");
	})
	
	it("RPCSource autoClose", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room;
		
		const decks: Deck[] = [];
		class Deck extends RPCSource<{}, number> {
			declare private static connection: Connection;
			declare private static autoClose: boolean;
			constructor(state: number, autoClose?: boolean) {
				super({}, state);
				decks.push(this);
				if (autoClose != null) new.target.autoClose = autoClose;
			}
		}
		const rpcRoom = new RPCSource({
			Deck,
			nope: () => {},
			getDisposed: (state: number) => {
				return decks.find(deck => deck.state === state)?.disposed
			},
		});
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const [rpcClient] = await new RPCChannel<typeof rpcRoom>(client);
		const deck1 = new rpcClient.Deck(1);
		assert.equal(await rpcClient.getDisposed(1), false, "deck1 not disposed");
		deck1.close();
		await rpcClient.nope();
		assert.equal(await rpcClient.getDisposed(1), true, "deck1 disposed");
		
		const deck2 = new rpcClient.Deck(2, true);
		assert.equal(await rpcClient.getDisposed(2), false, "deck2 not disposed");
		deck2.close();
		await rpcClient.nope();
		assert.equal(await rpcClient.getDisposed(2), true, "deck2 disposed");
		
		const deck3 = new rpcClient.Deck(3, false);
		assert.equal(await rpcClient.getDisposed(3), false, "deck3 not disposed");
		deck3.close();
		await rpcClient.nope();
		assert.equal(await rpcClient.getDisposed(3), false, "deck3 still not disposed");
	});
	
	it("RPCSource emit for", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room;
		const players = new Players(room, (_connection, arg) => arg ? String(arg) : null)
		
		const rpcRoom = new RPCSource({ping: () => true}).withEventTypes<{notify: [any]}>();
		RPCSource.start(rpcRoom, room);
		
		const onNonameNotify = mock.fn();
		const onAliceNotify = mock.fn();
		const onBobNotify1 = mock.fn();
		const onBobNotify2 = mock.fn();
		const onCharlieNotify = mock.fn();
		const nonameChannel = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock(undefined, 1))).on("notify", onNonameNotify);
		const aliceChannel = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Alice"))).on("notify", onAliceNotify);
		const bobChannel1 = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 1))).on("notify", onBobNotify1);
		const bobChannel2 = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2))).on("notify", onBobNotify2);
		const charlieChannel = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Charlie"))).on("notify", onCharlieNotify);
		
		
		await Promise.all([nonameChannel, aliceChannel, bobChannel1, bobChannel2, charlieChannel]);
		players.get("Alice")?.setTeam("redTeam");
		players.get("Bob")?.setTeam("redTeam");
		
		rpcRoom.emit("notify", "forAll"); // n a 1 2 c
		rpcRoom.emitFor(room.getConnections({ready: true}), "notify", "forAllConnections"); // n a 1 2 c
		rpcRoom.emitFor(players, "notify", "forPlayers"); // - a 1 2 c
		rpcRoom.emitFor([...players], "notify", "forPlayersArray"); // - a 1 2 c
		rpcRoom.emitFor(players.get("Alice"), "notify", "forAlice"); // - a - - -
		rpcRoom.emitFor(players.getTeam("redTeam"), "notify", "forRedTeam"); // - a 1 2 -
		rpcRoom.emitFor(players.getTeam(undefined), "notify", "forNoTeam"); // - - - - c
		
		for (let connection of room.getConnections({ready: true})) {
			if (connection.parameters[1] === 1) {
				rpcRoom.emitFor(connection, "notify", "forNumberOne"); // n - 1 - -
			}
		}
		
		await charlieChannel.ping();
		
		assert.deepEqual(
			onNonameNotify.mock.calls.flatMap(c => c.arguments),
			["forAll", "forAllConnections", "forNumberOne"],
			"events of Noname"
		);
		
		assert.deepEqual(
			onAliceNotify.mock.calls.flatMap(c => c.arguments),
			["forAll", "forAllConnections", "forPlayers", "forPlayersArray", "forAlice",  "forRedTeam"],
			"events of Alice"
		);
		
		assert.deepEqual(
			onBobNotify1.mock.calls.flatMap(c => c.arguments),
			["forAll", "forAllConnections", "forPlayers", "forPlayersArray", "forRedTeam", "forNumberOne"],
			"events of Bob 1"
		);
		
		assert.deepEqual(
			onBobNotify2.mock.calls.flatMap(c => c.arguments),
			["forAll", "forAllConnections", "forPlayers", "forPlayersArray", "forRedTeam"],
			"events of Bob 2"
		);
		
		assert.deepEqual(
			onCharlieNotify.mock.calls.flatMap(c => c.arguments),
			["forAll", "forAllConnections", "forPlayers", "forPlayersArray", "forNoTeam"],
			"events of Charlie"
		);
		
	})
	
	it("RPCSource state event", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
			await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room;
		
		const rpcRoom = new RPCSource({ping: () => true}, 100);
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 1)));
		const onState = mock.fn();
		clientRpc.on("state", onState);
		await clientRpc;
		
		rpcRoom.setState(200);
		rpcRoom.setState(300);
		await clientRpc.ping();
		
		assert.deepEqual(onState.mock.calls.map(c => c.arguments), [[100], [200, 100], [300, 200]], "wrong");
	})
	
	it("new RPCSource state event", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room;
		
		const deck = new RPCSource({ping: () => true}, 100);
		const rpcRoom = new RPCSource({Deck: () => deck});
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 1)));
		const clientDeck = new clientRpc.Deck()
		const onDeckState = mock.fn();
		assert.equal(clientDeck.state, undefined);
		clientDeck.on("state", onDeckState);
		await clientDeck.ping();
		assert.equal(clientDeck.state, 100);
		
		deck.setState(200);
		deck.setState(300);
		await clientDeck.ping();
		assert.equal(clientDeck.state, 300);
		
		assert.deepEqual(onDeckState.mock.calls.map(c => c.arguments), [[100], [200, 100], [300, 200]], "wrong");
	})
});