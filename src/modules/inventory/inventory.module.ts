import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common'
import * as Redis from 'ioredis'
import { awaitWrap } from '@/modules/middleware/utils'
import { CreateOrderDTO } from '../order/order.dto'
import { OrderModule } from '../order/order.module'
import { OrderService } from '../order/order.service'
import { RedisClientService } from '../middleware/redis.service'
import { getKafkaConsumer } from '../middleware/kafka-utils'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'

@Module({
  imports: [OrderModule],
  providers: [RedisClientService, InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule implements OnApplicationBootstrap {
  logger = new Logger('Inventory Module')

  inventoryRedisClient!: Redis.Redis

  constructor(
    private readonly orderService: OrderService,
    private readonly inventoryService: InventoryService,
    private readonly redisClientService: RedisClientService
  ) {
    this.redisClientService.getInventoryRedisClient().then(client => {
      this.inventoryRedisClient = client
    })
  }

  async handleListenerKafkaMessage() {
    const kafkaConsumer = getKafkaConsumer()

    kafkaConsumer.on('message', async message => {
      this.logger.log('Data from producer：')
      this.logger.verbose(message)

      let value!: CreateOrderDTO

      if (typeof message.value === 'string') {
        value = JSON.parse(message.value)
      } else {
        value = JSON.parse(message.value.toString())
      }
      value.kafkaRawMessage = JSON.stringify(message)

      const [err, order] = await awaitWrap(this.orderService.createOrder(value))
      if (err) {
        this.logger.error(err)
        return
      }
      this.logger.log(`Orer${order.id} information has been put into database`)
    })
  }

  async onApplicationBootstrap() {
    this.logger.log('onApplicationBootstrap: ')
    await this.inventoryService.initCount()
    // await initKafkaTopic();
    this.handleListenerKafkaMessage()
  }
}
