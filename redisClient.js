const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Could not connect to Redis', err);
});

module.exports = redisClient;