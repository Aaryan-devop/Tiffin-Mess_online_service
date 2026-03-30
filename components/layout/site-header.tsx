"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ChefHat, User, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Discover", href: "/discover" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-brand-amber" />
            <span className="text-xl font-bold text-brand-slate">
              Tiffin<span className="text-brand-amber">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-brand-amber transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {status === "loading" ? (
                <div className="h-10 w-20 bg-gray-100 rounded-md animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center gap-3">
                  {session.user?.role === "VENDOR" ? (
                    <Button asChild variant="outline" className="gap-2">
                      <Link href="/vendor/overview">
                        <User className="h-4 w-4" />
                        Vendor Portal
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="gap-2">
                      <Link href="/dashboard">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="bg-brand-amber hover:bg-brand-amber-dark">
                    <Link href="/login?role=vendor">Start Selling</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-brand-amber transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Separator />
              {!session ? (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-brand-amber hover:bg-brand-amber-dark">
                    <Link href="/login?role=vendor" onClick={() => setMobileMenuOpen(false)}>
                      Start Selling
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={session.user?.role === "VENDOR" ? "/vendor/overview" : "/dashboard"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {session.user?.role === "VENDOR" ? "Vendor Portal" : "Dashboard"}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-red-600"
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Need to import Separator at top level
import { Separator } from "@/components/ui/separator"
