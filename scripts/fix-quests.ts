import { db as prisma } from '../src/lib/db'

async function main() {
  console.log('🔧 Fixing quest completedAt values...')
  
  // Set completedAt to null for all completed quests
  const result = await prisma.userDailyQuest.updateMany({
    where: {
      completed: true,
    },
    data: {
      completedAt: null,
    },
  })
  
  console.log(`✅ Fixed ${result.count} quest records`)
  console.log('Now completed quests will show "Al" button!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
