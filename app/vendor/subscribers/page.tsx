"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, UserPlus, Download } from "lucide-react"

// Mock data - replace with API
const mockSubscribers = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "9876543210",
    planType: "DAILY",
    mealsPerDay: 1,
    startDate: "2025-01-15",
    endDate: null,
    isActive: true,
    totalMealsConsumed: 67,
    totalPaused: 5,
    lastOrderDate: "2025-03-29",
    nextBilling: "2025-04-01",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "9876543211",
    planType: "WEEKLY",
    mealsPerDay: 1,
    startDate: "2025-02-01",
    endDate: null,
    isActive: true,
    totalMealsConsumed: 52,
    totalPaused: 3,
    lastOrderDate: "2025-03-29",
    nextBilling: "2025-04-05",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "9876543212",
    planType: "MONTHLY",
    mealsPerDay: 2,
    startDate: "2025-01-01",
    endDate: null,
    isActive: true,
    totalMealsConsumed: 140,
    totalPaused: 8,
    lastOrderDate: "2025-03-29",
    nextBilling: "2025-04-01",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "9876543213",
    planType: "DAILY",
    mealsPerDay: 1,
    startDate: "2025-03-10",
    endDate: null,
    isActive: true,
    totalMealsConsumed: 15,
    totalPaused: 1,
    lastOrderDate: "2025-03-28",
    nextBilling: "2025-04-10",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "9876543214",
    planType: "DAILY",
    mealsPerDay: 1,
    startDate: "2024-12-01",
    endDate: "2025-03-15",
    isActive: false,
    totalMealsConsumed: 95,
    totalPaused: 12,
    lastOrderDate: "2025-03-15",
    nextBilling: null,
  },
]

export default function VendorSubscribersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredSubscribers = mockSubscribers.filter(sub => {
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!sub.name.toLowerCase().includes(query) &&
          !sub.email.toLowerCase().includes(query) &&
          !sub.phone.includes(query)) {
        return false
      }
    }

    // Plan filter
    if (planFilter !== "all" && sub.planType !== planFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && sub.isActive !== (statusFilter === "active")) {
      return false
    }

    return true
  })

  const getPlanBadge = (planType: string) => {
    const colors = {
      DAILY: "bg-blue-100 text-blue-800",
      WEEKLY: "bg-purple-100 text-purple-800",
      MONTHLY: "bg-green-100 text-green-800"
    }
    return colors[planType as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-slate">Subscribers</h1>
          <p className="text-gray-600">Manage your customers and subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2 bg-brand-amber hover:bg-brand-amber-dark">
            <UserPlus className="h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {(searchQuery || planFilter !== "all" || statusFilter !== "all") && (
              <Button variant="ghost" onClick={() => {
                setSearchQuery("")
                setPlanFilter("all")
                setStatusFilter("all")
              }}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscribers ({filteredSubscribers.length})</CardTitle>
          <CardDescription>
            Showing {filteredSubscribers.filter(s => s.isActive).length} active subscribers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Meals/Day</TableHead>
                <TableHead>Total Meals</TableHead>
                <TableHead>Paused</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-brand-slate">{subscriber.name}</p>
                      <p className="text-xs text-gray-500">{subscriber.email}</p>
                      <p className="text-xs text-gray-400">{subscriber.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanBadge(subscriber.planType)}>
                      {subscriber.planType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{subscriber.mealsPerDay}</TableCell>
                  <TableCell>{subscriber.totalMealsConsumed}</TableCell>
                  <TableCell>{subscriber.totalPaused}</TableCell>
                  <TableCell>{subscriber.nextBilling || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                      {subscriber.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2">
                          <Mail className="h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Phone className="h-4 w-4" />
                          Call Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Calendar className="h-4 w-4" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Remove Subscriber
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No subscribers found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-slate">
              {mockSubscribers.filter(s => s.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Daily Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockSubscribers.filter(s => s.isActive && s.planType === "DAILY").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Weekly Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockSubscribers.filter(s => s.isActive && s.planType === "WEEKLY").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockSubscribers.filter(s => s.isActive && s.planType === "MONTHLY").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
