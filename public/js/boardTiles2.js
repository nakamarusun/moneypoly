
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){const c=typeof require==="function"&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);const a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}const p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){const n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=typeof require==="function"&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const propertyList = require("../../src/game/propertydata");
propertyList.forEach(function(e){
  console.log(e);

});


const bottomRow = document.getElementById("bottom-row");
const leftRow = document.getElementById("left-row");
const topRow = document.getElementById("top-row");
const rightRow = document.getElementById("right-row");

function getRailroad(places,index){
  places.classList.add("places");
  places.classList.add("railroad");
  const containers = document.createElement("div");
  const railRoadLabel = document.createElement("div");
  const railRoadIcon = document.createElement("i");
  const railRoadPrice = document.createElement("div");

  containers.classList.add("containers");

  railRoadLabel.classList.add("label");
  railRoadLabel.innerHTML += propertyList[index].name;

  railRoadIcon.classList.add("icon");
  railRoadIcon.classList.add("fa");
  railRoadIcon.classList.add("fa-subway");

  railRoadPrice.classList.add("price");
  railRoadPrice.innerHTML += `PRICE $${ propertyList[index].price}`;



  containers.appendChild(railRoadLabel);
  containers.appendChild(railRoadIcon);
  containers.appendChild(railRoadPrice);
  
  places.appendChild(containers);

}

function getChance(places){
  places.classList.add("places");
  places.classList.add("chance");
  const containers = document.createElement("div");
  const chanceLabel = document.createElement("div");
  const iconChance = document.createElement("i");

  containers.classList.add("containers");

  chanceLabel.classList.add("label");
  chanceLabel.classList.add("chance-label");
  chanceLabel.innerHTML += "Chance";
  containers.appendChild(chanceLabel);

  iconChance.classList.add("icon");
  iconChance.classList.add("fa");
  iconChance.classList.add("fa-question");
  containers.appendChild(iconChance);

  places.appendChild(containers);

}

function getFee(places){
  places.classList.add("places");
    places.classList.add("fee");
    places.classList.add("income-tax");
    const containers = document.createElement("div");
    const label = document.createElement("div");
    const diamond = document.createElement("div");
    const instructions = document.createElement("div");

    containers.classList.add("containers");

    label.classList.add("label");
    label.innerHTML += "Income Tax";

    diamond.classList.add("diamond");

    instructions.classList.add("instructions");
    instructions.innerHTML += "Pay $100";

    containers.appendChild(label);
    containers.appendChild(diamond);
    containers.appendChild(instructions);

    places.appendChild(containers);

}

function getProperty(places, index){
      places.classList.add("places");
      places.classList.add("property");
      const containers = document.createElement("div");
      const colorSection = document.createElement("div");
      const propertyName = document.createElement("div");
      const propertyPrice = document.createElement("div");

      containers.classList.add("containers");

      colorSection.classList.add("color-section");
      colorSection.classList.add(`${propertyList[index].color}`);

      propertyName.classList.add("label");
      propertyName.classList.add("propertyName");
      propertyName.innerHTML += propertyList[index].name;

      propertyPrice.classList.add("price");
      propertyPrice.innerHTML += `PRICE $${ propertyList[index].price}`;



      containers.appendChild(colorSection);
      containers.appendChild(propertyName);
      containers.appendChild(propertyPrice);
      
      places.appendChild(containers);


}


for(var i = 0; i < 9; i++){
  const places = document.createElement("div");


    if(i === 1 || i === 5 || i === 7){
        getChance(places); 
    }

    else if(i === 4){
      getFee(places);

    }
    else{
      if(i===0)
        getProperty(places, 0);
      else if(i===2)
        getProperty(places, 1);
      else if(i===3)
        getRailroad(places,2);
      else if(i===6)
        getProperty(places,3)
      else if(i===8)
        getProperty(places,4)
      
    }

    bottomRow.appendChild(places); 


}

for( i = 11; i <= 19; i++){
  const places = document.createElement("div");


    if(i === 12 || i === 15 || i === 17){
        getChance(places); 
    }
    else{
      if(i===11)
        getProperty(places, 5);
      else if(i===13)
        getProperty(places, 6);
      else if(i===14)
        getRailroad(places,7);
      else if(i===16)
        getProperty(places,8)
      else if(i===18)
        getProperty(places,9)
        else if(i===19)
        getProperty(places,10)
      
    }

    rightRow.appendChild(places); 


}

for( i = 21; i <= 29; i++){
  const places = document.createElement("div");


    if(i === 22 || i === 25 || i === 28){
        getChance(places); 
    }
    else{
      if(i===21)
        getProperty(places, 11);
      else if(i===23)
        getProperty(places, 12);
      else if(i===24)
        getRailroad(places,13);
      else if(i===26)
        getProperty(places,14)
      else if(i===27)
        getProperty(places,15)
        else if(i===29)
        getProperty(places,16)
      
    }

    topRow.appendChild(places); 



    
}

for( i = 31; i <= 39; i++){
  const places = document.createElement("div");


    if(i === 33 || i === 35 || i === 36){
        getChance(places); 
    }
    else if(i === 38){
      getFee(places);
    }
    else{
      if(i===31)
        getProperty(places, 17);
      else if(i===32)
        getProperty(places, 18);
      else if(i===34)
        getProperty(places,19);
      else if(i===37)
        getRailroad(places,20)
      else if(i===39)
        getProperty(places,21)
      
    }

    leftRow.appendChild(places); 


}

},{"../../src/game/propertydata":3}],2:[function(require,module,exports){
class Property {
  // each property will have their own prices, their own status if they ware owned or not and their building level once a palyer own a full neighbourhood
  constructor(name, price, color) {
    this.name = name;
    this.price = price;
    this.status = "free";
    this.level = 1;
    this.color = color;
    this.owner;
  }
}

module.exports = Property;

},{}],3:[function(require,module,exports){
const Property = require("./property.js");
const propertyList = [];
// this file is used to make and contain all the data on properties
const propertyName = [
  "Taman Safari",
  "Ancol",
  "Musuem Macan",
  "Museum Wayang",
  "Sea World",
  "Taman Mini",
  "Taman Menteng",
  "Museum Indonesia",
  "Monas",
  "Taman Suropati",
  "BINUS Square",
  "Senayan City",
  "BINUS Senayan",
  "Senayan Park",
  "Plaza Senayan",
  "Gelora Bung Karno",
  "Taman Mangrove",
  "BINUS Alam Sutera",
  "Merdeka Square",
  "Planetarium Jakarta",
  "Bundaran HI",
  "Hotel Indonesia"
];
const propertyPrice = [
  60,
  60,
  100,
  100,
  120,
  140,
  140,
  160,
  180,
  180,
  200,
  220,
  220,
  240,
  260,
  260,
  280,
  300,
  300,
  320,
  350,
  400
];
const propertyColor = [
  "Brown",
  "Brown",
  "Teal",
  "Teal",
  "Teal",
  "Magenta",
  "Magenta",
  "Magenta",
  "Orange",
  "Orange",
  "Orange",
  "Red",
  "Red",
  "Red",
  "Yellow",
  "Yellow",
  "Yellow",
  "Green",
  "Green",
  "Green",
  "Blue",
  "Blue"
];
for (let i = 0; i < propertyName.length; i++) {
  const newProperty = new Property(
    propertyName[i],
    propertyPrice[i],
    propertyColor[i]
  );
  propertyList.push(newProperty);
}


// for(let i = 0; i < propertyList.length; i++){
//     if(propertyList[i].name === "Sea World"){
//         console.log(propertyList[i]);
//     }
//     else{
//         console.log("Bust");
//     }
// }

module.exports =  propertyList;

},{"./property.js":2}]},{},[1]);
