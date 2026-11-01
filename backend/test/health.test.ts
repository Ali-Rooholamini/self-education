import 'reflect-metadata'
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module.js'
import { configureApp } from '../src/configure-app.js'

let app: INestApplication
let baseURL: string

before(async () => {
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
