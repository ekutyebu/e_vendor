import { prisma } from './lib/prisma.js'

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true
    }
  })
  console.log('--- Users in Database ---')
  console.table(users)
}

checkUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
