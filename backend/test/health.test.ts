import 'reflect-metadata'
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module.js'
import { configureApp } from '../src/configure-app.js'
import { createTestDatabase } from './helpers/database.js'
import { DatabaseService } from '../src/database/database.service.js'

let app: INestApplication
let baseURL: string
let database: Awaited<ReturnType<typeof createTestDatabase>>
const previousDatabaseUrl = process.env.DATABASE_URL

before(async () => {
  database = await createTestDatabase()
  process.env.DATABASE_URL = database.url
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()
  app = module.createNestApplication()
  configureApp(app)
  await app.listen(0, '127.0.0.1')
  baseURL = await app.getUrl()
})

after(async () => {
  await app?.close()
  await database?.cleanup()
  if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = previousDatabaseUrl
})

test('health endpoint is available under /api with the configured frontend origin', async () => {
  const origin = process.env.CORS_ORIGIN ?? 'http://localhost:3000'
  const response = await fetch(`${baseURL}/api/health`, {
    headers: { Origin: origin },
  })

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('access-control-allow-origin'), origin)
  assert.deepEqual(await response.json(), {
    status: 'ok',
    service: 'self-education-api',
  })
})

test('unprefixed health route is not exposed', async () => {
  const response = await fetch(`${baseURL}/health`)
  assert.equal(response.status, 404)
})

test('health returns 503 when the database cannot be queried', async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(DatabaseService)
    .useValue({
      $queryRaw: async () => {
        throw new Error('Simulated unavailable database')
      },
    })
    .compile()
  const unavailableApp = module.createNestApplication()
  configureApp(unavailableApp)

  try {
    await unavailableApp.listen(0, '127.0.0.1')
    const response = await fetch(`${await unavailableApp.getUrl()}/api/health`)
    assert.equal(response.status, 503)
    const body = (await response.json()) as { message: string }
    assert.equal(body.message, 'Database is unavailable')
  } finally {
    await unavailableApp.close()
  }
})
