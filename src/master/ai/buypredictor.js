const path = require("path");

module.exports.aiBuyPath = path.resolve(
  __dirname,
  "../",
  "../",
  "../",
  "master_ins",
  "aibuy.csv"
);
module.exports.aiBuyBase =
  "money_left,property_cost,opponent_average,go_distance,opponent_house_distance,buy_property\n";
