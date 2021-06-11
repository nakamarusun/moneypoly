# Documentation for various socket.io EventEmitters used

## Server
### Emit
- dcerror: Server disconnects the client, because invalid query.
```js
{
    msg: String
}
```