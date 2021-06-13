module.exports.dcClientError = function (sock, msg) {
  sock.emit("dcerror", {
    msg: msg
  });
  sock.disconnect(true);
};
