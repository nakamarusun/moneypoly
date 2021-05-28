class Property {
  // each property will have their own prices, their own status if they ware owned or not and their building level once a palyer own a full neighbourhood
  constructor(name, price, color) {
    this.name = name;
    this.price = price;
    this.status = "free";
    this.level = 1;
    this.color = color;
  }
}

module.exports = Property;
