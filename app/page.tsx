"use client"

import Link from "next/link"
import { Search, MapPin, Star, ChefHat, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const featuredVendors = [
    {
      id: "1",
      name: "Maa Ki Rasoi",
      cuisine: "North Indian",
      rating: 4.8,
      reviews: 234,
      isPureVeg: true,
      price: "₹120/meal",
      deliveryAreas: ["Andheri", "Bandra", "Dadar"],
    },
    {
      id: "2",
      name: "South Spice Kitchen",
      cuisine: "South Indian",
      rating: 4.6,
      reviews: 189,
      isPureVeg: false,
      price: "₹110/meal",
      deliveryAreas: ["Powai", "Vikhroli", "Ghatkopar"],
    },
    {
      id: "3",
      name: "Healthy Bites",
      cuisine: "Multi-Cuisine",
      rating: 4.9,
      reviews: 312,
      isPureVeg: true,
      price: "₹150/meal",
      deliveryAreas: ["Worli", "Lower Parel", "Dadar"],
    },
  ]

  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-brand-amber" />,
      title: "Home-style Meals",
      description: "Authentic, hygienically prepared meals from local home chefs and mess halls",
    },
    {
      icon: <Clock className="h-8 w-8 text-brand-amber" />,
      title: "Flexible Subscriptions",
      description: "Daily, weekly, or monthly plans with the freedom to pause anytime",
    },
    {
      icon: <Users className="h-8 w-8 text-brand-amber" />,
      title: "Vendor-Managed",
      description: "No more monthly payments. Pay only for the meals you receive",
    },
    {
      icon: <MapPin className="h-8 w-8 text-brand-amber" />,
      title: "Local & Fresh",
      description: "Fresh meals prepared daily by verified vendors in your neighborhood",
    },
  ]

  return (
    <div className="min-h-screen bg-brand-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-slate mb-6 leading-tight">
              Delicious Home-Style
              <span className="text-brand-amber"> Tiffin </span>
              Delivered Daily
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Connect with local tiffin services and mess halls. Subscribe to daily meals, pause when you need, and pay only for what you eat.
            </p>

            {/* Location Search */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-xl shadow-lg border">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <MapPin className="h-5 w-5 text-brand-amber" />
                  <Input
                    type="text"
                    placeholder="Enter your location (e.g., Andheri, Mumbai)"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  />
                </div>
                <Button size="lg" className="bg-brand-amber hover:bg-brand-amber-dark text-white px-8 py-6 text-lg font-semibold" asChild>
                  <Link href="/discover">
                    Find Tiffin Services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-slate mb-4">Why Choose TiffinHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're bridging the gap between local tiffin providers and urban professionals who crave home-cooked meals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-brand-slate mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-20 bg-brand-off-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-slate mb-4">Top-Rated Tiffin Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover highly-rated local vendors serving nutritious, delicious meals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredVendors.map((vendor) => (
              <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-brand-slate">{vendor.name}</CardTitle>
                      <CardDescription>{vendor.cuisine}</CardDescription>
                    </div>
                    {vendor.isPureVeg && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Pure Veg
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-brand-amber text-brand-amber mr-1" />
                      <span className="font-semibold">{vendor.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">({vendor.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {vendor.deliveryAreas.map((area) => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-lg font-bold text-brand-amber">{vendor.price}</div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/discover?vendor=${vendor.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-brand-amber text-brand-amber hover:bg-brand-amber hover:text-white">
              <Link href="/discover">
                View All Vendors
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-brand-slate mb-4">
              Are You a Tiffin Vendor?
            </h2>
            <p className="text-gray-600 mb-10 text-lg">
              Join thousands of vendors who have digitized their operations, reduced food waste, and increased their revenue with TiffinHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-amber hover:bg-brand-amber-dark text-white px-8">
                <Link href="/login?role=vendor">
                  Start Selling
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-brand-amber text-brand-amber hover:bg-brand-amber hover:text-white">
                <Link href="/discover">
                  Browse as Customer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
