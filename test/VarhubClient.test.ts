import assert from "node:assert";
import { describe, it } from "node:test";
import { parse, serialize } from "@flinbein/xjmapper";
import { VarhubClient } from "../src/VarhubClient.js";
import { Varhub } from "../src/Varhub.js";

class MockEvent extends Event {
	constructor(type: string, fields: any) {
		super(type);
		for (let fieldsKey in fields) {
			(this as any)[fieldsKey] = fields[fieldsKey];
		}
	}
}

class WebsocketMock extends EventTarget {
	readyState: number = WebSocket.CONNECTING;
	
	constructor(private methods: Record<string, Function> = {}) {
		super();
	}
	
	close(code?: number, reason?: string){
		this.readyState = WebSocket.CLOSING;
		setTimeout(() => {
			this.readyState = WebSocket.CLOSED;
			this.dispatchEvent(new MockEvent("close", {code, reason}));
		}, 10);
	}
	
	async send(binData: Uint8Array) {
		const [currentCallId, method, ...params] = parse(binData);
		try {
			const result = await this.methods[method as any](...params);
			const data = serialize(0, currentCallId, result).buffer;
			this.dispatchEvent(new MockEvent("message", {data}));
		} catch (error: any) {
			const data = serialize(1, currentCallId, error).buffer;
			this.dispatchEvent(new MockEvent("message", {data}));
		}
	}
	
	init(){
		this.readyState = WebSocket.OPEN;
		this.dispatchEvent(new MockEvent("message", {data: null}));
	}
	
	sendEvent(...args: any){
		const data = serialize(2, ...args).buffer;
		this.dispatchEvent(new MockEvent("message", {data}));
	}
}

const mockHub = new Varhub("http://example.com/");

function createMockClient<
	const T extends Record<string, any> = any,
>(methods?: T): <E extends Record<string, any>>() => VarhubClient<T, E> & {wsMock: WebsocketMock} {
	return () => {
		const wsMock = new WebsocketMock(methods ?? {});
		const client = new VarhubClient(wsMock as any, mockHub, "00000", "player", {}) as any;
		client.wsMock = wsMock;
		return client;
	};
}

describe("VarHubClient", () => {
	it("test ready", {timeout: 100}, async () => {
		const client = createMockClient()();
		assert.equal(client.ready, false);
		client.wsMock.init();
		assert.equal(client.ready, true);
	})
	
	it("test waitForReady", {timeout: 100}, async () => {
		const client = createMockClient()();
		let ready = false;
		client.waitForReady.then(() => ready = true);
		assert.equal(ready, false);
		client.wsMock.init();
		await client.waitForReady;
		assert.equal(ready, true);
	});
	
	it("test method", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: (x: number, y: number) => x + y
		})();
		client.wsMock.init();
		const result = await client.methods.sum(1, 2);
		assert.equal(result, 3);
	})
	
	it("test async method", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: async (x: number, y: number) => x + y
		})();
		client.wsMock.init();
		const result = await client.methods.sum(1, 2);
		assert.equal(result, 3);
	})
	
	it("test wrong method", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: (x: number, y: number) => x + y
		})();
		client.wsMock.init();
		await assert.rejects(client.methods["notexist" as keyof typeof client.methods](1, 2));
	})
	
	it("test throw method", {timeout: 100}, async () => {
		const client = createMockClient({
			sumThrow: (x: number, y: number) => { throw x + y }
		})();
		client.wsMock.init();
		await assert.rejects(client.methods.sumThrow(1, 2), error => error === 3);
	})
	
	it("test call", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: (x: number, y: number) => x + y
		})();
		client.wsMock.init();
		const result = await client.call("sum", 1, 2);
		assert.equal(result, 3);
	})
	
	it("test messages", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: (x: number, y: number) => x + y
		})<{greet: [string]}>();
		client.wsMock.init();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		client.messages.on("greet", addGreet);
		client.wsMock.sendEvent("greet", "hi");
		client.wsMock.sendEvent("not-greet", "none");
		client.wsMock.sendEvent("greet", "hello");
		client.messages.off("greet", addGreet);
		client.wsMock.sendEvent("greet", "unexpected");
		assert.deepEqual(greetEvents, [["hi"], ["hello"]]);
	})
	
	it("test once messages", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: (x: number, y: number) => x + y
		})<{greet: [string]}>();
		client.wsMock.init();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		client.messages.once("greet", addGreet);
		client.wsMock.sendEvent("greet", "hi");
		client.wsMock.sendEvent("greet", "hello");
		assert.deepEqual(greetEvents, [["hi"]]);
	});
	
	
	
	it("test once messages off", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: (x: number, y: number) => x + y
		})<{greet: [string]}>();
		client.wsMock.init();
		const greetEvents: any[] = [];
		const addGreet = (...args: any[]) => void greetEvents.push(args)
		client.messages.once("greet", addGreet);
		client.messages.off("greet", addGreet);
		client.wsMock.sendEvent("greet", "hi");
		client.wsMock.sendEvent("greet", "hello");
		assert.deepEqual(greetEvents, []);
	})
	
	it("test event message", {timeout: 100}, async () => {
		const client = createMockClient({
			sum: (x: number, y: number) => x + y
		})<{greet: [string]}>();
		client.wsMock.init();
		const messageEvents: any[] = [];
		const addEvent = (...args: any[]) => void messageEvents.push(args)
		client.on("message", addEvent);
		client.wsMock.sendEvent("greet", "hi");
		client.wsMock.sendEvent("not-greet", "none");
		client.wsMock.sendEvent("greet", "hello");
		client.off("message", addEvent);
		client.wsMock.sendEvent("greet", "unexpected");
		assert.deepEqual(messageEvents, [["greet","hi"], ["not-greet", "none"], ["greet","hello"]]);
	})
	
	it("test event close self", {timeout: 100}, async () => {
		const client = createMockClient()();
		client.wsMock.init();
		assert.equal(client.online, true);
		client.close("closeReason");
		assert.equal(client.online, false);
		const reason = await new Promise(r => client.once("close", r));
		assert.equal(client.online, false);
		assert.equal(reason, "closeReason");
	})
	
	it("test event close host", {timeout: 100}, async () => {
		const client = createMockClient()();
		client.wsMock.init();
		assert.equal(client.online, true);
		client.wsMock.close(4000, "closeReason");
		assert.equal(client.online, false);
		const reason = await new Promise(r => client.once("close", r));
		assert.equal(client.online, false);
		assert.equal(reason, "closeReason");
	})
	
	it("test method throws on close", {timeout: 100}, async () => {
		const client = createMockClient({
			delay: () => new Promise(() => {}) // always pending
		})();
		client.wsMock.init();
		const delayPromise = client.methods.delay();
		assert.equal(client.online, true);
		client.wsMock.close(4000, "closeReason");
		assert.equal(client.online, false);
		await assert.rejects(delayPromise, (error: any) => error.message === "closeReason");
	})
	
	it("test method this", {timeout: 100}, async () => {
		const client = createMockClient({})<{greet: [string]}>();
		client.wsMock.init();
		let refThis1: any = undefined,refThis2: any = undefined;
		client.messages.once("greet", function(){refThis1 = this});
		client.on("message",  function(){refThis2 = this});
		client.wsMock.sendEvent("greet");
		assert.equal(client, refThis1);
		assert.equal(client, refThis2);
	})
});