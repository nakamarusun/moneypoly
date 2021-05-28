




/* eslint-disable no-undef */
$(document).ready(function(){
    $("#goButton").click(function(){
      $("#goButton").fadeOut("slow");
      $("#nameSection").removeClass("none")
      $("#nameSection").fadein();


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
        $("#nameSection").fadeOut();
        $("#choiceSection").removeClass("none");
        $("#choiceSection").fadein();
    
    });


    
}

$(document).ready(function(){
    $("#joinButton").click(function(){
      $("#choiceSection").fadeOut("slow");
      $("#joinSection").removeClass("none");
      $("#joinSection").fadein();


    });

});

function hostGameClicked(url) {
    window.location.href = url;
    
}