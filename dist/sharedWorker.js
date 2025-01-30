class Room extends EventTarget {
    id;
    constructor(id) {
        super();
        this.id = id;
    }
}
class Hub {
    rooms = new Map();
}
const hub = new Hub();
self.addEventListener('connect', (event) => {
    const port = event.ports[0];
    let gotPing = true;
    const controls = {
        ping() {
            gotPing = true;
        },
        close() {
            closeConnection();
        }
    };
    port.addEventListener("message", ({ data }) => {
        const [command, ...args] = data;
        const control = controls[command];
        try {
            control(...args);
        }
        catch {
            closeConnection("wrong method");
        }
    });
    const pingInterval = setInterval(() => {
        port.postMessage(["ping"]);
    }, 5_000);
    const closeInterval = setInterval(() => {
        if (!gotPing)
            return closeConnection("closed by timeout");
        gotPing = false;
    }, 10_000);
    function closeConnection(reason) {
        clearTimeout(closeInterval);
        clearTimeout(pingInterval);
        port.close();
    }
});
export {};
//# sourceMappingURL=sharedWorker.js.map