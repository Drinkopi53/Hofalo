// One-off: copies data from the legacy SQLite dev.db into the Postgres database
// configured by DATABASE_URL. Run with:
//   node --env-file=.env --experimental-sqlite scripts/copy-sqlite-to-postgres.mjs
import { DatabaseSync } from 'node:sqlite'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const DATE_FIELDS = {
  User: ['emailVerified', 'createdAt', 'updatedAt'],
  Session: ['expires'],
  VerificationToken: ['expires'],
  Congregation: ['birthDate', 'createdAt', 'updatedAt'],
  Category: ['createdAt', 'updatedAt'],
  Transaction: ['date', 'createdAt', 'updatedAt'],
  Offering: ['date', 'createdAt', 'updatedAt'],
  Budget: ['createdAt', 'updatedAt'],
  CashBalance: ['date', 'updatedAt'],
}

// Parents before children so foreign keys resolve.
const TABLES = [
  'User',
  'Account',
  'Session',
  'VerificationToken',
  'Congregation',
  'Category',
  'Transaction',
  'Offering',
  'Budget',
  'CashBalance',
]

const sqlite = new DatabaseSync('dev.db', { readOnly: true })
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

try {
  for (const table of TABLES) {
    const rows = sqlite.prepare(`select * from "${table}"`).all()
    if (rows.length === 0) {
      console.log(`${table.padEnd(20)} 0`)
      continue
    }
    const dates = DATE_FIELDS[table] ?? []
    const data = rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          dates.includes(key) && typeof value === 'string' ? new Date(value) : value,
        ]),
      ),
    )
    const { count } = await prisma[table[0].toLowerCase() + table.slice(1)].createMany({
      data,
      skipDuplicates: true,
    })
    console.log(`${table.padEnd(20)} ${count}`)
  }
} finally {
  await prisma.$disconnect()
  sqlite.close()
}
