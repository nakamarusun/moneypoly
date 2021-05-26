const redis = require("redis");

/**
 *
 * @returns {redis.RedisClient} redis client
 */
module.exports.getRedis = function () {
  // TODO: Use accounts and use namespaces
  return redis.createClient(process.env.REDISPORT);
};
