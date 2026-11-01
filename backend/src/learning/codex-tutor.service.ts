import {
  Injectable,
  ServiceUnavailableException,
  type OnApplicationShutdown,
} from '@nestjs/common'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { CodexRpc } from './codex-rpc.js'
import { LearningFilesService } from './learning-files.service.js'
import type { LearningSession } from './learning.types.js'

interface Notification {
  threadId?: string
  delta?: string
  itemId?: string
  item?: { id: string; type: string; text?: string; phase?: string }
  turn?: { id: string; status: string; error?: { message: string } | null }
}

@Injectable()
export class CodexTutorService implements OnApplicationShutdown {
  private readonly rpc: CodexRpc
  private loaded = new Set<string>()
  private selectedModel: string | null = null
  constructor(private readonly files: LearningFilesService) {
    this.rpc = new CodexRpc(files.root)
    this.rpc.on('disconnected', () => {
      this.loaded.clear()
      this.selectedModel = null
    })
  }

  private async model() {
    if (process.env.CODEX_MODEL) return process.env.CODEX_MODEL
    if (this.selectedModel) return this.selectedModel
    const catalog = await this.rpc.request<{
      data: { model: string; isDefault: boolean }[]
    }>('model/list', { includeHidden: false })
    const selected =
      catalog.data.find((item) => item.isDefault) ?? catalog.data[0]
    if (!selected) throw new Error('No model advertised by Codex')
    this.selectedModel = selected.model
    return selected.model
  }

  async connection() {
    try {
      const result = await this.rpc.request<{
        account: { type: string; planType?: string } | null
      }>('account/read', { refreshToken: false })
      return {
        installed: true,
        connected: !!result.account,
        authType: result.account?.type ?? null,
        plan: result.account?.planType ?? null,
        model: result.account ? await this.model() : null,
        message: result.account
          ? 'حساب Codex متصل است.'
          : 'برای شروع، حساب ChatGPT را متصل کن.',
      }
    } catch {
      return {
        installed: false,
        connected: false,
        authType: null,
        plan: null,
        model: null,
        message:
          'Codex در دسترس نیست. نصب CLI و دستور codex login را روی همین دستگاه بررسی کن.',
      }
    }
  }

  async login() {
    const current = await this.connection()
    if (current.connected) return { connected: true }
    try {
      const result = await this.rpc.request<{
        type: string
        verificationUrl: string
        userCode: string
      }>('account/login/start', { type: 'chatgptDeviceCode' })
      const url = new URL(result.verificationUrl)
      if (
        url.protocol !== 'https:' ||
        !['auth.openai.com', 'chatgpt.com', 'auth0.openai.com'].includes(
          url.hostname,
        )
      )
        throw new Error('Unexpected login URL')
      return {
        connected: false,
        verificationUrl: url.href,
        userCode: result.userCode,
      }
    } catch {
      throw new ServiceUnavailableException(
        'ورود از داخل برنامه انجام نشد. در ترمینال codex login را اجرا کن و سپس اتصال را دوباره بررسی کن.',
      )
    }
  }

  async thread(session: LearningSession) {
    await this.rpc.start()
    if (session.threadId && this.loaded.has(session.threadId))
      return session.threadId
    const instructions = await readFile(
      join(this.files.root, 'tutor-instructions.md'),
      'utf8',
    )
    const settings = {
      model: await this.model(),
      cwd: this.files.root,
      sandbox: 'read-only',
      approvalPolicy: 'never',
      baseInstructions: instructions,
      developerInstructions:
        'Teach in Persian using the supplied roadmap. Do not call tools, execute code, edit files, delegate agents, or automatically mark learning complete.',
      config: {
        'features.shell_tool': false,
        'features.multi_agent': false,
        web_search: 'disabled',
        project_doc_max_bytes: 0,
      },
    }
    if (session.threadId) {
      try {
        await this.rpc.request('thread/resume', {
          ...settings,
          threadId: session.threadId,
          excludeTurns: true,
        })
        this.loaded.add(session.threadId)
        return session.threadId
      } catch (error) {
        if (
          !/not found|does not exist|no rollout|unable to find/i.test(
            (error as Error).message,
          )
        )
          throw error
        // A copied local transcript can be used even if its old Codex thread is absent.
      }
    }
    const result = await this.rpc.request<{ thread: { id: string } }>(
      'thread/start',
      settings,
    )
    this.loaded.add(result.thread.id)
    return result.thread.id
  }

  async answer(
    threadId: string,
    prompt: string,
    onDelta: (text: string) => void,
    signal: AbortSignal,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const parts = new Map<string, string>()
      let turnId: string | null = null
      let ended = false
      const cleanup = () => {
        clearTimeout(timeout)
        this.rpc.off('notification', notification)
        this.rpc.off('disconnected', disconnected)
        signal.removeEventListener('abort', abort)
      }
      const finish = (error?: Error) => {
        if (ended) return
        ended = true
        cleanup()
        if (error) reject(error)
        else resolve([...parts.values()].filter(Boolean).join('\n\n'))
      }
      const interrupt = () => {
        if (turnId)
          void this.rpc
            .request('turn/interrupt', { threadId, turnId })
            .catch(() => undefined)
      }
      const abort = () => {
        interrupt()
        finish(new Error('پاسخ متوقف شد.'))
      }
      const disconnected = () =>
        finish(new Error('ارتباط با Codex قطع شد؛ می‌توانی دوباره تلاش کنی.'))
      const notification = (method: string, params: Notification) => {
        if (params.threadId !== threadId) return
        if (method === 'item/agentMessage/delta' && params.delta) {
          const id = params.itemId ?? 'reply'
          parts.set(id, (parts.get(id) ?? '') + params.delta)
          onDelta(params.delta)
        }
        if (
          method === 'item/completed' &&
          params.item?.type === 'agentMessage' &&
          params.item.text
        )
          parts.set(params.item.id, params.item.text)
        if (method === 'turn/completed' && params.turn) {
          if (params.turn.status === 'completed') finish()
          else
            finish(
              new Error(
                params.turn.status === 'interrupted'
                  ? 'پاسخ متوقف شد.'
                  : 'Codex نتوانست پاسخ را کامل کند. اتصال، دسترسی مدل یا محدودیت مصرف حساب را بررسی کن.',
              ),
            )
        }
      }
      const timeout = setTimeout(() => {
        interrupt()
        finish(new Error('زمان پاسخ طولانی شد. دوباره تلاش کن.'))
      }, 180_000)
      this.rpc.on('notification', notification)
      this.rpc.once('disconnected', disconnected)
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted) {
        abort()
        return
      }
      void this.rpc
        .request<{ turn: { id: string } }>('turn/start', {
          threadId,
          input: [{ type: 'text', text: prompt }],
          approvalPolicy: 'never',
          sandboxPolicy: { type: 'readOnly', networkAccess: false },
          model: this.selectedModel ?? process.env.CODEX_MODEL,
        })
        .then((result) => {
          turnId = result.turn.id
          if (ended) interrupt()
        })
        .catch((error) => finish(error as Error))
    })
  }

  onApplicationShutdown() {
    this.rpc.close()
  }
}
