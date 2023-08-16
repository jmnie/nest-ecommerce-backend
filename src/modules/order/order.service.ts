import { Injectable } from '@nestjs/common'
import { Connection, Repository, FindOneOptions } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './order.entity'

@Injectable()
export class OrderService {
  orderConnection!: Connection

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {
    this.orderConnection = this.orderRepository.manager.connection
  }

  async getAllOrder(options: FindOneOptions<Order> = {}) {
    return this.orderRepository.find(options)
  }

  async createOrder(order: Partial<Order>) {
    await this.orderConnection.queryResultCache.clear()
    return this.orderRepository.save(order)
  }

  async updateOrderById(orderId: string, order: Partial<Order>) {
    await this.orderConnection.queryResultCache.clear()
    return this.orderRepository.update(orderId, order)
  }

  getOrderById(orderId: string) {
    return this.orderRepository.findOne(orderId, { cache: true })
  }

  async deleteOrderById(id: string) {
    await this.orderConnection.queryResultCache.clear()
    return this.orderRepository.delete(id)
  }

  async deleteOrderByIds(orderIds: string[]) {
    await this.orderConnection.queryResultCache.clear()
    return this.orderRepository.delete(orderIds)
  }
}
