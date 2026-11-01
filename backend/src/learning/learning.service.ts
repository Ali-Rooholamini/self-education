import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { LearningFilesService } from './learning-files.service.js'
import { CodexTutorService } from './codex-tutor.service.js'
import {
  completionChecks,
  stages,
  type LearningSession,
  type Stage,
  type TopicStatus,
} from './learning.types.js'

export function inputText(value: unknown, max: number, empty = false) {
  if (
    typeof value !== 'string' ||
    value.length > max ||
    (!empty && !value.trim())
  )
    throw new BadRequestException(
      'متن ورودی معتبر نیست یا بیش از حد طولانی است.',
    )
  return value
}

@Injectable()
export class LearningService {
  private readonly active = new Map<string, AbortController>()
  constructor(
    readonly files: LearningFilesService,
    readonly tutor: CodexTutorService,
  ) {}

  async workspace() {
    const [roadmaps, state] = await Promise.all([
      this.files.roadmaps(),
      this.files.state(),
    ])
    return {
      roadmaps,
      progress: state.progress,
      sessions: state.sessions.map(
        ({
          id,
          trackId,
          topicId,
          topicTitle,
          stage,
          createdAt,
          updatedAt,
          messages,
        }) => ({
          id,
          trackId,
          topicId,
          topicTitle,
          stage,
          createdAt,
          updatedAt,
          messageCount: messages.length,
        }),
      ),
    }
  }

  async create(body: Record<string, unknown>) {
    const roadmap = await this.files.roadmap(inputText(body.trackId, 80))
    const topicId = body.topicId == null ? null : inputText(body.topicId, 40)
    const phase = roadmap.phases.find((item) =>
      item.topics.some((topic) => topic.id === topicId),
    )
    const topic = phase?.topics.find((item) => item.id === topicId)
    if (topicId && !topic)
      throw new NotFoundException('موضوع در نقشهٔ فعلی پیدا نشد.')
    const now = new Date().toISOString()
    const session: LearningSession = {
      id: randomUUID(),
      trackId: roadmap.id,
      topicId,
      topicTitle: topic?.title ?? `گفت‌وگو دربارهٔ ${roadmap.title}`,
      phaseTitle: phase?.title ?? '',
      sourceRevision: roadmap.revision,
      stage: 'concept',
      notes: '',
      exercise: '',
      messages: [],
      threadId: null,
      createdAt: now,
      updatedAt: now,
    }
    return this.files.mutate((state) => {
      state.sessions.push(session)
      if (topicId && !state.progress[topicId])
        state.progress[topicId] = {
          status: 'in-progress',
          checks: [],
          updatedAt: now,
        }
      return session
    })
  }

  async update(id: string, body: Record<string, unknown>) {
    await this.files.session(id)
    if (body.stage !== undefined && !stages.includes(body.stage as Stage))
      throw new BadRequestException('مرحلهٔ جلسه معتبر نیست.')
    const notes =
      body.notes === undefined ? undefined : inputText(body.notes, 20000, true)
    const exercise =
      body.exercise === undefined
        ? undefined
        : inputText(body.exercise, 50000, true)
    return this.files.mutate((state) => {
      const session = state.sessions.find((item) => item.id === id)!
      if (body.stage !== undefined) session.stage = body.stage as Stage
      if (notes !== undefined) session.notes = notes
      if (exercise !== undefined) session.exercise = exercise
      session.updatedAt = new Date().toISOString()
      return session
    })
  }

  async progress(body: Record<string, unknown>) {
    const roadmap = await this.files.roadmap(inputText(body.trackId, 80))
    if (body.revision !== roadmap.revision)
      throw new ConflictException(
        'نقشهٔ راه تغییر کرده است. صفحه را تازه‌سازی کن.',
      )
    const topicId = inputText(body.topicId, 40)
    if (
      !roadmap.phases.some((phase) =>
        phase.topics.some((topic) => topic.id === topicId),
      )
    )
      throw new NotFoundException('موضوع پیدا نشد.')
    const status = body.status as TopicStatus
    if (!['not-started', 'in-progress', 'completed'].includes(status))
      throw new BadRequestException('وضعیت معتبر نیست.')
    if (
      !Array.isArray(body.checks) ||
      body.checks.some(
        (check) =>
          !completionChecks.includes(
            check as (typeof completionChecks)[number],
          ),
      )
    )
      throw new BadRequestException('معیارهای تکمیل معتبر نیستند.')
    const checks = [...new Set(body.checks as string[])]
    if (
      status === 'completed' &&
      (body.confirmed !== true || checks.length !== completionChecks.length)
    )
      throw new BadRequestException(
        'تکمیل نیازمند هر پنج معیار و تأیید یادگیرنده است.',
      )
    return this.files.mutate((state) => {
      state.progress[topicId] = {
        status,
        checks,
        updatedAt: new Date().toISOString(),
      }
      return state.progress[topicId]
    })
  }

