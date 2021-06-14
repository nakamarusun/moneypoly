# Redis data structure

### Master
room: Hash
```js
{
    server: String, // Destination server
    expire: Number, // Time since epoch that this room will expire
}
```

### Worker
room: Hash
```js
{
    status: RoomStatus(int),
    data: {
        host: String // Username of the host
        players: [{
            u: String, // Username of the player
            b: bool // Whether this player is a bot
        }]
    }, // Data about the player
    count: Number, // Amount of players in the room
}
```

# Documentation for various socket.io EventEmitters used

## Server
### Emit
- dcerror: Server disconnects the client, because invalid query.
```js
{
    msg: String
}
```

- startgame: Server broadcast to all client to show the board.

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

- addbot: Adds a new bot to the game
- startgame: only host will be accepted. Starts the game if there is >= 2 players.