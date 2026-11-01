import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { readFile, mkdir, writeFile, rename, unlink } from 'node:fs/promises'
import { randomUUID, createHash } from 'node:crypto'
import { join, resolve } from 'node:path'
import { backendDirectory } from '../database/database-location.js'
import { parseRoadmap } from './roadmap-parser.js'
import type { LearningState, Roadmap } from './learning.types.js'

@Injectable()
export class LearningFilesService {
  readonly root = resolve(
    process.env.LEARNING_ROOT ?? join(backendDirectory(), '../learning'),
  )
  private readonly stateFile = join(this.root, '.local/workspace.json')
  private queue: Promise<unknown> = Promise.resolve()

  async state(): Promise<LearningState> {
    try {
      const state = JSON.parse(
        await readFile(this.stateFile, 'utf8'),
      ) as LearningState
      if (
        state.version !== 1 ||
        !Array.isArray(state.sessions) ||
        !state.progress ||
        typeof state.progress !== 'object'
      )
        throw new Error('Unsupported learning state')
      return state
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT')
        return { version: 1, progress: {}, sessions: [] }
      throw new ServiceUnavailableException(
        'فایل جلسات قابل خواندن نیست؛ برای حفظ داده، بازنویسی نشد.',
      )
    }
  }

  mutate<T>(change: (state: LearningState) => T | Promise<T>): Promise<T> {
    const operation = this.queue.then(async () => {
      const state = await this.state()
      const result = await change(state)
      await mkdir(join(this.root, '.local'), { recursive: true, mode: 0o700 })
      const temporary = `${this.stateFile}.${randomUUID()}.tmp`
      try {
        await writeFile(temporary, JSON.stringify(state, null, 2), {
          mode: 0o600,
        })
        await rename(temporary, this.stateFile)
      } finally {
        await unlink(temporary).catch(() => undefined)
      }
      return result
    })
    this.queue = operation.catch(() => undefined)
    return operation
  }

  async roadmaps(): Promise<Roadmap[]> {
    const catalog = JSON.parse(
      await readFile(join(this.root, 'roadmaps/catalog.json'), 'utf8'),
    ) as Omit<Roadmap, 'markdown' | 'revision' | 'phases'>[]
    const state = await this.state()
    return Promise.all(
      catalog.map(async (entry) => {
        if (
          !/^[a-z0-9-]+\.md$/.test(entry.file) ||
          !/^[a-z0-9-]+$/.test(entry.id)
        )
          throw new ServiceUnavailableException(
            'فهرست نقشه‌های راه معتبر نیست.',
          )
        const markdown = await readFile(
          join(this.root, 'roadmaps', entry.file),
          'utf8',
        )
        const phases = parseRoadmap(entry.id, markdown)
        for (const phase of phases)
          for (const topic of phase.topics)
            topic.status = state.progress[topic.id]?.status ?? topic.status
        return {
          ...entry,
          markdown,
          phases,
          revision: createHash('sha256').update(markdown).digest('hex'),
        }
      }),
    )
  }

  async roadmap(id: string) {
    const roadmap = (await this.roadmaps()).find((item) => item.id === id)
    if (!roadmap) throw new NotFoundException('مسیر پیدا نشد.')
    return roadmap
  }

  async session(id: string) {
    if (!/^[0-9a-f-]{36}$/.test(id))
      throw new NotFoundException('جلسه پیدا نشد.')
    const session = (await this.state()).sessions.find((item) => item.id === id)
    if (!session) throw new NotFoundException('جلسه پیدا نشد.')
    return session
  }
}
