/* eslint-disable no-undef */

$(document).ready(function(){
    $("#goButton").click(function(){
      $("#goButton").fadeOut("slow",() => {
        $("#nameSection").fadeIn();
      });
    });

});

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

function hostGameClicked(url) {
    window.location.href = url;
    
}