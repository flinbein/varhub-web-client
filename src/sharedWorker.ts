class Room extends EventTarget {
	constructor(public id: string) {
		super();
	}
}

class Hub {
	rooms = new Map<string, Room>();
}

const hub = new Hub();

// @ts-ignore
self.addEventListener('connect', (event: MessageEvent) => {
	const port = event.ports[0];
	let gotPing = true;
	const controls: Record<string, (...args: any) => any> = {
		ping(){
			gotPing = true;
		},
		close(){
			closeConnection();
		}
	}
	port.addEventListener("message", ({data}) => {
		const [command, ...args] = data;
		const control = controls[command];
		try {
			control(...args);
		} catch {
			closeConnection("wrong method");
		}
	});
	
	const pingInterval = setInterval(() => {
		port.postMessage(["ping"]);
	}, 5_000);
	
	const closeInterval = setInterval(() => {
		if (!gotPing) return closeConnection("closed by timeout");
		gotPing = false;
	}, 10_000);
	
	function closeConnection(reason?: any) {
		clearTimeout(closeInterval);
		clearTimeout(pingInterval);
		port.close();
	}
});