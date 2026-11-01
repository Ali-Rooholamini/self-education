import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export function backendDirectory() {
  let directory = dirname(fileURLToPath(import.meta.url))

  // Works from source, dist/, compiled tests, and any working directory.
  while (true) {
    const manifest = join(directory, 'package.json')
    if (existsSync(manifest)) {
      const metadata = JSON.parse(readFileSync(manifest, 'utf8')) as {
        name?: string
      }
      if (metadata.name === '@self-education/backend') return directory
    }

    const parent = dirname(directory)
    if (parent === directory)
      throw new Error('Cannot locate the backend package directory')
    directory = parent
  }
}

export function databaseLocation(
  value = process.env.DATABASE_URL ?? 'file:./data/self-education.db',
) {
  if (
    !value.startsWith('file:') ||
    value.length === 5 ||
    /[?#]/.test(value) ||
    value.includes(':memory:')
  ) {
    throw new Error(
      'DATABASE_URL must point to a local SQLite file, such as file:./data/self-education.db',
    )
  }

  const path = value.startsWith('file://')
    ? fileURLToPath(value)
    : resolve(backendDirectory(), value.slice(5))

  return {
    path,
    url: pathToFileURL(path).href,
    // Prisma's SQLite migration engine treats percent escapes as literal path
    // characters, while the libSQL runtime adapter parses standard file URLs.
    migrationUrl: `file:${path.replaceAll('\\', '/')}`,
  }
}
