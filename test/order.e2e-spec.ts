import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderController } from '@/modules/order/order.controller';
import { OrderService } from '@/modules/order/order.service';
import { Order } from '@/modules/order/order.entity';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  describe('order', () => {
    it('should return all orders', async () => {
      const expectedOrders = [/* mocked orders */];
      jest.spyOn(orderService, 'getAllOrder').mockResolvedValue(expectedOrders);

      const result = await orderController.order();

      expect(result).toBe(expectedOrders);
    });

    // Add more test cases for other controller methods
  });

  // Add more describe blocks for other controller methods
});

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  describe('getAllOrder', () => {
    it('should return all orders', async () => {
      const expectedOrders = [/* mocked orders */];
      jest.spyOn(orderRepository, 'find').mockResolvedValue(expectedOrders);

      const result = await orderService.getAllOrder();

      expect(result).toBe(expectedOrders);
    });

    // Add more test cases for other service methods
  });

});
