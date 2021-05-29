// Initialize moneypoly socket communication engine

module.exports = function (io) {
  const main = io.of("/moneypoly/v1");

  console.log("IO server started");

  main.on("connection", () => {
    console.log("Connection made");
  });
};
