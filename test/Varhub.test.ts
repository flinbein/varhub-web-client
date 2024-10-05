import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { Varhub } from "../src/Varhub.js";

describe("VarHub", () => {
	it("test url", {timeout: 100}, async () => {
		const hub = new Varhub("https://fake-url:9999/");
		assert.equal(hub.url, "https://fake-url:9999/");
		const hub2 = new Varhub("https://fake-url:9999/a/b/");
		assert.equal(hub2.url, "https://fake-url:9999/a/b/");
	})
	
	it("test join url", {timeout: 100}, async () => {
		const hub = new Varhub("https://fake-url:9999/");
		const ws = hub.join("room-id", {
			integrity: "1",
			params: ["a", "b"]
		})
		ws.close();
		assert.equal(ws.url, "wss://fake-url:9999/room/room-id?integrity=1&params=%5B%22a%22%2C%22b%22%5D");
		
		const hub2 = new Varhub("https://fake-url:9999/a/b/");
		const ws2 = hub2.join("room-id", {
			integrity: "1",
			params: ["a", "b"]
		})
		ws2.close();
		assert.equal(ws2.url, "wss://fake-url:9999/a/b/room/room-id?integrity=1&params=%5B%22a%22%2C%22b%22%5D");
	})
	
	it("test createLogger url", {timeout: 100}, async () => {
		const hub = new Varhub("https://fake-url:9999/");
		const ws = hub.createLogger("logger-id")
		ws.close();
		assert.equal(ws.url, "wss://fake-url:9999/log/logger-id");
		
		const hub2 = new Varhub("https://fake-url:9999/a/b/");
		const ws2 = hub2.createLogger("logger-id")
		ws2.close();
		assert.equal(ws2.url, "wss://fake-url:9999/a/b/log/logger-id");
	})
	
	it("test createRoomSocket url", {timeout: 100}, async () => {
		const hub = new Varhub("https://fake-url:9999/");
		const ws = hub.createRoomSocket({
			message: "msg",
			integrity: "custom:t",
		})
		ws.close();
		assert.equal(ws.url, "wss://fake-url:9999/room/ws?message=msg&integrity=custom%3At");
		
		const hub2 = new Varhub("https://fake-url:9999/a/b/");
		const ws2 = hub2.createRoomSocket({
			message: "msg",
			integrity: "custom:t",
		})
		ws2.close();
		assert.equal(ws2.url, "wss://fake-url:9999/a/b/room/ws?message=msg&integrity=custom%3At");
	})
});