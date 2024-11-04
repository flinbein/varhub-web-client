[**@flinbein/varhub-web-clent**](../README.md) • **Docs**

***

[@flinbein/varhub-web-clent](../README.md) / VM API

# VM API

API for Varhub VM

## Example

```typescript
import room from "varhub:room";

room.on("connectionOpen", (con) => {
    room.broadcast("user joined", com.parameters[0]);
    con.send("welcome!");
})

room.on("connectionClose", (con) => {
    room.broadcast("user left", com.parameters[0]);
})

room.on("connectionMessage", (con, ...args) => {
    room.broadcast("user said", com.parameters[0], ...args);
})
```
