// eslint-disable-next-line no-var
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c=typeof require==="function"&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=typeof require==="function"&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const propertyList = require("../../src/game/propertydata");

// propertyList.forEach(function(e){
//   console.log(e);

// });
},{"../../src/game/propertydata":3}],2:[function(require,module,exports){
class Property {
  // each property will have their own prices, their own status if they ware owned or not and their building level once a palyer own a full neighbourhood
  constructor(name, price, color) {
    this.name = name;
    this.price = price;
    this.status = "free";
    this.level = 1;
    this.color = color;
    // eslint-disable-next-line no-unused-expressions
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

module.exports = propertyList;

},{"./property.js":2}]},{},[1]);
