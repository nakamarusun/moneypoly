const redis = require("redis");

module.exports.getRedis = function () {
  return redis.createClient(process.env.REDISPORT);
};
