import { Body, Controller, Logger, Post, Put } from '@nestjs/common'
import { CreateOrderDTO } from '../order/order.dto'
import { InventoryService } from './inventory.service'
import * as uuid from 'uuid-random'
import { awaitWrap } from '@/modules/middleware/utils'
import { ApiBody } from '@nestjs/swagger'

@Controller('inventory')
export class InventoryController {
  logger = new Logger('Inventory Controller')

  constructor(private readonly inventoryService: InventoryService) {}

  @Post('/add_order')
  async addOrder(@Body() order: CreateOrderDTO) {
    const params: CreateOrderDTO = {
      ...order,
      openid: `${uuid()}-${new Date().valueOf()}`,
    }

    const [error, result] = await awaitWrap(this.inventoryService.queryOrder(params))

    return error || result
  }

  @Put('/reset')
  @ApiBody({
    schema: {
      example: { count: 100 },
    },
  })
  async resetOrderRemain(@Body() config: any) {
    const remainCount = config?.count || 0

    if (remainCount < 0) return 'Remaining Count cannot be 0！'

    return this.inventoryService.setRemainCount(remainCount)
  }
}
