# RPC API
The API allows you to create methods that a client can call.

---

You can create an separate RPCSource and allow clients to subscribe on it by method:
```javascript
// VM code
import RPCSource from "varhub:rpc";

// create new counter source
const counter = new RPCSource({}, 0);

setInterval(() => {
  counter.setState(counter.state + 1);
}, 1000);

// allow clients to subscribe on counter
// export function which returns an instance of RPCSource
export function Counter(){
  return counter;
}
```
```javascript
// client code
const rpc = new RPCSource(client);

// subscribe on counter; Always call with "new" keyword!
const counter = new rpc.Counter();
counter.on("state", (value) => {
  console.log(value); // get all state changes
});

setTimeout(() => counter.close(), 10000) // unsubscribe;

```

---

You can create an individual RPCSource for every client
```javascript
// VM code
import RPCSource from "varhub:rpc";

// export class, allow to create new instance by client
export class Counter extends RPCSource {
  #interval
	
  constructor(initialValue) {
    // you can get current connection in constructor by `new.target.connection`
    console.log(new.target.connection);  
    
    super({}, initialValue);
    this.#interval = setInterval(() => {
      this.setState(this.state + 1);
    }, 1000)
  }
  
  // the counter will be automatically disposed when the client disconnects from it
  // override `dispose` method to handle closure
  dispose(reason){
    clearInterval(this.#interval);
    super.dispose(reason);
  }
}
```
```javascript
// client code
const rpc = new RPCSource(client);

const counter1 = new rpc.Counter(0); // individual counter
const counter2 = new rpc.Counter(1000); // individual counter
counter1.on("state", (value) => {
  console.log(value); // 0, 1, 2, ...
});
counter2.on("state", (value) => {
  console.log(value); // 1000, 1001, 1002, ...
});

setTimeout(() => {
  counter1.close();
  counter2.close();
}, 10000);
```