module.exports.dcClientError = function (sock, _msg) {
  sock.emit("dcerror", {
    msg: _msg
  });
  sock.disconnect(true);
};
