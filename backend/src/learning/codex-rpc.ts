import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createInterface } from 'node:readline'
import { EventEmitter } from 'node:events'

interface RpcMessage {
  id?: number
  method?: string
  result?: unknown
  error?: { message: string }
  params?: Record<string, unknown>
}
export class CodexRpc extends EventEmitter {
  private process: ChildProcessWithoutNullStreams | null = null
  private ready: Promise<void> | null = null
  private counter = 0
  private pending = new Map<
    number,
    {
      resolve: (value: unknown) => void
      reject: (error: Error) => void
      timer: NodeJS.Timeout
    }
  >()

  constructor(
    private readonly cwd: string,
    private readonly command = process.env.CODEX_BIN ?? 'codex',
    private readonly args = ['app-server', '--listen', 'stdio://'],
  ) {
    super()
  }

  async start() {
    if (this.ready) return this.ready
    this.ready = (async () => {
      const child = spawn(this.command, this.args, {
        cwd: this.cwd,
        stdio: 'pipe',
        env: process.env,
      })
      this.process = child
      child.stderr.resume() // Do not send CLI logs or credential-related diagnostics to browsers.
      createInterface({ input: child.stdout }).on('line', (line) => {
        let message: RpcMessage
        try {
          message = JSON.parse(line) as RpcMessage
        } catch {
          return
        }
        if (message.id !== undefined && message.method) {
          // The teaching UI never approves tool execution or additional permissions.
          child.stdin.write(
            `${JSON.stringify({ id: message.id, error: { code: -32601, message: 'This tutor does not authorize tool requests' } })}\n`,
          )
          return
        }
        if (message.id !== undefined) {
          const pending = this.pending.get(message.id)
          if (!pending) return
          clearTimeout(pending.timer)
          this.pending.delete(message.id)
          if (message.error) pending.reject(new Error(message.error.message))
          else pending.resolve(message.result)
        } else if (message.method)
          this.emit('notification', message.method, message.params ?? {})
      })
      const closed = () => {
        if (this.process !== child) return
        this.process = null
        this.ready = null
        for (const pending of this.pending.values()) {
          clearTimeout(pending.timer)
          pending.reject(new Error('ارتباط با Codex قطع شد.'))
        }
        this.pending.clear()
        this.emit('disconnected')
      }
      child.once('error', closed)
      child.once('exit', closed)
      await this.requestRaw('initialize', {
        clientInfo: {
          name: 'self_education_learning',
          title: 'Self Education Learning',
          version: '0.1.0',
        },
      })
      child.stdin.write(
        `${JSON.stringify({ method: 'initialized', params: {} })}\n`,
      )
    })().catch((error) => {
      this.close()
      this.ready = null
      throw error
    })
    return this.ready
  }

  private requestRaw(method: string, params: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.process?.stdin.writable)
        return reject(new Error('Codex در دسترس نیست.'))
      const id = ++this.counter
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error('Codex در زمان مورد انتظار پاسخ نداد.'))
      }, 30_000)
      this.pending.set(id, { resolve, reject, timer })
      this.process.stdin.write(
        `${JSON.stringify({ id, method, params })}\n`,
        (error) => {
          if (error) {
            clearTimeout(timer)
            this.pending.delete(id)
            reject(error)
          }
        },
      )
    })
  }

  async request<T = Record<string, unknown>>(
    method: string,
    params: unknown = {},
  ): Promise<T> {
    await this.start()
    return (await this.requestRaw(method, params)) as T
  }

  close() {
    this.process?.kill('SIGTERM')
  }
}
