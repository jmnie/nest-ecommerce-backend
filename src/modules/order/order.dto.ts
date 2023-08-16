import { ApiProperty, PickType } from '@nestjs/swagger'
import { Order } from './order.entity'

export class CreateOrderDTO extends PickType(Order, ['user', 'product', 'openid', 'remark', 'kafkaRawMessage']) {}

export class UpdateOrderDTO extends PickType(Order, ['user', 'product', 'openid', 'remark', 'kafkaRawMessage']) {
  @ApiProperty({ description: 'order id', example: '' })
  id: string
}
