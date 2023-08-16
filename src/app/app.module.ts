import { CacheModule, Module } from '@nestjs/common'
import { RedisModule } from 'nestjs-redis'
import * as redisStore from 'cache-manager-redis-store'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getMiddleWareConfig } from '../config/middleware.config'
import { OrderModule } from '@/modules/order/order.module'
import { InventoryService } from '@/modules/inventory/inventory.service'
import { InventoryModule } from '@/modules/inventory/inventory.module'
import { RedisClientService } from '@/modules/middleware/redis.service'
import { WeChatAPIModule } from '@/modules/wechatAPI/wechatAPI.module'
import { SupportedDatabaseType, getDatabaseTypeFromConfig } from '@/modules/middleware/utils'

const { database, redisCache, redisConfig } = getMiddleWareConfig()

const dataBaseType: SupportedDatabaseType = getDatabaseTypeFromConfig(database.type); 

const TypeOrmModuleInstance = TypeOrmModule.forRoot({
  type: dataBaseType,
  host: database.ip,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.database,
  //synchronize: process.env.NODE_ENV !== 'production',
  autoLoadEntities: true,
  retryAttempts: 3,
  cache: {
    type: 'redis',
    options: {
      host: redisCache.host,
      port: redisCache.port,
    },
    duration: redisCache.duration,
  },
})

@Module({
  imports: [
    TypeOrmModuleInstance,
    CacheModule.register({
      store: redisStore,
      host: redisCache.host,
      port: redisCache.port,
      ttl: 10, // seconds
      max: 999, // maximum number of items in cache
    }),
    //redis-io connection 
    RedisModule.register([redisConfig]),
    OrderModule,
    InventoryModule,
    WeChatAPIModule
  ],
  controllers: [AppController],
  providers: [AppService, InventoryService, RedisClientService],
})
export class AppModule {}
