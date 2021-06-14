module.exports.dcClientError = function (sock, _msg) {
  sock.emit("dcerror", {
    msg: _msg
  });
  sock.disconnect(true);
};

/**
 *
 * @param {*} sock
 * @param {number} type 0: Info, 1: Error
 * @param {*} _msg
 */
module.exports.notif = function (sock, type, _msg) {
  sock.emit("notif", {
    msg: _msg
  });
};
