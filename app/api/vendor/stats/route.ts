import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { DateTime } from "luxon"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get vendor profile
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Calculate meals to cook today using the core business logic
    const today = DateTime.now().startOf('day').toJSDate()

    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        vendorId: vendor.id,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
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

    // Get today's paused subscribers details
    const pausedDetails = await prisma.pauseRequest.findMany({
      where: {
        subscription: {
          vendorId: vendor.id,
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
            mealsPerDay: true
          }
        }
      }
    })

    const utilizationRate = vendor.dailyCapacity > 0 ? ((totalMealsSubscribed / vendor.dailyCapacity) * 100).toFixed(1) : "0"
    const pauseRate = totalMealsSubscribed > 0 ? ((totalPausedMeals / totalMealsSubscribed) * 100).toFixed(1) : "0"

    return NextResponse.json({
      totalSubscribers: activeSubscriptions.length,
      totalMealsSubscribed,
      totalPausedMeals,
      mealsToCook,
      dailyCapacity: vendor.dailyCapacity,
      isOverCapacity: mealsToCook > vendor.dailyCapacity,
      utilizationRate: parseFloat(utilizationRate),
      pauseRate: parseFloat(pauseRate),
      pausedSubscribers: pausedDetails.map(p => ({
        userId: p.user.id,
        userName: p.user.name,
        userEmail: p.user.email,
        userPhone: p.user.phone,
        subscriptionId: p.subscription.id,
        mealsPerDay: p.subscription.mealsPerDay,
        reason: p.reason,
      })),
      vendor: {
        businessName: vendor.businessName,
        cuisineType: vendor.cuisineType,
      }
    })

  } catch (error) {
    console.error("Vendor stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
