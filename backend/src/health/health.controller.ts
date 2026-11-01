import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service.js'

@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  async getHealth() {
    try {
      await this.database.$queryRaw`SELECT 1`
    } catch {
      throw new ServiceUnavailableException('Database is unavailable')
    }

    return { status: 'ok', service: 'self-education-api' }
  }
}
