// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { document } = (new JSDOM(`...`)).window;

const propertyList = require("../../src/game/propertydata");

const bottomRow = document.getElementById("bottom-row");
console.log("hello")

for(var i = 0; i<=8; i++){
    const places = document.createElement("div");
    if(i === 2 && i===7){
        places.classList.add("places chance");
        bottomRow.appendChild(places);
        
        
    }

    places.classList.add("places property");
    document.getElementsByClassName("propertyName").innerText = propertyList[i].name;
    document.getElementsByClassName("price").innerText = `PRICE $${ propertyList[i].price}`;
    document.getElementsByClassName("color-section").classList.add(`${propertyList[i].color}`);


    bottomRow.appendChild(places);

}
