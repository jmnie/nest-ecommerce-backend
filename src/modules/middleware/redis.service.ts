import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'
import { getMiddleWareConfig } from '@/config/middleware.config'

const { redisConfig } = getMiddleWareConfig()
@Injectable()
export class RedisClientService {
  constructor(private readonly redisService: RedisService) {}

  //Conect to the Redis instance already connected in App Module
  async getInventoryRedisClient() {
    return await this.redisService.getClient(redisConfig.name)
  }
}
