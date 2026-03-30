"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Pause,
  Play,
  Clock,
  ChefHat,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface TodayMealData {
  hasSubscription: boolean;
  isPaused: boolean;
  vendor: {
    name: string;
    address: string;
    city: string;
    phone: string;
    cuisineType: string;
  };
  meal: {
    menu: string;
    description: string;
    isPublished: boolean;
  };
  subscription: {
    planType: string;
    mealsPerDay: number;
    remainingDays: number | null;
  };
  invoiceStatus: string;
}

export default function ConsumerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mealData, setMealData] = useState<TodayMealData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [isPausing, setIsPausing] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch today's meal data
  const fetchMealData = async () => {
    try {
      const res = await fetch("/api/consumer/today-meal");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch meal data");
      }
      const data = await res.json();
      setMealData(data);
    } catch (error) {
      console.error("Failed to fetch meal data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMealData();
      // Refresh every 60 seconds
      const interval = setInterval(fetchMealData, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Countdown timer logic
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePauseMeal = async () => {
    setIsPausing(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/consumer/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pauseDate: today,
          reason: pauseReason,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to pause meal");
      }

      // Refresh data
      await fetchMealData();
      setShowPauseDialog(false);
      setPauseReason("");
    } catch (error) {
      alert("Failed to pause meal. Please try again.");
    } finally {
      setIsPausing(false);
    }
  };

  const handleResumeMeal = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/consumer/pause", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pauseDate: today }),
      });

      if (!res.ok) {
        throw new Error("Failed to resume meal");
      }

      await fetchMealData();
    } catch (error) {
      alert("Failed to resume meal. Please try again.");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-brand-off-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-amber"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!mealData?.hasSubscription) {
    return (
      <div className="min-h-screen bg-brand-off-white py-16">
        <div className="container mx-auto px-4 text-center">
          <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-brand-slate mb-4">
            No Active Subscription
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You don't have any active meal subscription yet. Browse local tiffin
            vendors and start your subscription!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-brand-amber hover:bg-brand-amber-dark"
          >
            <a href="/discover">Find Tiffin Services</a>
          </Button>
        </div>
      </div>
    );
  }

  const { vendor, meal, subscription } = mealData;

  return (
    <div className="min-h-screen bg-brand-off-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-slate mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {session.user?.name || "User"}! Here's your meal for
            today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Today's Meal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-brand-amber/20">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-brand-slate">
                      Today's Meal
                    </CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={mealData.isPaused ? "destructive" : "default"}
                    className={mealData.isPaused ? "" : "bg-brand-green"}
                  >
                    {mealData.isPaused ? "Paused" : "Scheduled"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        FROM YOUR VENDOR
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <ChefHat className="h-5 w-5 text-brand-amber" />
                        <span className="text-xl font-bold text-brand-slate">
                          {vendor.name}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {vendor.cuisineType} • {vendor.address}, {vendor.city}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        📞 {vendor.phone}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        TODAY'S MENU
                      </h3>
                      <p className="text-brand-slate font-medium">
                        {meal.menu}
                      </p>
                      {meal.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {meal.description}
                        </p>
                      )}
                      {!meal.isPublished && (
                        <p className="text-sm text-amber-600 mt-2">
                          ⚠️ Menu not yet published by vendor
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        DELIVERY TIME
                      </h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-amber" />
                        <span className="text-brand-slate">
                          12:00 PM - 1:30 PM
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        SUBSCRIPTION DETAILS
                      </h3>
                      <p className="text-gray-700">
                        {subscription.planType} plan •{" "}
                        {subscription.mealsPerDay} meal/day
                        <br />
                        {subscription.remainingDays !== null && (
                          <span className="text-sm text-gray-500">
                            {subscription.remainingDays} days remaining
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-green-50 rounded-lg border">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Pause deadline in
                      </p>
                      <div className="countdown-timer text-3xl font-bold text-brand-amber font-mono">
                        {countdown}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        (Must pause before midnight for tomorrow)
                      </p>
                    </div>

                    {!mealData.isPaused ? (
                      <Dialog
                        open={showPauseDialog}
                        onOpenChange={setShowPauseDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="lg"
                            variant="destructive"
                            className="w-full gap-2 pause-button"
                          >
                            <Pause className="h-5 w-5" />
                            Pause Today's Meal
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Pause Today's Meal</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to skip today's meal? You
                              can use this feature up to 4 times per month.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <label className="text-sm font-medium mb-2 block">
                              Reason (optional)
                            </label>
                            <Textarea
                              placeholder="e.g., Out of town, Not hungry, etc."
                              value={pauseReason}
                              onChange={(e) => setPauseReason(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setShowPauseDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handlePauseMeal}
                              disabled={isPausing}
                            >
                              {isPausing ? "Pausing..." : "Confirm Pause"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        size="lg"
                        variant="default"
                        className="w-full gap-2 bg-brand-green hover:bg-green-600"
                        onClick={handleResumeMeal}
                      >
                        <Play className="h-5 w-5" />
                        Resume Meal
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <p className="text-sm text-gray-500">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  Note: Pause requests must be made before midnight for the next
                  day. Your vendor will be notified automatically.
                </p>
              </CardFooter>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      status: "success",
                      message: "Meal delivered from " + vendor.name,
                      time: "Today, 12:30 PM",
                    },
                    {
                      status: "success",
                      message: "Payment of ₹1,200 received",
                      time: "Yesterday, 10:00 AM",
                    },
                    {
                      status: "info",
                      message: "Subscription renewed for next month",
                      time: "2 days ago",
                    },
                    {
                      status: mealData.isPaused ? "warning" : "success",
                      message: mealData.isPaused
                        ? "Meal paused - Taking a break"
                        : "All meals delivered as scheduled",
                      time: "Last week",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${activity.status === "success" ? "text-brand-green" : activity.status === "warning" ? "text-brand-amber" : "text-blue-500"}`}
                      >
                        {activity.status === "success" && (
                          <CheckCircle className="h-5 w-5" />
                        )}
                        {activity.status === "warning" && (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                        {activity.status === "info" && (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-slate">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-semibold text-brand-slate">
                    {subscription.planType}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meals/Day</span>
                  <span className="font-bold text-brand-slate">
                    {subscription.mealsPerDay}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <Badge
                    variant={mealData.isPaused ? "destructive" : "default"}
                    className={mealData.isPaused ? "" : "bg-brand-green"}
                  >
                    {mealData.isPaused ? "Paused" : "Active"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Invoice Status</span>
                  <span
                    className={`text-sm ${mealData.invoiceStatus === "PAID" ? "text-brand-green" : "text-brand-amber"}`}
                  >
                    {mealData.invoiceStatus}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href="/billing">View Billing Details</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Vendor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Vendor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <ChefHat className="h-6 w-6 text-brand-amber" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-slate">
                        {vendor.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vendor.cuisineType}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {vendor.phone}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span>{" "}
                      {vendor.address}, {vendor.city}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Contact Vendor
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <a href="/billing">📊 View Billing</a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <a href="/discover">🔍 Find More Vendors</a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <a href="/profile">👤 Edit Profile</a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <a href="/api/auth/signout">🚪 Sign Out</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
