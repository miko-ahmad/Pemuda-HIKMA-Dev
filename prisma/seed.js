const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const plainPassword = 'adminpassword'

  // Cek apakah user sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log(`Admin with email ${email} already exists.`)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  // Create new admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: email,
      password: hashedPassword,
      role: 'ADMIN', // pastikan enum 'ADMIN' tersedia di schema
    },
  })

  console.log('✅ Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
