import * as kafka from 'kafka-node'
import { getMiddleWareConfig } from '@/config/middleware.config'

const { kafkaConfig } = getMiddleWareConfig()

let kafkaConsumer!: kafka.Consumer

function getKafkaClient() {
  let kafkaClient!: kafka.KafkaClient

  return () => {
    if (!kafkaClient) {
      kafkaClient = new kafka.KafkaClient({
        kafkaHost: kafkaConfig.kafkaHost,
      })
    }

    return kafkaClient
  }
}

/**
 * @desc initialize kafka topic
 */
export function initKafkaTopic(): Promise<any> {
  const kafkaClient = getKafkaClient()()

  const Producer = kafka.Producer

  const producer = new Producer(kafkaClient, {
    requireAcks: 1,
    ackTimeoutMs: 100,
    partitionerType: 2,
  })

  const payload = [
    {
      topic: kafkaConfig.topic,
      partition: 0,
      messages: [JSON.stringify({})],
    },
  ]

  return new Promise((resolve, reject) => {
    producer.send(payload, (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
        return err
      }

      console.log(data)
      resolve(data)
    })
  })
}

/**
 * @desc Get consumer instance
 */
export function getKafkaConsumer() {
  const topics = [
    {
      topic: kafkaConfig.topic,
      partition: 0,
      offset: 0,
    },
  ]

  const options = {
    //  Auto commit configuration 
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    //  if set to true, the consumer will fetch messages from the given offset within the payload.
    fromOffset: false,
  }

  const kafkaClient = getKafkaClient()()

  if (!kafkaConsumer) {
    kafkaConsumer = new kafka.Consumer(kafkaClient, topics, options)
  }

  return kafkaConsumer
}
