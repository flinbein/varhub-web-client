import * as assert from "node:assert";
import { describe, it, mock } from "node:test";
import { RPCSource, RPCChannel, VarhubClient, Connection, Players } from "../src/index.js";
import { RoomSocketHandler } from "../src/RoomSocketHandler.js";
import { WebsocketMockRoom } from "./WebsocketMocks.js";
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

describe("RPCSource", () => {
	it("tests rpc", {timeout: 4000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		room.on("connection", con => con.open());
		roomWs.backend.open();
		await room.promise;
		
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
		await room.promise;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		
		const rpcRoom = new RPCSource({
			deck: () =>  deck,
			emitDeck: (value: number): undefined => {
				deck.emit("test", value)
			},
			disposeDeck: (reason: any): undefined => {
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
		const clientDeck1 = await new rpcClient.deck().promise;
		const clientDeck2 = await new rpcClient.deck().promise;
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
		await room.promise;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		
		const rpcRoom = new RPCSource({deck: () =>  deck, ping: () => undefined});
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
		await rpcClient.promise;
		
		const onError = mock.fn();
		const onClose = mock.fn();
		const onMessage = mock.fn();
		client.on("message", onMessage);
		const clientDeck = await new rpcClient.deck().promise; // wait for add client
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
		await room.promise;
		
		const deck = new RPCSource().withEventTypes<{"test": [number]}>();
		deck.dispose();
		
		const rpcRoom = new RPCSource({deck: () =>  deck});
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
		await rpcClient.promise;
		
		const onError = mock.fn();
		const onClose = mock.fn();
		const clientDeck = new rpcClient.deck();
		clientDeck.on("error", onError);
		clientDeck.on("close", onClose);
		await assert.rejects(clientDeck.promise, "client deck disposed");
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
		await room.promise;
		
		const deck = new RPCSource();
		const rpcRoom = new RPCSource({deck: () =>  deck});
		
		RPCSource.start(rpcRoom, room, {maxChannelsPerClient: 2});
		
		const clientWs = roomWs.createClientMock("Eve", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = new RPCChannel<typeof rpcRoom>(client);
		await rpcClient.promise;
		
		new rpcClient.deck();
		new rpcClient.deck();
		await assert.rejects(new rpcClient.deck().promise, "limit for 2 channels per client");
	})
	
	it("constructor channel", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		class Deck extends RPCSource<{getMyName(): string, changeState(a: number): undefined}, number, unknown> {
			constructor(baseState: number) {
				super({
					getMyName(){
						const connection = room.useConnection();
						return String(connection.parameters[0]);
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
		const rpcClient = await new RPCChannel<typeof rpcRoom>(client).promise;
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
		await room.promise;
		
		class Deck extends RPCSource<{getMyName(): string}> {
			declare private static connection: Connection;
			constructor() {
				const connection = new.target.connection;
				const connection2 = room.useConnection();
				if (connection !== connection2) throw new Error("dif connections");
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
		const rpcClient = await new RPCChannel<typeof rpcRoom>(client).promise;
		const deck = new rpcClient.Deck();
		assert.equal(await deck.getMyName(), "Bob", "deck returns name");
	})
	
	it("RPCSource base channel events", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		const rpcRoom = new RPCSource({}).withEventTypes<{test: [string]}>();
		void RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = await new RPCChannel<typeof rpcRoom>(client).promise;
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
		await room.promise;
		
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
			nope: () => null,
			getDisposed: (state: number) => {
				return decks.find(deck => deck.state === state)?.disposed
			},
		});
		
		RPCSource.start(rpcRoom, room);
		
		const clientWs = roomWs.createClientMock("Bob", "player");
		const client = new VarhubClient(clientWs);
		const rpcClient = await new RPCChannel<typeof rpcRoom>(client).promise;
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
		await room.promise;
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
		
		
		await Promise.all([nonameChannel, aliceChannel, bobChannel1, bobChannel2, charlieChannel].map(c => c.promise));
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
		await room.promise;
		
		const rpcRoom = new RPCSource({ping: () => true}, 100);
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 1)));
		const onState = mock.fn();
		clientRpc.on("state", onState);
		await clientRpc.promise;
		
		rpcRoom.setState(200);
		rpcRoom.setState(300);
		await clientRpc.ping();
		
		assert.deepEqual(onState.mock.calls.map(c => c.arguments), [[100], [200, 100], [300, 200]], "wrong");
	})
	
	it("new RPCSource state event", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
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
	
	it("RPCSource with prefix, useConnection", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		class MainRPC extends RPCSource.with("$")<number> {
			
			$userSetState(value: number){
				const connection = room.useConnection();
				this.setState(connection.parameters[1] as number + value)
			}
			
			$Deck = class Deck extends RPCSource<{}, string> {
				constructor(props: string) {
					super({}, "base_"+props);
				}
			}
		}
		const rpcRoom = new MainRPC(100);
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		await clientRpc.promise;
		assert.equal(clientRpc.state, 100, "main state");
		await clientRpc.userSetState(50);
		assert.equal(clientRpc.state, 2050, "main next state");
		const deck = new clientRpc.Deck("test1");
		await deck.promise;
		assert.equal(deck.state, "base_test1", "deck state");
	})
	
	it("RPCSource self param", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		class Deck extends RPCSource.with({}, 100) {}
		const roomDeck = new Deck();
		const rpcRoom = new RPCSource({MyDeck: roomDeck});
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		await clientRpc.promise;
		const deck = new clientRpc.MyDeck();
		await deck.promise;
		assert.equal(deck.state, 100, "deck state");
	})
	
	it("RPCSource self promise param", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		class Deck extends RPCSource.with({}, 100) {}
		const deckSourcePromise = Promise.resolve(new Deck);
		const rpcRoom = new RPCSource({MyDeck: deckSourcePromise});
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		await clientRpc.promise;
		const deck = new clientRpc.MyDeck();
		await deck.promise;
		assert.equal(deck.state, 100, "deck (as promise) state");
	})
	
	it("numeric enum events", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		const enum EVENT_KEYS {ONE = 1, TWO = 2}
		const RPC = RPCSource.with({ping: () => null})<undefined, {[EVENT_KEYS.ONE]: [string], [EVENT_KEYS.TWO]: [number]}>;
		const rpcRoom = new (RPC)();
		RPCSource.start(rpcRoom, room);
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		const oneEvents = mock.fn();
		const twoEvents = mock.fn();
		clientRpc.on(EVENT_KEYS.ONE, oneEvents);
		clientRpc.on(EVENT_KEYS.TWO, twoEvents);
		await clientRpc.promise;
		rpcRoom.emit(EVENT_KEYS.ONE, "test");
		rpcRoom.emit(EVENT_KEYS.TWO, 42);
		await clientRpc.ping();
		assert.equal(oneEvents.mock.callCount(), 1, "EVENT_KEYS.ONE called 1 time");
		assert.equal(twoEvents.mock.callCount(), 1, "EVENT_KEYS.TWO called 1 time");
		assert.deepEqual(oneEvents.mock.calls[0].arguments, ["test"], "EVENT_KEYS.ONE correct event");
		assert.deepEqual(twoEvents.mock.calls[0].arguments, [42], "EVENT_KEYS.TWO correct event");
	});
	
	it("numeric events", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		const rpcRoom = new (RPCSource.with({ping: () => null})<undefined, Record<string|number, any[]>>)();
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		const numEvents = mock.fn();
		const strEvents = mock.fn();
		clientRpc.on("1", strEvents);
		clientRpc.on(1, numEvents);
		await clientRpc.promise;
		rpcRoom.emit("1", 42);
		rpcRoom.emit(1, "test");
		await clientRpc.ping();
		assert.equal(strEvents.mock.callCount(), 1, "strEvent called 1 time");
		assert.equal(numEvents.mock.callCount(), 1, "numEvent called 1 time");
		assert.deepEqual(strEvents.mock.calls[0].arguments, [42], "strEvent correct event");
		assert.deepEqual(numEvents.mock.calls[0].arguments, ["test"], "numEvent correct event");
	});
	
	it("notify as main method", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		const rpcRoom = new RPCSource({
			notify: (x: number) => x + 1,
		});
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		assert.equal(clientRpc.notify.notify(100), undefined, "call notify.notify is void");
		assert.equal(await clientRpc.notify(100), 101, "call notify as main method");
	});
	
	it("notify of method", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		const rpcRoom = new RPCSource({
			updateData: (x: number) => {rpcRoom.setState(x)},
		}, 0);
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		await clientRpc.promise;
		assert.equal(clientRpc.state, 0, "base state = 0");
		clientRpc.updateData.notify(120);
		await new Promise(r => clientRpc.on("state", r));
		assert.equal(clientRpc.state, 120, "next state = 120");
	});
	
	it("source with any events", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler(roomWs);
		roomWs.backend.open();
		await room.promise;
		
		const rpcRoom = new RPCSource({});
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock("Bob", 2000)));
		await clientRpc.promise;
		const eventData = await new Promise(r => {
			clientRpc.on("custom-event", r);
			rpcRoom.emit("custom-event", 100);
		});
		assert.equal(eventData, 100, "custom event data");
	});
	
	it("source with validate method", {timeout: 10000}, async () => {
		const roomWs = new WebsocketMockRoom("room-id");
		await using room = new RoomSocketHandler<{data: string, parameters: [number]}>(roomWs);
		roomWs.backend.open();
		
		const allIsNumbers = (args: any[]) => args.every(v => typeof v === "number");
		
		const rpcRoom = new RPCSource({
			test0: RPCSource.validate(allIsNumbers, function(x, y){
				void (true satisfies Equal<typeof x, number>)
				void (true satisfies Equal<typeof y, number>)
				return ["result", x, y] as const;
			}),
		});
		RPCSource.start(rpcRoom, room);
		
		const clientRpc = new RPCChannel<typeof rpcRoom>(new VarhubClient(roomWs.createClientMock(1000)));
		await clientRpc.promise;
		
		// check types
		void (function() {
			const _test0 = clientRpc.test0(10, 20);
			void (true satisfies Equal<typeof _test0, Promise<readonly ["result", number, number]>>)
			
			// @ts-expect-error
			void clientRpc.test0("10", 20);
		})
	});
});