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

    if (session.user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userId = session.user.id
    const today = DateTime.now().startOf('day').toJSDate()

    // Get active subscriptions for this consumer
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
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
        vendor: {
          select: {
            id: true,
            businessName: true,
            address: true,
            city: true,
            state: true,
            phone: true,
            cuisineType: true,
          }
        },
        pausedMeals: {
          where: {
            pauseDate: today,
            status: 'APPROVED'
          }
        },
        invoices: {
          where: {
            periodStart: { lte: today },
            periodEnd: { gte: today }
          },
          select: {
            id: true,
            status: true,
            finalAmount: true,
          },
          take: 1
        }
      }
    })

    if (subscriptions.length === 0) {
      return NextResponse.json({
        hasSubscription: false,
        message: "No active subscriptions found"
      })
    }

    // For simplicity, we'll take the first active subscription
    // In a real app, you might have logic to determine which vendor delivers today
    const subscription = subscriptions[0]

    // Check if today's meal is paused
    const isPaused = subscription.pausedMeals.length > 0

    // Get today's menu from vendor
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        vendorId: subscription.vendorId,
        menuDate: today,
        isPublished: true
      }
    })

    // Calculate remaining days
    const endDate = subscription.endDate ? new Date(subscription.endDate) : null
    const remainingDays = endDate
      ? Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
      : null

    return NextResponse.json({
      hasSubscription: true,
      isPaused,
      vendor: {
        name: subscription.vendor.businessName,
        address: subscription.vendor.address,
        city: subscription.vendor.city,
        phone: subscription.vendor.phone,
        cuisineType: subscription.vendor.cuisineType,
      },
      meal: {
        menu: mealPlan?.items || "Menu not available for today",
        description: mealPlan?.description || "",
        isPublished: mealPlan?.isPublished || false,
      },
      subscription: {
        planType: subscription.planType,
        mealsPerDay: subscription.mealsPerDay,
        remainingDays,
      },
      invoiceStatus: subscription.invoices[0]?.status || 'PENDING',
    })

  } catch (error) {
    console.error("Consumer today's meal error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
