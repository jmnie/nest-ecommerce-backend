import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDTO } from '@/modules/order/order.dto';
import { InventoryController } from '@/modules/inventory/inventory.controller';
import { InventoryService } from '@/modules/inventory/inventory.service';
import Redis from 'ioredis';
import * as kafka from 'kafka-node';

// Mocks
jest.mock('./order.service');
jest.mock('./inventory.service');
jest.mock('uuid-random');
jest.mock('ioredis');
jest.mock('kafka-node');

class MockKafkaProducer {
  send = jest.fn();
}

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        InventoryService,
        {
          provide: Redis,
          useValue: {
            watch: jest.fn(),
            multi: jest.fn(),
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: kafka.Producer,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    inventoryController = module.get<InventoryController>(InventoryController);
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  describe('addOrder', () => {
    it('should add an order', async () => {
      const createOrderDTO: CreateOrderDTO = { 
        user: 'user1',
        product: 'Sample Running Shoe 1',
        openid: 'your-openid',
        remark: 'Special Product',
        kafkaRawMessage: 'your-raw-message', };
      const queryOrderResult = 'Query order result';
      //inventoryService.queryOrder.mockResolvedValue(queryOrderResult);

      const result = await inventoryController.addOrder(createOrderDTO);

      expect(result).toBe(queryOrderResult);
    });

    // Add more test cases for other controller methods
  });

  describe('resetOrderRemain', () => {
    it('should reset order remain', async () => {
      const config = { count: 100 };
      const setRemainCountResult = 'Set remain count result';
      //inventoryService.setRemainCount.mockResolvedValue(setRemainCountResult);

      const result = await inventoryController.resetOrderRemain(config);

      expect(result).toBe(setRemainCountResult);
    });

    // Add more test cases for other controller methods
  });

  // Add more describe blocks for other controller methods
});

// You can add similar describe blocks for testing OrderController

// Add a describe block for InventoryService testing
describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let redisClient: Redis.Redis;
  let kafkaProducer: kafka.Producer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: Redis,
          useValue: {
            watch: jest.fn(),
            multi: jest.fn(),
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: kafka.Producer,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    inventoryService = module.get<InventoryService>(InventoryService);
    redisClient = module.get<Redis.Redis>(Redis);
    kafkaProducer = module.get<kafka.Producer>(kafka.Producer);
  });

  describe('queryOrder', () => {
    it('should query order', async () => {
      // Mock implementations and test the logic
    });

  });

  // Add more describe blocks for other service methods
});
