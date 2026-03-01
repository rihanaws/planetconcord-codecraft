import { prisma } from '../lib/db/prisma'

async function main() {
  const email = 'ar3636998@yahoo.com'
  const correctEmailVerifiedDate = new Date('2026-02-02T20:35:00.000Z')

  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    console.log('User not found')
    return
  }

  console.log(`Current emailVerified: ${user.emailVerified}`)

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: correctEmailVerifiedDate },
  })

  console.log(`Updated emailVerified: ${updated.emailVerified}`)
  console.log('Done.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
