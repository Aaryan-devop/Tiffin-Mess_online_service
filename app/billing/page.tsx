"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Download, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, CreditCard } from "lucide-react"

// Mock data - replace with API calls
const mockInvoices = [
  {
    id: "INV-2025-001",
    period: "Mar 1-15, 2025",
    mealsTotal: 15,
    mealsPaused: 2,
    ratePerMeal: 120,
    totalAmount: 1800,
    discount: 100,
    finalAmount: 1700,
    status: "PAID",
    dueDate: "Mar 16, 2025",
    paidAt: "Mar 15, 2025",
  },
  {
    id: "INV-2025-002",
    period: "Mar 16-31, 2025",
    mealsTotal: 16,
    mealsPaused: 1,
    ratePerMeal: 120,
    totalAmount: 1920,
    discount: 0,
    finalAmount: 1920,
    status: "PENDING",
    dueDate: "Apr 1, 2025",
    paidAt: null,
  },
]

const mockMonthlyStats = [
  { month: "January", meals: 30, paused: 2, amount: 3600 },
  { month: "February", meals: 28, paused: 4, amount: 3200 },
  { month: "March", meals: 31, paused: 3, amount: 3700 },
]

export default function BillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("invoices")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-off-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-amber"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const totalDue = mockInvoices
    .filter(inv => inv.status === "PENDING")
    .reduce((sum, inv) => sum + inv.finalAmount, 0)

  const totalPaid = mockInvoices
    .filter(inv => inv.status === "PAID")
    .reduce((sum, inv) => sum + inv.finalAmount, 0)

  const totalMeals = mockInvoices.reduce((sum, inv) => sum + inv.mealsTotal, 0)
  const totalPaused = mockInvoices.reduce((sum, inv) => sum + inv.mealsPaused, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-brand-green"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>
      case "PENDING":
        return <Badge variant="destructive"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "OVERDUE":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" /> Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-brand-off-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-brand-slate mb-2">Billing & Invoices</h1>
            <p className="text-gray-600">Track your meals, payments, and invoices</p>
          </div>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Download All Invoices
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Total Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-slate">{totalMeals}</div>
              <p className="text-xs text-gray-500 mt-1">
                {totalPaused} paused
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Amount Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-green">₹{totalPaid.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Across {mockInvoices.filter(i => i.status === "PAID").length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Amount Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-amber">₹{totalDue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                Due by Apr 1, 2025
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Avg Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-slate">₹120</div>
              <p className="text-xs text-gray-500 mt-1">
                Per meal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>All your billing invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Meals</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.period}</TableCell>
                        <TableCell>
                          {invoice.mealsTotal} <span className="text-gray-400">({invoice.mealsPaused} paused)</span>
                        </TableCell>
                        <TableCell className="font-semibold">₹{invoice.finalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>Your meal consumption and billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockMonthlyStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-brand-slate">{stat.month} 2025</p>
                        <p className="text-sm text-gray-600">
                          {stat.meals} meals • {stat.paused} paused
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-amber">₹{stat.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total billed</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Cost Saving Tip</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Each pause saves you approximately ₹120. You've saved ₹480 this year by pausing meals when away.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage how you pay for your meals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-slate">Razorpay</p>
                      <p className="text-sm text-gray-500">Auto-debit on 1st of every month</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-green-100 rounded flex items-center justify-center">
                      <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-2.76-2.24-5-5-5zm3 5c0-1.66 1.34-3 3-3s3 1.34 3 3v4H3V7c0-2.76 2.24-5 5-5s5 2.24 5 5v4h-3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-slate">UPI</p>
                      <p className="text-sm text-gray-500">user@upi</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>

                <Button className="w-full" variant="outline" gap-2>
                  <CreditCard className="h-4 w-4" />
                  Add New Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
