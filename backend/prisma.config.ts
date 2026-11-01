import { defineConfig } from 'prisma/config'
import { databaseLocation } from './src/database/database-location.ts'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: databaseLocation().migrationUrl },
})
