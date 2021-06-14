function parseParam(query) {
    const vars = query.replace("?", "").split("&");
    const queryString = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1]);
      // If first entry with this name
      if (typeof queryString[key] === "undefined") {
        queryString[key] = decodeURIComponent(value);
        // If second entry with this name
      } else if (typeof queryString[key] === "string") {
        const arr = [queryString[key], decodeURIComponent(value)];
        queryString[key] = arr;
        // If third or later entry with this name
      } else {
        queryString[key].push(decodeURIComponent(value));
      }
    }
    return queryString;
}

function addButton(el) {
    el.classList.remove("none");
    el.disabled = false;
}

function hideButton(el) {
    el.classList.add("none");
    el.disabled = true;
}

// Gets the data from the parameter, and verifies it.
// Then initiates connection to the server.
function initPage() {
    
    // Puts the URL parameter into an object
    const params = parseParam(location.search);

    // If debug mode is enabled
    if (params.d) {
        const $start = document.getElementById("startGameButton");
        $start.classList.remove("none");
        return;
    }

    // Test whether parameters exist, and do accordingly.
    // If room parameter does not exist, go back.
    if (!params.r) {
        window.location.href = "../";
        return;
    }

    // Reset URL
    window.history.pushState("", "", window.location.href.split('?')[0] + `?r=${params.r}`);

    // Check if room exists by asking the server.
    const base = window.location.href.split('?')[0];
    const url = base.substr(0, base.lastIndexOf("/") + 1) + "moneypoly/v1/join";
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room: params.r
        })
    })
    .then(rep => rep.json())
    .then(data => {
        // Server is gotten, either ask for the name, or connect immediately.
        IO.destServer = data.server;
        IO.room = params.r;

        // If name parameter does not exist, ask the user.
        if (!params.n) {
            // Display name prompt
            $("#namequery").fadeIn("slow");
        } else {
            IO.uname = params.n;
            IO.loadSocket(); // Connect game
        }
    })
    .catch((err) => {
        console.error(err);
        // Show room does not exist.
        showError("Room does not exist!")
    });
}

function showError(message) {
    console.log(message);
    const $err = $("#errornotif");
    $err.fadeIn("slow");
    $err.children().text(message);
}

function validateAndStart(name) {
    // If already connecting, don't do anything.
    if (IO.connecting) return;

    // Invalid username
    if (name.length < 5 || name.length > 15) {
        alert("Name should be 5 to 15 characters");
        return;
    }

    $("#namequery").fadeOut("slow");
    IO.connecting = true;
    IO.uname = $("#usernamebox").val();
    IO.loadSocket(); // Connect game
}

initPage();

const IO = {
    socket: undefined, // Socket IO object
    destServer: undefined, // Destination server
    room: undefined, // Room code
    uname: undefined, // Username
    connecting: false, // Whether a connection is being attempted or made
    players: {}, // Players

    // Load the socket io instance
    loadSocket: function() {

        // Rename
        $("#spanUser")[0].innerText = IO.uname;
        $("#roomCodeDisplay").text(IO.room);

        // Need to have a destination server first
        if (!IO.destServer) return;

        // Download the script and executes it from the worker server
        const ioscr = document.createElement('script');
        ioscr.onload = IO.initConnection;
        ioscr.src = IO.destServer + "/socket.io/socket.io.js";

        // Append to document
        document.body.append(ioscr);
    },

    // Initializes and connects to the destination server
    initConnection: function() {
        IO.socket = io(IO.destServer + "/moneypoly/v1", {
            query: {
                room: IO.room,
                uname: IO.uname,
            }
        });
        IO.bindEvents();
    },

    bindEvents: function() {
        const sock = IO.socket;
        sock.on("dcerror", IO.showError);
        sock.on("updateplayerlist", IO.updatePlayers);
        sock.on("updateboard", IO.updateBoard);
    },

    showError(msgObj) {
        showError(msgObj.msg);
    },

    updatePlayers: function(players) {
        const $c = $(".playerLists .playerList");
        const plArr = players.players;

        IO.players = plArr;

        // Whether this client is a host.
        let isHost;
        try {
            isHost = plArr.find((x) => { return x.name === IO.uname; }).host;
        } catch (err) {
            showError("You have been disconnected from the server.");
            return;
        }

        // Make the start button appear.
        if (isHost) {
            const $start = document.getElementById("startGameButton");
            $start.classList.remove("none");
            $start.disabled = plArr.length < 2;
            $(".startGameButton").click(function(){
                IO.socket.emit("startgame");
            });
        }

        // Spawn and delete the buttons for the waiting room
        for (let i = 0; i < 4; i++) {
            const el = $c[i].children;
            if (i < plArr.length) {
                el[0].innerText = (plArr[i].bot ? "[BOT] " : "") + plArr[i].name;
                hideButton(el[1]);

                if (isHost) {
                    if (IO.uname !== plArr[i].name) {
                        addButton(el[2]);

                        // Add listener to send remove command.
                        el[2].addEventListener("click", () => {
                            hideButton(el[2]);
                            console.log(i);
                            IO.socket.emit("kickplayer", {
                                player: i
                            });
                        });
                    }
                } else {
                    hideButton(el[2]);
                }
            } else {
                el[0].innerText = "-Empty-";
                hideButton(el[2]);
                if (isHost) {
                    addButton(el[1]);

                    // Add listener to add bot
                    el[1].addEventListener("click", () => {
                        hideButton(el[1]);
                        IO.socket.emit("addbot");
                    })
                } else {
                    hideButton(el[1]);
                }
            }
        }
    },

    updateBoard: function(boardData) {
        // TODO: Kevin
        
    }
}
