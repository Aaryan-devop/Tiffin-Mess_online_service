import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type {
  User,
  Vendor,
  Subscription,
  PauseRequest,
  MealPlan,
  Invoice,
  Payment,
  Role,
  PlanType,
  PauseStatus,
  BroadcastStatus,
  InvoiceStatus,
  PaymentMethod,
  PaymentGateway
} from '@prisma/client'
