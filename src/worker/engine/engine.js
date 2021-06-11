// Initialize moneypoly socket communication engine

const { getRedis } = require("../../redisdb");

function dcClientError(sock) {
  sock.emit("dcerror", {
    msg: "Invalid room code."
  });
  sock.disconnect(true);
}

module.exports = function (io) {
  const main = io.of("/moneypoly/v1");

  console.log("IO server started");

  main.on("connection", (sock) => {
    console.log("Connection made");
  });

  // Middleware to check whether the query is valid
  // and room exist. If it exists, it joins the room.
  main.use((sock, next) => {
    const param = sock.handshake.query;

    if ("room" in param && "uname" in param) {
      const cl = getRedis();
      cl.hget(param.room, "status", (err, rep) => {
        if (err || !rep) return dcClientError(sock);

        sock.join(param.room);
        next();
      });
    } else {
      dcClientError(sock);
    }
  });
};
