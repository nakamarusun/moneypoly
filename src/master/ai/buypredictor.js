const path = require("path");
const fs = require("fs");
const superagent = require("superagent");

const { spawn } = require("child_process");
const { genToken } = require("../../interserver/inter");

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

/**
 *
 * @param {boolean} force
 */
module.exports.updateModel = function (force) {
  // Get the csv file stats
  console.log("Running update model");
  fs.stat(module.exports.aiBuyPath, (err, res) => {
    if (err) return console.log("Error opening aibuymodel to view stats");

    // If the file has been modified for the past 24 hour, do the thing.
    if (force || res.mtime + 86400 * 1000 > Date.now()) {
      // Train model
      const modelPath = path.resolve(
        path.dirname(module.exports.aiBuyPath),
        "buymodel.joblib"
      );
      const proc = spawn(process.env.PYTHON, [
        path.resolve(__dirname, "export_model.py"),
        module.exports.aiBuyPath,
        modelPath
      ]);

      // When finished, send the newly created model to the workers.
      proc.stdout.on("data", (out) => {
        console.log("Completed training buy model with output: " + out);

        // Send model to every server.
        for (const server of process.env.WORKERS.split(",")) {
          console.log("Sending buy model to " + server);
          superagent
            .post(server + "/io/updatebuymodel")
            .set({
              Authorization: "Bearer " + genToken(),
              Accept: "application/json"
            })
            .attach("buymodel", modelPath)
            .end();
        }
      });
    }
  });
};
