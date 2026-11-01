import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module.js'
import { LearningModule } from './learning/learning.module.js'

@Module({
  imports: [HealthModule, LearningModule],
})
export class AppModule {}