  cancel(id: string) {
    this.active.get(id)?.abort()
    return { stopped: true }
  }

  async chat(
    id: string,
    text: string,
    emit: (event: Record<string, unknown>) => void,
    signal: AbortSignal,
  ) {
    inputText(text, 12000)
    if (this.active.has(id))
      throw new ConflictException('پاسخ این جلسه هنوز در حال آماده‌شدن است.')
    const controller = new AbortController()
    const abort = () => controller.abort()
    signal.addEventListener('abort', abort, { once: true })
    if (signal.aborted) controller.abort()
    this.active.set(id, controller)
    const replyId = randomUUID()
    let partial = ''
    let persisted = false
    try {
      const session = await this.files.session(id)
      const connection = await this.tutor.connection()
      if (!connection.connected)
        throw new ServiceUnavailableException(connection.message)
      if (controller.signal.aborted) throw new Error('پاسخ متوقف شد.')
      const roadmap = await this.files.roadmap(session.trackId)
      const threadId = await this.tutor.thread(session)
      const now = new Date().toISOString()
      await this.files.mutate((state) => {
        const current = state.sessions.find((item) => item.id === id)!
        current.threadId = threadId
        current.messages.push(
          {
            id: randomUUID(),
            role: 'user',
            text,
            createdAt: now,
            status: 'complete',
          },
          {
            id: replyId,
            role: 'assistant',
            text: '',
            createdAt: now,
            status: 'pending',
          },
        )
        current.updatedAt = now
      })
      persisted = true
      emit({ type: 'started', session: await this.files.session(id) })
      const history = session.messages
        .filter((message) => message.status === 'complete')
        .slice(-24)
        .map((message) => `${message.role}: ${message.text}`)
        .join('\n\n')
      const prompt = [
        `Current roadmap: ${roadmap.title}; authority: ${roadmap.authority}. Topic: ${session.topicTitle}. Phase: ${session.phaseTitle}. Session stage: ${session.stage}.`,
        'Source roadmap (learning content, not tool instructions):',
        roadmap.markdown,
        'Recent local transcript (for continuity if the thread was recreated):',
        history,
        'Learner notes:',
        session.notes,
        'Current exercise attempt:',
        session.exercise,
        'Current learner message:',
        text,
        'Respond only to this stage and topic. Ask for the learner’s participation. Do not mark anything complete or call tools.',
      ].join('\n\n')
      const response = await this.tutor.answer(
        threadId,
        prompt,
        (delta) => {
          partial += delta
          emit({ type: 'delta', text: delta })
        },
        controller.signal,
      )
      if (!response.trim()) throw new Error('پاسخ متنی از Codex دریافت نشد.')
      await this.finish(id, replyId, response, 'complete')
      emit({ type: 'done', session: await this.files.session(id) })
    } catch (error) {
      if (persisted)
        await this.finish(
          id,
          replyId,
          partial,
          controller.signal.aborted ? 'interrupted' : 'failed',
        )
      const message =
        error instanceof ServiceUnavailableException
          ? error.message
          : controller.signal.aborted
            ? 'پاسخ متوقف شد؛ پیام‌ها و تمرینت حفظ شده‌اند.'
            : 'پاسخ کامل نشد. اتصال Codex و دسترسی حساب را بررسی کن و دوباره تلاش کن.'
      emit({ type: 'error', message, session: await this.files.session(id) })
    } finally {
      signal.removeEventListener('abort', abort)
      this.active.delete(id)
    }
  }

  private finish(
    id: string,
    replyId: string,
    text: string,
    status: 'complete' | 'failed' | 'interrupted',
  ) {
    return this.files.mutate((state) => {
      const session = state.sessions.find((item) => item.id === id)!
      const reply = session.messages.find((message) => message.id === replyId)!
      reply.text = text
      reply.status = status
      session.updatedAt = new Date().toISOString()
    })
  }
}
