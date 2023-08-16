import { Controller, Get } from '@nestjs/common';
import { WeChatAPIService } from './wechatAPI.service';

@Controller('wechatAPI')
export class WeChatController {
  constructor(private readonly wechatAPIService: WeChatAPIService) {}

  @Get('wechat-access-token')
  async getAccessToken(): Promise<string> {
    return this.wechatAPIService.getWeChatAccessToken();
  }
}