import { db as prisma } from '../src/lib/db'

async function main() {
  console.log('🗑️  Deleting all user daily quests...')
  
  const result = await prisma.userDailyQuest.deleteMany({})
  
  console.log(`✅ Deleted ${result.count} quest records`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
