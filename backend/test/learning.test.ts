import 'reflect-metadata'
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { mkdtemp, cp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import { backendDirectory } from '../src/database/database-location.js'
import { LearningModule } from '../src/learning/learning.module.js'
import { CodexTutorService } from '../src/learning/codex-tutor.service.js'
import { LearningFilesService } from '../src/learning/learning-files.service.js'
import { parseRoadmap } from '../src/learning/roadmap-parser.js'
import { CodexRpc } from '../src/learning/codex-rpc.js'
import { configureApp } from '../src/configure-app.js'
import type {
  LearningSession,
  Roadmap,
} from '../src/learning/learning.types.js'

let root: string
let app: INestApplication
let url: string
let reactBefore: string
const oldRoot = process.env.LEARNING_ROOT
const fakeTutor = {
  connection: async () => ({
    installed: true,
    connected: true,
    authType: 'chatgpt',
    plan: 'test',
    model: null,
    message: 'test connection',
  }),
  thread: async () => 'test-thread',
  answer: async (
    _threadId: string,
    prompt: string,
    delta: (value: string) => void,
  ) => {
    assert.ok(prompt.includes('React Learning Track'))
    assert.ok(prompt.includes('Current learner message:'))
    delta('پاسخ ')
    delta('آزمایشی')
    return 'پاسخ آزمایشی'
  },
}

before(async () => {
  root = await mkdtemp(join(tmpdir(), 'self-education-learning-test-'))
  await cp(
    join(backendDirectory(), '../learning/roadmaps'),
    join(root, 'roadmaps'),
    { recursive: true },
  )
  await cp(
    join(backendDirectory(), '../learning/tutor-instructions.md'),
    join(root, 'tutor-instructions.md'),
  )
  process.env.LEARNING_ROOT = root
  reactBefore = await readFile(join(root, 'roadmaps/react.md'), 'utf8')
  const module = await Test.createTestingModule({ imports: [LearningModule] })
    .overrideProvider(CodexTutorService)
    .useValue(fakeTutor)
    .compile()
  app = module.createNestApplication()
  configureApp(app)
  await app.listen(0, '127.0.0.1')
  url = await app.getUrl()
})
after(async () => {
  await app?.close()
  if (oldRoot === undefined) delete process.env.LEARNING_ROOT
  else process.env.LEARNING_ROOT = oldRoot
  await rm(root, { recursive: true, force: true })
})
const request = (
  path: string,
  method = 'GET',
  body?: unknown,
  origin = process.env.CORS_ORIGIN ?? 'http://localhost:3000',
) =>
  fetch(`${url}/api/learning${path}`, {
    method,
    headers: {
      Origin: origin,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

async function workspace() {
  return (await (await request('/workspace')).json()) as {
    roadmaps: Roadmap[]
    sessions: LearningSession[]
  }
}

test('parser handles both React phase heading levels and ignores checkboxes inside code', () => {
  const parsed = parseRoadmap(
    'react',
    '## Phase 1 — Core\n- [ ] `useState`\n```md\n- [x] not a topic\n```\n# Phase 12 — Next.js\n- [~] App Router\n# 5. Main Project\n- [ ] not a topic',
  )
  assert.equal(parsed.length, 2)
  assert.equal(parsed[0]?.topics.length, 1)
  assert.equal(parsed[1]?.topics[0]?.status, 'in-progress')
})

test('workspace comes from Markdown and preserves all 15 imported React phases', async () => {
  const data = await workspace()
  const react = data.roadmaps.find((item) => item.id === 'react')!
  assert.equal(react.authority, 'authoritative')
  assert.equal(react.phases.length, 15)
  assert.ok(react.phases[11]?.title.includes('Next.js'))
  assert.ok(
    react.phases
      .flatMap((phase) => phase.topics)
      .every((topic) => topic.status === 'not-started'),
  )
  assert.equal(
    data.roadmaps.find((item) => item.id === 'typescript')?.phases.length,
    0,
  )
  assert.equal(
    data.roadmaps.find((item) => item.id === 'performance')?.authority,
    'proposed',
  )
})

test('sessions persist exercises and streamed chat in files without modifying roadmap sources', async () => {
  const react = (await workspace()).roadmaps.find(
    (item) => item.id === 'react',
  )!
  const topic = react.phases[0]!.topics[0]!
  const session = (await (
    await request('/sessions', 'POST', { trackId: 'react', topicId: topic.id })
  ).json()) as LearningSession
  assert.equal(
    (
      await request(`/sessions/${session.id}`, 'PATCH', {
        stage: 'exercise',
        notes: 'سؤال من',
        exercise: '<script>alert(1)</script>\nconst answer = 42',
      })
    ).status,
    200,
  )
  const chat = await request(`/sessions/${session.id}/messages`, 'POST', {
    text: 'یک تمرین بده',
  })
  const stream = await chat.text()
  assert.ok(stream.includes('"type":"delta"'))
  assert.ok(stream.includes('"type":"done"'))
  const reloaded = (await (
    await request(`/sessions/${session.id}`)
  ).json()) as LearningSession
  assert.equal(reloaded.messages[1]?.text, 'پاسخ آزمایشی')
  assert.equal(reloaded.stage, 'exercise')
  assert.ok(reloaded.exercise.includes('<script>'))
  assert.equal(
    await readFile(join(root, 'roadmaps/react.md'), 'utf8'),
    reactBefore,
  )
  const saved = JSON.parse(
    await readFile(join(root, '.local/workspace.json'), 'utf8'),
  ) as { sessions: LearningSession[] }
  assert.equal(saved.sessions[0]?.notes, 'سؤال من')
  assert.equal(
    (
      await request('/sessions', 'POST', {
        trackId: '../../etc',
        topicId: topic.id,
      })
    ).status,
    404,
  )
})

test('a room accepts only one active tutor reply at a time', async () => {
  const session = (await (
    await request('/sessions', 'POST', { trackId: 'react' })
  ).json()) as LearningSession
  const original = fakeTutor.answer
  let release!: () => void
  let entered!: () => void
  const waiting = new Promise<void>((resolve) => {
    release = resolve
  })
  const started = new Promise<void>((resolve) => {
    entered = resolve
  })
  fakeTutor.answer = async (...args: Parameters<typeof original>) => {
    entered()
    await waiting
    return original(...args)
  }
  try {
    const first = await request(`/sessions/${session.id}/messages`, 'POST', {
      text: 'شروع',
    })
    await started
    const second = await request(`/sessions/${session.id}/messages`, 'POST', {
      text: 'تکراری',
    })
    assert.ok((await second.text()).includes('"type":"error"'))
    release()
    assert.ok((await first.text()).includes('"type":"done"'))
    const saved = (await (
      await request(`/sessions/${session.id}`)
    ).json()) as LearningSession
    assert.equal(saved.messages.length, 2)
  } finally {
    release()
    fakeTutor.answer = original
  }
})

test('completion requires the learner’s explicit confirmation and all five criteria', async () => {
  const react = (await workspace()).roadmaps.find(
    (item) => item.id === 'react',
  )!
  const body = {
    trackId: 'react',
    topicId: react.phases[0]!.topics[0]!.id,
    revision: react.revision,
    status: 'completed',
    checks: ['explain'],
  }
  assert.equal((await request('/progress', 'PATCH', body)).status, 400)
  const complete = {
    ...body,
    checks: ['explain', 'apply', 'compare', 'pitfalls', 'exercise'],
    confirmed: true,
  }
  assert.equal(
    (await request('/progress', 'PATCH', { ...complete, revision: 'stale' }))
      .status,
    409,
  )
  assert.equal(
    (await request('/progress', 'PATCH', { ...complete, confirmed: 'false' }))
      .status,
    400,
  )
  assert.equal((await request('/progress', 'PATCH', complete)).status, 200)
  assert.equal(
    (await workspace()).roadmaps.find((item) => item.id === 'react')?.phases[0]
      ?.topics[0]?.status,
    'completed',
  )
  assert.equal(
    await readFile(join(root, 'roadmaps/react.md'), 'utf8'),
    reactBefore,
  )
})

test('external browser origins cannot access the local account or chat endpoints', async () => {
  assert.equal(
    (
      await request(
        '/connection',
        'GET',
        undefined,
        'https://unrelated.example',
      )
    ).status,
    403,
  )
})

test('corrupt personal state is reported rather than overwritten', async () => {
  const file = join(root, '.local/workspace.json')
  const original = await readFile(file, 'utf8')
  await writeFile(file, 'broken JSON')
  try {
    const files = app.get(LearningFilesService)
    await assert.rejects(
      files.mutate((state) => {
        state.sessions = []
      }),
    )
    assert.equal(await readFile(file, 'utf8'), 'broken JSON')
  } finally {
    await writeFile(file, original)
  }
})

test('Codex transport performs the initialization handshake and routes real stdio messages', async () => {
  const rpc = new CodexRpc(root, process.execPath, [
    join(backendDirectory(), 'test/fixtures/fake-codex.mjs'),
  ])
  try {
    const account = await rpc.request<{ account: { type: string } }>(
      'account/read',
      {},
    )
    assert.equal(account.account.type, 'chatgpt')
    const notification = new Promise<string>((resolve) =>
      rpc.once('notification', (_method: string, params: { delta: string }) =>
        resolve(params.delta),
      ),
    )
    await rpc.request('test/notification')
    assert.equal(await notification, 'سلام')
    await assert.rejects(rpc.request('unsupported'), /Unknown test method/)
  } finally {
    rpc.close()
  }
})
