import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; //import HttpModule
import { WeChatAPIService } from './wechatAPI.service';

@Module({
  imports: [HttpModule],
  providers: [WeChatAPIService],
  exports: [WeChatAPIService],
})
export class WeChatAPIModule {}