/* eslint-disable no-undef */

$(document).ready(function(){
    $("#goButton").click(function(){
      $("#goButton").fadeOut("slow",() => {
        $("#nameSection").fadeIn();
      });
    });
});
console.log("HELLO")
// eslint-disable-next-line no-unused-vars
function validateUserName() {
    let $userName = document.getElementById("userName");
    if($userName.value.length <5 || $userName.value.length >15)
    {
        alert("Name should be 5 to 15 characters");
        return;
        
    }
    $(document).ready(function(){
        $("#playButton").fadeOut("slow", ()=>{
            $("#choiceSection").fadeIn();
        })
    });   
}

$(document).ready(function(){
    $("#joinButton").click(function(){
      $("#choiceSection").fadeOut("slow", () => {
        $("#joinSection").fadeIn();
      });
    });
});

//Transition waiting to board
$(document).ready(function(){
  $(".startGameButton").click(function(){
    $(".body-wrapper, .bottom-wrapper").fadeOut("slow", () => {
      $(".body-wrapper, .bottom-wrapper").hide();
      $(".infoSection").fadeIn();
      $(".layout").fadeIn();

    });
  });
});


// Requests to create a new room from the server
function hostGameClicked() {

  // Do an HTTP POST request to get a room code
  const url = window.location.href.split('?')[0] + "moneypoly/v1/new";
  fetch(url, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          room: "newroom"
      })
  })
  .then(rep => rep.json())
  .then((data) => {
    // Get the username
    const uname = $("#userName").val();

    // When payload is received, go to the game room
    window.location.href = encodeURI(window.location.href.split('?')[0] + `waitingRoom?r=${data.room}&n=${uname}`);
  })
  .catch((err) => {
    console.error(err);
  });
}

function joinGameClicked() {

  // Roomcode
  const roomCode = $("#roomCode").val().toLowerCase();

  // Do an HTTP POST request to check if the room code existed
  const url = window.location.href.split('?')[0] + "moneypoly/v1/join";
  fetch(url, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          room: roomCode
      })
  })
  .then(rep => {
    if (rep.status !== 200) {
      return console.log("Room code not found");
    };

    // Get the username
    const uname = $("#userName").val();

    // When payload is received, go to the game room
    window.location.href = encodeURI(window.location.href.split('?')[0] + `waitingRoom?r=${roomCode}&n=${uname}`);
  })
  .catch((err) => {
    console.error(err);
  });
}
