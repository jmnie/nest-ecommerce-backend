import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { getWeChatConfig } from '@/config/wechatAPI.confi';

@Injectable()
export class WeChatAPIService {
  private accessToken: string;
  private expirationTime: number;
  private isRefreshingToken: boolean = false; 

  constructor(private httpService: HttpService) {}

  async getWeChatAccessToken(): Promise<string> {
    const now = Date.now();

    if (this.accessToken && this.expirationTime > now) {
      return this.accessToken;
    }
    if (this.isRefreshingToken) {
      await this.waitUntilTokenRefreshed();
      return this.accessToken;
    }

    return this.refreshAccessToken();
  }

  private async waitUntilTokenRefreshed(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.isRefreshingToken) {
          clearInterval(interval);
          resolve();
        }
      }, 100); //refresh every 100 millionseconds
    });
  }

  async refreshAccessToken(): Promise<string> {
    if (this.accessToken && this.expirationTime > Date.now()) {
      return this.accessToken;
    }
    const { apiUrl, grantType, secret, appId } = getWeChatConfig().config;
    const params = {
      grant_type: grantType,
      appid: appId,
      secret: secret,
    };

    try {
      const response = await this.httpService.get(apiUrl, { params }).toPromise();
      this.accessToken = response.data.access_token;
      this.expirationTime = Date.now() + response.data.expires_in * 1000; // Convert seconds to milliseconds
      return this.accessToken;
    } catch (error) {
      console.error('Error fetching WeChat access token:', error.message);
      throw new Error('Failed to fetch WeChat access token');
    }
  }
  
}
