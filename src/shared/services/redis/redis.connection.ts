import { BaseCache } from '@services/redis/base.cache';

class RedisConnection extends BaseCache {
  constructor() {
    super('redis.connection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.log.info('redis server connection successful');
    } catch (error) {
      this.log.error(error);
    }
  }
}

const redisConnection = new RedisConnection();

export { redisConnection };
