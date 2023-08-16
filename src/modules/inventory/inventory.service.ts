import { Injectable, Logger } from '@nestjs/common'
import * as kafka from 'kafka-node'
import * as Redis from 'ioredis'
import { set } from 'lodash'
import { RedisClientService } from '../middleware/redis.service'
import { getMiddleWareConfig } from '@/config/middleware.config'
import { awaitWrap } from '@/modules/middleware/utils'

const { redisConfig, kafkaConfig } = getMiddleWareConfig()

const Producer = kafka.Producer
const kafkaClient = new kafka.KafkaClient({ kafkaHost: kafkaConfig.kafkaHost })
const producer = new Producer(kafkaClient, {
  // Configuration for when to consider a message as acknowledged, default 1
  requireAcks: 1,
  // The amount of time in milliseconds to wait for all acks before considered, default 100ms
  ackTimeoutMs: 100,
  // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
  partitionerType: 2,
})

@Injectable()
export class InventoryService {
  logger = new Logger('Inventory Service Started')

  inventoryRedisClient!: Redis.Redis

  count = 0

  constructor(private readonly redisClientService: RedisClientService) {
    this.redisClientService.getInventoryRedisClient().then(client => {
      this.inventoryRedisClient = client
    })
  }

  async initCount() {
    const { counterKey } = redisConfig

    return await this.inventoryRedisClient.set(counterKey, 100)
  }

  async queryOrder(params) {
    const { counterKey } = redisConfig

    this.logger.log(`Current Request Count：${this.count++}`)

    // Using optimistic locking to address high concurrency.
    const [watchError] = await awaitWrap(this.inventoryRedisClient.watch(counterKey)) //Listen to counter field
    watchError && this.logger.error(watchError)
    if (watchError) return watchError

    const [getError, reply] = await awaitWrap(this.inventoryRedisClient.get(counterKey))
    getError && this.logger.error(getError)
    if (getError) return getError

    if (parseInt(reply) <= 0) {
      this.logger.warn('Already sold out. Remaining Count decreased to 0')
      return 'Alreay Sold out'
    }

    //Update Redis Counter
    const [execError, replies] = await awaitWrap(this.inventoryRedisClient.multi().decr(counterKey).exec())
    execError && this.logger.error(execError)
    if (execError) return execError

    //Counter is in use, wait to be free
    if (!replies) {
      this.logger.warn('counter is in use')
      this.queryOrder(params)
      return
    }

    set(params, 'remainCount', replies[0]?.[1])

    const payload = [
      {
        topic: kafkaConfig.topic,
        partition: 0,
        messages: [JSON.stringify(params)],
      },
    ]

    this.logger.log('Producer Payload:')
    this.logger.verbose(payload)

    return new Promise((resolve, reject) => {
      producer.send(payload, (err, kafkaProducerResponse) => {
        if (err) {
          this.logger.error(err)
          reject(err)
          return err
        }

        this.logger.verbose(kafkaProducerResponse)
        resolve({ payload, kafkaProducerResponse })
      })
    })
  }

  // Set Remaining Count
  async setRemainCount(remainCount: number) {
    const { counterKey } = redisConfig

    const [watchError] = await awaitWrap(this.inventoryRedisClient.watch(counterKey)) //Listening to counter
    watchError && this.logger.error(watchError)
    if (watchError) return watchError

    //Update number in counter
    const [execError, replies] = await awaitWrap(this.inventoryRedisClient.multi().set(counterKey, remainCount).get(counterKey).exec())
    execError && this.logger.error(execError)
    if (execError) return execError

    //Counter is in use
    if (!replies) {
      this.logger.warn('Counter is currently in use')
      return this.setRemainCount(remainCount)
    }

    console.log('replies: ', replies)
    return `Product amount updated. Remaining Count：${replies?.[1]?.[1]}`
  }
}
