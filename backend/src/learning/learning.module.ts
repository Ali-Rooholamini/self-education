import { Module } from '@nestjs/common'
import { LearningController } from './learning.controller.js'
import { LearningFilesService } from './learning-files.service.js'
import { LearningService } from './learning.service.js'
import { CodexTutorService } from './codex-tutor.service.js'
import { LocalLearningGuard } from './local-learning.guard.js'

@Module({
  controllers: [LearningController],
  providers: [
    LearningFilesService,
    LearningService,
    CodexTutorService,
    LocalLearningGuard,
  ],
})
export class LearningModule {}
