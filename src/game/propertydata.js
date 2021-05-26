import Property from "./property";
let propertyList = [];
// this file is used to make and contain all the data on properties
const propertyName = ["Taman Safari", "Ancol", "Musuem Macan", "Museum Wayang", "Sea World", "Taman Mini", "Taman Menteng", "Museum Indonesia", "Monas", "Taman Suropati", "BINUS Square", "Senayan City", "BINUS Senayan", "Senayan Park", "Plaza Senayan", "Gelora Bung Karno", "Taman Mangrove", "BINUS Alam Sutera", "Merdeka Square", "Planetarium Jakarta", "Bundaran HI", "Hotel Indonesia"];
const propertyPrice = [60, 60, 100, 100, 120, 140, 140, 160, 180, 180, 200, 220, 220, 240, 260, 260, 280, 300, 300, 320, 350, 400];
const propertyColor = ["Brown", "Brown", "Teal", "Teal", "Teal", "Magenta", "Magenta", "Magenta", "Orange", "Orange", "Orange", "Red", "Red", "Red", "Yellow", "Yellow", "Yellow", "Green", "Green", "Green", "Blue", "Blue"];
for(let i = 0; i < propertyName.length(); i++){
    newProperty = new Property(propertyName[i], propertyPrice[i], propertyColor[i]);
    propertyList.push(newProperty);
}
propertyList.push(propertyEx);
// TODO fill this file with more properties like the example above then add it to the export
export { propertyList };
