import 'reflect-metadata'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  backendDirectory,
  databaseLocation,
} from '../src/database/database-location.js'
import { DatabaseService } from '../src/database/database.service.js'
import { applyTestMigrations, createTestDatabase } from './helpers/database.js'

test('relative database paths are anchored to the backend package', () => {
  const location = databaseLocation('file:./data/custom.db')
  assert.equal(location.path, join(backendDirectory(), 'data/custom.db'))
  assert.equal(fileURLToPath(location.url), location.path)
  assert.throws(
    () => databaseLocation('postgresql://localhost/learning'),
    /local SQLite file/,
  )
  assert.throws(() => databaseLocation('file::memory:'), /local SQLite file/)
})

test('migrations create a local database and repeated runs preserve saved Persian data', async () => {
  const temporary = await createTestDatabase()
  const previousDatabaseUrl = process.env.DATABASE_URL
  process.env.DATABASE_URL = temporary.url
  let database: DatabaseService | undefined

  try {
    assert.ok(existsSync(fileURLToPath(temporary.url)))
    database = new DatabaseService()
    await database.onModuleInit()
    assert.equal(await database.workspace.count(), 0)

    const saved = await database.workspace.create({
      data: { name: 'مسیر یادگیری من' },
    })
    assert.equal(saved.locale, 'fa')
    await database.onModuleDestroy()
    database = undefined

    await applyTestMigrations(temporary.url)
    database = new DatabaseService()
    await database.onModuleInit()
    const restored = await database.workspace.findUniqueOrThrow({
      where: { id: saved.id },
    })
    assert.equal(restored.name, 'مسیر یادگیری من')
    assert.equal(
      restored.createdAt.toISOString(),
      saved.createdAt.toISOString(),
    )
    assert.equal(await database.workspace.count(), 1)
  } finally {
    await database?.onModuleDestroy()
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = previousDatabaseUrl
    await temporary.cleanup()
  }
})
