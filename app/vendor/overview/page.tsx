"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Users,
  ChefHat,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  MessageCircle,
  Bell,
  RefreshCw
} from "lucide-react"

interface VendorStats {
  totalSubscribers: number
  totalMealsSubscribed: number
  totalPausedMeals: number
  mealsToCook: number
  dailyCapacity: number
  isOverCapacity: boolean
  utilizationRate: number
  pauseRate: number
  pausedSubscribers: Array<{
    userId: string
    userName: string
    userEmail: string
    userPhone?: string
    subscriptionId: string
    mealsPerDay: number
    reason?: string
  }>
  vendor: {
    businessName: string
    cuisineType: string
  }
}

export default function VendorOverviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/vendor/stats")
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/login?role=vendor")
          return
        }
        throw new Error("Failed to fetch stats")
      }
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch vendor stats:", error)
    } finally {
      setIsLoading(false)
      setLastUpdated(new Date())
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?role=vendor")
    } else if (status === "authenticated" && session?.user?.role !== "VENDOR") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user) {
      fetchStats()
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchStats, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-amber"></div>
      </div>
    )
  }

  if (!session || !stats) {
    return null
  }

  const {
    totalSubscribers,
    totalMealsSubscribed,
    totalPausedMeals,
    mealsToCook,
    dailyCapacity,
    isOverCapacity,
    utilizationRate,
    pauseRate,
    pausedSubscribers,
    vendor
  } = stats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-slate">Vendor Overview</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <Button variant="ghost" size="sm" onClick={fetchStats} className="h-8 gap-1">
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats Card - The Answer to the Core Question */}
      <Card className="border-2 border-brand-amber">
        <CardHeader className="bg-gradient-to-br from-orange-50 to-white">
          <CardTitle className="text-lg font-medium text-gray-600">
            Meals to Cook Today
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center">
            <div className={cn(
              "meal-count-large",
              isOverCapacity ? "text-red-600" : "text-brand-slate"
            )}>
              {mealsToCook}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm py-1 px-3">
                <Users className="h-3 w-3 mr-1" />
                {totalSubscribers} subscribers
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                <ChefHat className="h-3 w-3 mr-1" />
                {totalMealsSubscribed} subscribed
              </Badge>
              {totalPausedMeals > 0 && (
                <Badge variant="outline" className="text-sm py-1 px-3 bg-amber-50 text-amber-700 border-amber-200">
                  -{totalPausedMeals} paused
                </Badge>
              )}
            </div>
            {isOverCapacity && (
              <div className="flex items-center gap-2 mt-4 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Over Capacity! ({dailyCapacity} max)</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Capacity: <span className="font-semibold">{dailyCapacity}</span> meals/day |{" "}
            Utilization: <span className="font-semibold">{utilizationRate}%</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Pauses today: </span>
            <span className="font-semibold text-brand-amber">{pauseRate}%</span>
          </div>
        </CardFooter>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-slate">{totalSubscribers}</div>
            <p className="text-xs text-gray-500 mt-1">Currently subscribed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Meals Subscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-slate">{totalMealsSubscribed}</div>
            <p className="text-xs text-gray-500 mt-1">For today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Paused Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-amber">{totalPausedMeals}</div>
            <p className="text-xs text-gray-500 mt-1">{pauseRate}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Potential Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-slate">₹{mealsToCook * 120}</div>
            <p className="text-xs text-gray-500 mt-1">At ₹120/meal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paused Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Paused Meals</CardTitle>
            <CardDescription>
              Subscribers who have paused today ({pausedSubscribers.length} meals)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pausedSubscribers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No paused meals today!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pausedSubscribers.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <div>
                      <p className="font-medium text-brand-slate">{sub.userName}</p>
                      <p className="text-xs text-gray-500">{sub.userEmail}</p>
                      {sub.reason && (
                        <p className="text-xs text-amber-700 mt-1">Reason: {sub.reason}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="bg-white">
                      -{sub.mealsPerDay} meal{sub.mealsPerDay > 1 ? "s" : ""}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common vendor tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start gap-2" variant="outline">
              <a href="/vendor/menu">
                <Calendar className="h-4 w-4" />
                Update Today's Menu
              </a>
            </Button>
            <Button asChild className="w-full justify-start gap-2" variant="outline">
              <a href="/vendor/broadcast">
                <MessageCircle className="h-4 w-4" />
                Send WhatsApp Broadcast
              </a>
            </Button>
            <Button asChild className="w-full justify-start gap-2" variant="outline">
              <a href="/vendor/subscribers">
                <Users className="h-4 w-4" />
                Manage Subscribers
              </a>
            </Button>
            <Button className="w-full justify-start gap-2 bg-brand-amber hover:bg-brand-amber-dark">
              <Bell className="h-4 w-4" />
              Send Bulk Notification
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your tiffin service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { status: "success", message: "Menu published for tomorrow", time: "2 hours ago" },
              { status: "info", message: "5 new subscribers joined this week", time: "1 day ago" },
              { status: "success", message: "Payment of ₹8,500 received", time: "2 days ago" },
              { status: "warning", message: "Monthly invoice generated", time: "3 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`mt-1 ${activity.status === "success" ? "text-brand-green" : activity.status === "warning" ? "text-brand-amber" : "text-blue-500"}`}>
                  {activity.status === "success" && <TrendingUp className="h-5 w-5" />}
                  {activity.status === "warning" && <AlertTriangle className="h-5 w-5" />}
                  {activity.status === "info" && <Users className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-slate">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
