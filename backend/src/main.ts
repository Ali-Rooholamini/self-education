import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { configureApp } from './configure-app.js'

async function bootstrap() {
  const port = Number(process.env.PORT ?? 3001)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535')
  }

  const app = await NestFactory.create(AppModule)
  configureApp(app)
  await app.listen(port)
}

void bootstrap()
