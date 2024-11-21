# RPC contract

All incoming and outgoing PRC messages extends this type:
```typescript
type RPCMessage<T = "$rpc"> = [
  key: T,
  channelId: number | undefined,
  action: number,
  ...data: any[]
];
```

---

## Client to Room

### Call remote method
```typescript
type ClientMessageCall = [
  key: string, // default: "$rpc"
  channelId: number /* subchannel */ | undefined /* default channel */,
  action: 0, // CLIENT_ACTION.CALL
  responseKey: any, // room will respond with this key
  path: string[], // path to remote function
  arguments: any[] // call function with this arguments  
]
```
Handler will respond with:
* [HandlerMessageCallResult](#method-call-result) if channel exists.
* [HandlerMessageChannelClosed](#channel-closed) if channel closed or not exists.

### Notify
```typescript
type ClientMessageCall = [
  key: string, // default: "$rpc"
  channelId: number /* subchannel */ | undefined /* default channel */,
  action: 3, // CLIENT_ACTION.NOTIFY
  path: string[], // path to remote function
  arguments: any[] // call function with this arguments  
]
```
No response for this message. Even if handler throws an exception.

### Request state
```typescript
type ClientMessageCall = [
  key: string, // default: "$rpc"
  channelId: number /* subchannel */ | undefined /* default channel */,
  action: 0, // CLIENT_ACTION.CALL
]
```
Handler will respond with:
* [HandlerMessageChannelState](#channel-created-or-state-updated) if channel exists.
* [HandlerMessageChannelClosed](#channel-closed) if channel closed or not exists.


### Close channel
default channel can not be closed;
```typescript
type ClientMessageClose = [
  key: string, // default: "$rpc"
  channelId: number,
  action: 1, // CLIENT_ACTION.CLOSE
  reason: any // call function with this arguments
]
```
No response is expected from the handler.

### Create new channel
```typescript
type ClientMessageCreate = [
    key: string, // default: "$rpc"
    currentChannelId: number /* subchannel */ | undefined /* default channel */,
    action: 2, // CLIENT_ACTION.CALL
    newChannelId: number, // room will respond with this key
    path: string[], // path to remote constructor
    arguments: any[] // call constructor with this arguments    
]
```
handler will respond with:
* [HandlerMessageChannelState](#channel-created-or-state-updated) on success
* [HandlerMessageChannelClosed](#channel-closed) on error


---

## Room to Client

### Method call result
```typescript
type HandlerMessageCallResult = [
    key: string, // default: "$rpc"
    channelId: number /* subchannel */ | undefined /* default channel */,
    action: 0 | 3, // REMOTE_ACTION.RESPONSE_OK | REMOTE_ACTION.RESPONSE_ERROR
    responseKey: any, // from ClientMessageCall
    result: any, // result of function call or error    
]
```

### Channel closed
default channel can not be closed;
```typescript
type HandlerMessageChannelClosed = [
  key: string, // default: "$rpc"
  channelId: number,
  action: 1, // REMOTE_ACTION.CLOSE
  closeReason: any, // result of function call or error
]
```

### Channel created or state updated
```typescript
type HandlerMessageChannelState = [
  key: string, // default: "$rpc"
  channelId: number,
  action: 2, // REMOTE_ACTION.STATE
  state: any, // state value of channel
]
```

### Channel emit event
```typescript
type HandlerMessageChannelEvent = [
    key: string, // default: "$rpc"
    channelId: number,
    action: 4, // REMOTE_ACTION.EVENT
    eventPath: string[], // path to subsciber, event name included
    eventData: any[]
]
```