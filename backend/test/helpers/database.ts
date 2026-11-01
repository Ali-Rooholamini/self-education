import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { backendDirectory } from '../../src/database/database-location.js'

const execute = promisify(execFile)

export async function applyTestMigrations(url: string) {
  await execute(
    process.execPath,
    [join(backendDirectory(), 'scripts/prisma.mjs'), 'migrate', 'deploy'],
    {
      cwd: backendDirectory(),
      env: { ...process.env, DATABASE_URL: url },
    },
  )
}

export async function createTestDatabase() {
  const directory = await mkdtemp(join(tmpdir(), 'self-education test-'))
  const url = pathToFileURL(join(directory, 'nested', 'learning.db')).href
  const cleanup = () => rm(directory, { recursive: true, force: true })

  try {
    await applyTestMigrations(url)
    return { url, cleanup }
  } catch (error) {
    await cleanup()
    throw error
  }
}
