const appConfig = {
  config:{
    host: process.env.APP_HOST || 'localhost',
    port : process.env.APP_PORT || 3000,
  }
}

export default appConfig

export const getAppConfig = () =>{
  return appConfig
}