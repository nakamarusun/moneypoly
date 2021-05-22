export default class Property {
  // each property will have their own prices, their own status if they ware owned or not and their building level once a palyer own a full neighbourhood
  constructor(name, price) {
    this.name = name;
    this.price = price;
    this.status = "free";
    this.level = 0;
  }
}
