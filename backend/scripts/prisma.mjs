import { mkdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import {
  backendDirectory,
  databaseLocation,
} from '../src/database/database-location.ts'

const require = createRequire(import.meta.url)
const manifestPath = require.resolve('prisma/package.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const cli = resolve(dirname(manifestPath), manifest.bin.prisma)
const location = databaseLocation()
mkdirSync(dirname(location.path), { recursive: true })

const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  cwd: backendDirectory(),
  env: { ...process.env, DATABASE_URL: location.url },
  stdio: 'inherit',
})

if (result.error) throw result.error
process.exitCode = result.status ?? 1
