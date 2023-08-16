import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import * as chalk from 'chalk'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as packageJson from '../package.json'
import { getAppConfig } from './config/app.config'


async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const options = new DocumentBuilder()
    .setTitle(`${packageJson.name}-client`)
    .setDescription(`${packageJson.description}-[Back End Service ]`)
    .setVersion(packageJson.version)
    .setContact(packageJson.author, '', packageJson.author)
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document)

  const {host, port} = getAppConfig().config
  await app.listen(port, host)

  console.log(chalk.blue('\n Backend Started on: http://${host}:${port}\n'))

  console.log(chalk.blue(`\nswagger-ui Service starts on: http://${host}:${port}/api-docs\n`))
}
bootstrap()
