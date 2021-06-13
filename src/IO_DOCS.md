# Documentation for various socket.io EventEmitters used

## Server
### Emit
- dcerror: Server disconnects the client, because invalid query.
```js
{
    msg: String
}
```

- updateplayerlist: Server update the player list and broadcasts it.
```js
{
    players: [{
        name: String,
        bot: bool,
        host: bool
    }, ...]
}
```

## Client
### Emit
- kickplayer
```js
{
    player: number // Index of the player to kick
}
```

- addbot // Adds a new bot to the game
