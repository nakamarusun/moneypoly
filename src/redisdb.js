const redis = require("redis");

module.exports.prefix = ""; // Prefix the redis will do its operation to.

/**
 *
 * @returns {redis.RedisClient} redis client
 */
module.exports.getRedis = function () {
  // TODO: Use accounts and use namespaces
  return redis.createClient(process.env.REDISPORT, {
    prefix: module.exports.prefix
  });
};
