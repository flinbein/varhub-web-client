import * as assert from "node:assert";
import { describe, it, mock } from "node:test";
import { Varhub } from "../src/Varhub.js";

describe("VarHub", () => {
	it("tests url", {timeout: 100}, async () => {
		const hub = new Varhub("https://fake-url:9999/");
		assert.equal(hub.url, "https://fake-url:9999/");
		const hub2 = new Varhub("https://fake-url:9999/a/b/");
		assert.equal(hub2.url, "https://fake-url:9999/a/b/");
	})
	
	it("tests createLogger url", {timeout: 100}, async () => {
		const hub = new Varhub("https://fake-url:9999/");
		const ws = hub.createLogger("logger-id");
		ws.close();
		assert.equal(ws.url, "wss://fake-url:9999/log/logger-id");
		
		const hub2 = new Varhub("https://fake-url:9999/a/b/");
		const ws2 = hub2.createLogger("logger-id");
		ws2.close();
		assert.equal(ws2.url, "wss://fake-url:9999/a/b/log/logger-id");
	})
});