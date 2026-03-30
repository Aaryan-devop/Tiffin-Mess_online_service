import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { DateTime } from "luxon"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "CONSUMER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { pauseDate, reason } = body

    if (!pauseDate) {
      return NextResponse.json({ error: "Pause date is required" }, { status: 400 })
    }

    const userId = session.user.id
    const pauseDateObj = new Date(pauseDate)

    // Find active subscription for this user
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gt: pauseDateObj } }
            ]
          }
        ]
      }
    })

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Check if user has exceeded max pauses per month
    const monthStart = DateTime.fromJSDate(pauseDateObj).startOf('month').toJSDate()
    const monthEnd = DateTime.fromJSDate(pauseDateObj).endOf('month').toJSDate()

    const pauseCount = await prisma.pauseRequest.count({
      where: {
        userId,
        subscriptionId: subscription.id,
        status: 'APPROVED',
        pauseDate: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    })

    const maxPauses = subscription.maxPausesPerMonth || 4
    if (pauseCount >= maxPauses) {
      return NextResponse.json(
        { error: `You have exceeded the maximum of ${maxPauses} pauses per month` },
        { status: 400 }
      )
    }

    // Check if already paused for this date
    const existingPause = await prisma.pauseRequest.findFirst({
      where: {
        userId,
        subscriptionId: subscription.id,
        pauseDate: pauseDateObj,
      }
    })

    if (existingPause) {
      if (existingPause.status === 'APPROVED') {
        return NextResponse.json({ error: "Meal already paused for this date" }, { status: 400 })
      }
      // Update existing pause request
      await prisma.pauseRequest.update({
        where: { id: existingPause.id },
        data: {
          reason,
          status: 'APPROVED',
          updatedAt: new Date()
        }
      })
    } else {
      // Create new pause request
      await prisma.pauseRequest.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          pauseDate: pauseDateObj,
          reason,
          status: 'APPROVED', // Auto-approve for now
        }
      })
    }

    return NextResponse.json({
      message: "Meal paused successfully",
      pauseDate,
      remainingPauses: maxPauses - pauseCount - 1
    })

  } catch (error) {
    console.error("Pause meal error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { pauseDate } = body

    if (!pauseDate) {
      return NextResponse.json({ error: "Pause date is required" }, { status: 400 })
    }

    const userId = session.user.id
    const pauseDateObj = new Date(pauseDate)

    // Find the pause request
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
      }
    })

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    const pauseRequest = await prisma.pauseRequest.findFirst({
      where: {
        userId,
        subscriptionId: subscription.id,
        pauseDate: pauseDateObj,
        status: 'APPROVED'
      }
    })

    if (!pauseRequest) {
      return NextResponse.json({ error: "No paused meal found for this date" }, { status: 404 })
    }

    // Delete the pause request (or update status to REJECTED)
    await prisma.pauseRequest.update({
      where: { id: pauseRequest.id },
      data: {
        status: 'REJECTED',
      }
    })

    return NextResponse.json({
      message: "Meal resumed successfully",
      pauseDate
    })

  } catch (error) {
    console.error("Resume meal error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
