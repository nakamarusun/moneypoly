const redis = require("redis");

module.exports.prefix = ""; // Prefix the redis will do its operation to.

let cl;

module.exports.init = function () {
  cl = redis.createClient(process.env.REDISPORT, {
    prefix: module.exports.prefix
  });
};

/**
 *
 * @returns {redis.RedisClient} redis client
 */
module.exports.getRedis = function () {
  // TODO: Use accounts and use namespaces
  if (!cl.connected) {
    module.exports.init();
  }
  return cl;
};
