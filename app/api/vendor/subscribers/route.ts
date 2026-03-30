import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

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

    // Get all subscriptions for this vendor
    const subscriptions = await prisma.subscription.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const subscriberData = await Promise.all(
      subscriptions.map(async (sub) => {
        // Count total meals consumed (this would be tracked in a more complex system)
        // For now, we'll just calculate based on subscription start date
        const startDate = new Date(sub.startDate)
        const today = new Date()
        const daysActive = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const totalMealsPossible = daysActive * sub.mealsPerDay

        // Count actual delivered meals (in real app, would track daily delivery status)
        // For demo, we'll use a random number or calculate based on end date
        const totalMealsConsumed = Math.floor(totalMealsPossible * 0.9) // Assume 90% delivery rate

        // Count pauses (this would be from PauseRequest table)
        const pauseCount = await prisma.pauseRequest.count({
          where: {
            subscriptionId: sub.id,
            status: 'APPROVED'
          }
        })

        return {
          id: sub.id,
          name: sub.user.name || 'Unknown',
          email: sub.user.email,
          phone: sub.user.phone,
          planType: sub.planType,
          mealsPerDay: sub.mealsPerDay,
          startDate: sub.startDate,
          endDate: sub.endDate,
          isActive: sub.isActive,
          totalMealsConsumed,
          totalPaused: pauseCount,
          lastOrderDate: sub.updatedAt,
          nextBilling: sub.endDate ? null : 'Monthly', // Simplified
        }
      })
    )

    return NextResponse.json({
      subscribers: subscriberData,
      total: subscriberData.length,
      activeCount: subscriberData.filter(s => s.isActive).length,
    })

  } catch (error) {
    console.error("Vendor subscribers error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
