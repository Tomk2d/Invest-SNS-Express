const redis = require("redis");
const { promisify } = require("util");

const Redis = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || "6379",
  connected: false,
  client: null,
  getConnection() {
    if (this.connected) return this.client;
    else {
      console.log("New redis instance");
      this.client = redis.createClient({
        host: this.host,
        port: this.port,
      });
      this.connected = true;
      return this.client;
    }
  },
};

const redisClient = Redis.getConnection();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

module.exports = { redisClient, getAsync, setAsync };
