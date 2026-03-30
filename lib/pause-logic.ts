import { prisma } from "@/lib/prisma"
import { DateTime } from "luxon"

/**
 * Calculate the total number of meals a vendor needs to cook today
 * Formula: (Active Subscribers * Meals per day) - (Approved Pauses for today)
 *
 * This function handles:
 * 1. Only considers ACTIVE subscriptions
 * 2. Only counts APPROVED pause requests for TODAY
 * 3. Respects the subscription's mealsPerDay value
 * 4. Excludes subscriptions that have expired (endDate in past)
 */
export async function calculateMealsToCookToday(vendorId: string): Promise<{
  totalSubscribers: number
  totalMealsSubscribed: number
  totalPausedMeals: number
  mealsToCook: number
  dailyCapacity: number
  isOverCapacity: boolean
}> {
  const today = DateTime.now().startOf('day').toJSDate()

  // Get all active subscriptions for this vendor
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      vendorId,
      isActive: true,
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gt: today } }
          ]
        }
      ]
    },
    include: {
      user: true,
      pausedMeals: {
        where: {
          pauseDate: today,
          status: 'APPROVED'
        }
      }
    }
  })

  let totalMealsSubscribed = 0
  let totalPausedMeals = 0

  for (const sub of activeSubscriptions) {
    totalMealsSubscribed += sub.mealsPerDay
    totalPausedMeals += sub.pausedMeals.length * sub.mealsPerDay
  }

  const mealsToCook = totalMealsSubscribed - totalPausedMeals

  // Get vendor's daily capacity
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId }
  })

  return {
    totalSubscribers: activeSubscriptions.length,
    totalMealsSubscribed,
    totalPausedMeals,
    mealsToCook,
    dailyCapacity: vendor?.dailyCapacity ?? 100,
    isOverCapacity: mealsToCook > (vendor?.dailyCapacity ?? 100)
  }
}

/**
 * Get detailed breakdown of who paused today
 */
export async function getTodaysPausedSubscribers(vendorId: string) {
  const today = DateTime.now().startOf('day').toJSDate()

  const pausedDetails = await prisma.pauseRequest.findMany({
    where: {
      subscription: {
        vendorId,
        isActive: true
      },
      pauseDate: today,
      status: 'APPROVED'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      subscription: {
        select: {
          id: true,
          planType: true,
          mealsPerDay: true
        }
      }
    }
  })

  return pausedDetails.map(p => ({
    userId: p.user.id,
    userName: p.user.name,
    userEmail: p.user.email,
    userPhone: p.user.phone,
    subscriptionId: p.subscription.id,
    mealsPerDay: p.subscription.mealsPerDay,
    pausedDate: p.pauseDate,
    reason: p.reason,
    createdAt: p.createdAt
  }))
}

/**
 * Check if a user has already paused for a specific date
 */
export async function hasUserPausedForDate(
  userId: string,
  subscriptionId: string,
  date: Date
): Promise<boolean> {
  const pauseCount = await prisma.pauseRequest.count({
    where: {
      userId,
      subscriptionId,
      pauseDate: date,
      status: 'APPROVED'
    }
  })

  return pauseCount > 0
}

/**
 * Get monthly pause stats for a user
 */
export async function getUserMonthlyPauseCount(
  userId: string,
  subscriptionId: string,
  month: Date
): Promise<number> {
  const startOfMonth = DateTime.fromJSDate(month).startOf('month').toJSDate()
  const endOfMonth = DateTime.fromJSDate(month).endOf('month').toJSDate()

  const pauseCount = await prisma.pauseRequest.count({
    where: {
      userId,
      subscriptionId,
      status: 'APPROVED',
      pauseDate: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    }
  })

  return pauseCount
}
