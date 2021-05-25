/**
 *
 * @param {Number} length string's resulting length
 * @returns random alphanumeric string
 */
module.exports.genAlphanum = function (length) {
  return Math.random().toString(36).slice(2).substr(0, length);
};
