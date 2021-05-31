// Initialize moneypoly socket communication engine

module.exports = function (io) {
  const main = io.of("/moneypoly/v1");

  console.log("IO server started");

  main.on("connection", (sock) => {
    const param = sock.handshake.query;
    console.log(param);
    console.log("Connection made");
  });
};
