import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common'
import { existsSync } from 'node:fs'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../generated/prisma/client.js'
import { databaseLocation } from './database-location.js'

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const location = databaseLocation()
    if (!existsSync(location.path)) {
      throw new Error(
        'The local database has not been created. Run npm run db:setup from the repository root.',
      )
    }

    super({ adapter: new PrismaLibSql({ url: location.url }) })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      await this.workspace.count()
    } catch (cause) {
      await this.$disconnect()
      throw new Error(
        'Database initialization failed. Run npm run db:setup to apply the committed migrations.',
        { cause },
      )
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
