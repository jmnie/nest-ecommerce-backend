import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateOrderDTO, UpdateOrderDTO } from './order.dto'
import { Order } from './order.entity'
import { OrderService } from './order.service'

@ApiTags('Order Management')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/get_all_order')
  @ApiOperation({ description: 'Get All the orders' })
  order(): Promise<Order[]> {
    return this.orderService.getAllOrder()
  }

  @ApiOperation({ description: 'get order by its id' })
  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    const role = await this.orderService.getOrderById(id)
    return role
  }

  @ApiOperation({ description: 'create new order' })
  @Post("/create_order")
  async addRole(@Body() roleInfo: CreateOrderDTO) {
    const saveResult = await this.orderService.createOrder(roleInfo)

    return saveResult
  }

  @ApiOperation({ description: 'update order by id' })
  @Put("/update_order")
  async updateRole(@Body() role: UpdateOrderDTO) {
    const { id: roleId, ...roleInfo } = role

    const saveResult = await this.orderService.updateOrderById(roleId, roleInfo)
    return saveResult
  }

  @ApiOperation({ description: 'delete single order' })
  @ApiBody({
    schema: {
      example: 'single_order_id',
    },
  })
  @Delete("/delete_order")
  async deleteRole(@Body() orderId: string) {
    const deleteResult = await this.orderService.deleteOrderById(orderId)
    return deleteResult
  }

  @ApiOperation({ description: 'delete multiple orders' })
  @ApiBody({
    schema: {
      example: ['order_id_1','order_id_2'],
    },
  })
  @Delete("/delete_multiple_order")
  async deleteOrderById(@Body() orderIds: string[]) {
    const deleteResult = await this.orderService.deleteOrderByIds(orderIds)
    return deleteResult
  }
}
