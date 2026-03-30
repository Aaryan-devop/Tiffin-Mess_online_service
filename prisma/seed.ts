import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Hash a default password
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create a consumer user
  const consumer = await prisma.user.upsert({
    where: { email: 'consumer@example.com' },
    update: {},
    create: {
      email: 'consumer@example.com',
      name: 'John Consumer',
      firstName: 'John',
      lastName: 'Consumer',
      password: hashedPassword,
      role: 'CONSUMER',
      phone: '+919876543210',
    },
  })
  console.log("✅ Created consumer:", consumer.email)

  // Create a vendor user
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      name: 'Rahul Kumar',
      firstName: 'Rahul',
      lastName: 'Kumar',
      password: hashedPassword,
      role: 'VENDOR',
      phone: '+919876543211',
    },
  })
  console.log("✅ Created vendor user:", vendorUser.email)

  // Create vendor profile
  const vendor = await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: 'Maa Ki Rasoi',
      description: 'Authentic North Indian home-style meals prepared with love and traditional spices from Himachal Pradesh.',
      address: 'Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
      phone: '9876543212',
      cuisineType: 'North Indian',
      isPureVeg: true,
      dailyCapacity: 150,
      licenseNumber: 'LIC123456',
      rating: 4.8,
      isActive: true,
    },
  })
  console.log("✅ Created vendor:", vendor.businessName)

  // Create a subscription
  const subscription = await prisma.subscription.upsert({
    where: {
      userId_vendorId: {
        userId: consumer.id,
        vendorId: vendor.id,
      },
    },
    update: {},
    create: {
      userId: consumer.id,
      vendorId: vendor.id,
      planType: 'DAILY',
      mealsPerDay: 1,
      startDate: new Date(),
      isActive: true,
      pauseAllowed: true,
      maxPausesPerMonth: 4,
    },
  })
  console.log("✅ Created subscription for consumer")

  // Create today's meal plan
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const mealPlan = await prisma.mealPlan.upsert({
    where: {
      vendorId_menuDate: {
        vendorId: vendor.id,
        menuDate: today,
      },
    },
    update: {},
    create: {
      vendorId: vendor.id,
      menuDate: today,
      description: 'North Indian Thali',
      items: JSON.stringify({
        main: ['Dal Makhani', 'Paneer Butter Masala'],
        rice: ['Jeera Rice', 'Plain Rice'],
        breads: ['Butter Naan', 'Tawa Roti'],
        sides: ['Mixed Veg', 'Salad', 'Pickle', 'Chaas'],
      }),
      isPublished: true,
    },
  })
  console.log("✅ Created meal plan for today")

  // Create sample invoices
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: `INV-${Date.now()}`,
      userId: consumer.id,
      vendorId: vendor.id,
      subscriptionId: subscription.id,
      periodStart: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
      periodEnd: new Date(),
      totalMeals: 30,
      mealsPaused: 2,
      ratePerMeal: 120,
      totalAmount: 3600,
      discount: 0,
      finalAmount: 3600,
      status: 'PENDING',
      dueDate: new Date(),
    },
  })
  console.log("✅ Created sample invoice:", invoice.invoiceNumber)

  console.log("🎉 Database seed completed successfully!")
  console.log("\n📋 Test Credentials:")
  console.log("   Consumer: consumer@example.com / password123")
  console.log("   Vendor: vendor@example.com / password123")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
