import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'
import { LearningService, inputText } from './learning.service.js'
import { LocalLearningGuard } from './local-learning.guard.js'

@Controller('learning')
@UseGuards(LocalLearningGuard)
export class LearningController {
  constructor(private readonly learning: LearningService) {}
  @Get('workspace') workspace() {
    return this.learning.workspace()
  }
  @Get('connection') connection() {
    return this.learning.tutor.connection()
  }
  @Post('connection/login') login() {
    return this.learning.tutor.login()
  }
  @Post('sessions') create(@Body() body: Record<string, unknown>) {
    return this.learning.create(body ?? {})
  }
  @Get('sessions/:id') session(@Param('id') id: string) {
    return this.learning.files.session(id)
  }
  @Patch('sessions/:id') update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.learning.update(id, body ?? {})
  }
  @Patch('progress') progress(@Body() body: Record<string, unknown>) {
    return this.learning.progress(body ?? {})
  }
  @Post('sessions/:id/cancel') async cancel(@Param('id') id: string) {
    await this.learning.files.session(id)
    return this.learning.cancel(id)
  }
  @Get('roadmaps/:id/source') async source(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const roadmap = await this.learning.files.roadmap(id)
    response.type('text/markdown; charset=utf-8').send(roadmap.markdown)
  }
  @Post('sessions/:id/messages') async message(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() response: Response,
  ) {
    const text = inputText(body?.text, 12000)
    await this.learning.files.session(id)
    response.set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    })
    response.flushHeaders()
    const abort = new AbortController()
    const closed = () => {
      if (!response.writableEnded) abort.abort()
    }
    response.on('close', closed)
    const emit = (event: Record<string, unknown>) => {
      if (!response.destroyed)
        response.write(`data: ${JSON.stringify(event)}\n\n`)
    }
    const heartbeat = setInterval(() => {
      if (!response.destroyed) response.write(': keepalive\n\n')
    }, 15000)
    try {
      await this.learning.chat(id, text, emit, abort.signal)
    } catch {
      emit({
        type: 'error',
        message: 'این جلسه مشغول است یا درخواست انجام نشد. دوباره تلاش کن.',
      })
    } finally {
      clearInterval(heartbeat)
      response.off('close', closed)
      response.end()
    }
  }
}
