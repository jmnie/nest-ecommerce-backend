import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { WeChatController } from '@/modules/wechatAPI/wechatAPI.controller';
import { WeChatAPIService } from '@/modules/wechatAPI/wechatAPI.service';

describe('WeChatController', () => {
  let wechatController: WeChatController;
  let wechatAPIService: WeChatAPIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeChatController],
      providers: [
        WeChatAPIService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
      imports: [HttpModule],
    }).compile();

    wechatController = module.get<WeChatController>(WeChatController);
    wechatAPIService = module.get<WeChatAPIService>(WeChatAPIService);
  });

  describe('getAccessToken', () => {
    it('should return access token', async () => {
      const accessToken = 'mocked-access-token';
      jest.spyOn(wechatAPIService, 'getWeChatAccessToken').mockResolvedValue(accessToken);

      const result = await wechatController.getAccessToken();

      expect(result).toBe(accessToken);
    });
  });
});
