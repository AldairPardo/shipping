import Redis from 'ioredis';

const redisClient = new Redis({
    host: 'localhost', // Replace with your Redis server host
    port: 6379,       // Replace with your Redis server port
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error', err);
});

export default redisClient;