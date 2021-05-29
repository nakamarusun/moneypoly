// Replace this later
const destServer = "http://localhost:8083";

// Load the socket io instance
function connectSock() {
    // Download the script and executes it from the worker server
    const ioscr = document.createElement('script');
    ioscr.onload = IO.initConnection;
    ioscr.src = destServer + "/socket.io/socket.io.js";

    // Append to document
    document.body.append(ioscr);
}

const IO = {

    socket: undefined,

    initConnection: function() {
        this.socket = io(destServer + "/moneypoly/v1");
        this.bindEvents();
    },

    bindEvents: function() {

    }
}
