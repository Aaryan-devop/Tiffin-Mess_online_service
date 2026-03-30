"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  Calendar,
  MessageCircle,
  ChefHat,
  LogOut,
  LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const vendorRoutes = [
  {
    label: "Overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/vendor/overview",
    active: (pathname: string) => pathname === "/vendor/overview",
  },
  {
    label: "Subscribers",
    icon: <Users className="h-5 w-5" />,
    href: "/vendor/subscribers",
    active: (pathname: string) => pathname.startsWith("/vendor/subscribers"),
  },
  {
    label: "Menu",
    icon: <Calendar className="h-5 w-5" />,
    href: "/vendor/menu",
    active: (pathname: string) => pathname.startsWith("/vendor/menu"),
  },
  {
    label: "Broadcast",
    icon: <MessageCircle className="h-5 w-5" />,
    href: "/vendor/broadcast",
    active: (pathname: string) => pathname.startsWith("/vendor/broadcast"),
  },
]

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?role=vendor")
    } else if (status === "authenticated" && session?.user?.role !== "VENDOR") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-off-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-amber"></div>
      </div>
    )
  }

  if (status === "unauthenticated" || session?.user?.role !== "VENDOR") {
    return null
  }

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-brand-off-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <Link href="/vendor/overview" className="flex items-center gap-2 mb-8">
            <ChefHat className="h-8 w-8 text-brand-amber" />
            <span className="text-xl font-bold text-brand-slate">Vendor Portal</span>
          </Link>

          <nav className="space-y-1">
            {vendorRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  route.active(pathname)
                    ? "bg-orange-50 text-brand-amber"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-brand-amber font-semibold">
                {session.user?.name?.charAt(0) || "V"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-slate truncate">
                {session.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-brand-amber" />
            <span className="font-bold text-brand-slate">Vendor Portal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex border-t overflow-x-auto">
          {vendorRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2",
                route.active(pathname)
                  ? "border-brand-amber text-brand-amber"
                  : "border-transparent text-gray-600"
              )}
            >
              {route.icon}
              <span className="whitespace-nowrap">{route.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-28 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
