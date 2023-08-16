const MiddlewareConfig = {
  database: {
    type: process.env.DATABASE_TYPE || 'mysql',
    ip: process.env.DATABASE_IP || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'inventory',
  },
  redisCache: {
    host: process.env.REDIS_CACHE_HOST || '192.168.72.128',
    port: parseInt(process.env.REDIS_CACHE_PORT) || 6379,
    duration: parseInt(process.env.REDIS_CACHE_DURATION) || 30000, 
  },
  redisConfig: {
    counterKey: process.env.REDIS_COUNTER_KEY || 'inventoryCounter', 
    hashKey: process.env.REDIS_HASH_KEY || 'inventory-temp',
    tempLockKey: process.env.REDIS_TEMP_LOCK_KEY || 'lock-inventory-update', 
    name: process.env.REDIS_NAME || 'inventory',
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    db: parseInt(process.env.REDIS_DB) || 1,
  },
  kafkaConfig: {
    kafkaHost: process.env.KAFKA_HOST || 'localhost:9092',
    topic: process.env.KAFKA_TOPIC || 'ORDER_UPDATE',
    partitionMaxIndex: parseInt(process.env.KAFKA_PARTITION_MAX_INDEX) || 0, 
  },
  logger: process.env.LOGGER ? process.env.LOGGER.split(',') : ['error', 'warn', 'log', 'debug', 'verbose'],
}

export default MiddlewareConfig;

export const getMiddleWareConfig = () => {
  return MiddlewareConfig;
};