//These configurations are from:
// 
const WeChatAPIConfig = {
  config:{
    apiUrl : process.env.WECHAT_API_URL || 'https://api.weixin.qq.com/cgi-bin/token',
    grantType : process.env.WECHAT_API_GRANTTYPE || "grantType",
    secret: process.env.WECHAT_API_SECRET || "secretId",
    appId: process.env.WECHAT_API_APPID || "appId",
  }

}

export default WeChatAPIConfig

export const getWeChatConfig = () =>{
  return WeChatAPIConfig
}