module.exports.RoomStatus = Object.freeze({
  READY: 0, // Room has been created and is ready to be joined.
  // First user to join will become the host.
  POPULATED: 1, // Room has > 0 clients in.
  FULL: 2, // Room is full (4 people)
  STARTED: 3 // Room has started
});
