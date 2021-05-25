// Initialize moneypoly communication engine

module.exports = function (io) {
  const main = io.of("/main");
  main.on("connection", () => {
    console.log("Connection made");
  });
};
