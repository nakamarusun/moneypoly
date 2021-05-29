const IO = {
    socket: undefined,
    destServer: undefined,
    room: undefined,

    // Load the socket io instance
    loadSocket: function() {

        // Need to have a destination server first
        if (!this.destServer) return;

        // Download the script and executes it from the worker server
        const ioscr = document.createElement('script');
        ioscr.onload = IO.initConnection;
        ioscr.src = IO.destServer + "/socket.io/socket.io.js";

        // Append to document
        document.body.append(ioscr);
    },

    // Initializes and connects to the destination server
    initConnection: function() {
        this.socket = io(this.destServer + "/moneypoly/v1", {
            query: {
                room: this.room,
            }
        });
        this.bindEvents();
    },

    bindEvents: function() {

    }
}
