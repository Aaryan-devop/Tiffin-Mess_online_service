"use client";
import Link from "next/link";
import { useState } from "react";
import { Search, MapPin, Star, Filter, ChefHat } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data - in real app this would come from API
const mockVendors = [
  {
    id: "1",
    name: "Maa Ki Rasoi",
    description:
      "Authentic North Indian home-style meals prepared with love and traditional spices.",
    cuisine: "North Indian",
    rating: 4.8,
    reviews: 234,
    isPureVeg: true,
    pricePerMeal: 120,
    dailyCapacity: 150,
    deliveryAreas: ["Andheri", "Bandra", "Dadar", "Worli"],
    city: "Mumbai",
    address: "Andheri West, Mumbai - 400058",
    phone: "9876543210",
    image: "/placeholder-vendor.jpg",
    todayMenu: "Dal Makhani, Jeera Rice, Mixed Veg, Butter Naan, Salad",
  },
  {
    id: "2",
    name: "South Spice Kitchen",
    description:
      "Authentic South Indian meals with the perfect balance of spices and flavors.",
    cuisine: "South Indian",
    rating: 4.6,
    reviews: 189,
    isPureVeg: false,
    pricePerMeal: 110,
    dailyCapacity: 200,
    deliveryAreas: ["Powai", "Vikhroli", "Ghatkopar", "Mulund"],
    city: "Mumbai",
    address: "Powai, Mumbai - 400076",
    phone: "9876543211",
    image: "/placeholder-vendor.jpg",
    todayMenu: " Sambar Rice, Rasam, Curd Rice, Poriyal, Papad",
  },
  {
    id: "3",
    name: "Healthy Bites",
    description:
      "Nutritious, low-oil meals perfect for health-conscious professionals.",
    cuisine: "Multi-Cuisine",
    rating: 4.9,
    reviews: 312,
    isPureVeg: true,
    pricePerMeal: 150,
    dailyCapacity: 100,
    deliveryAreas: ["Worli", "Lower Parel", "Dadar", "Parel"],
    city: "Mumbai",
    address: "Lower Parel, Mumbai - 400013",
    phone: "9876543212",
    image: "/placeholder-vendor.jpg",
    todayMenu: "Grilled Chicken, Quinoa Bowl, Steamed Vegetables, Greek Salad",
  },
  {
    id: "4",
    name: "Ghar Ka Khana",
    description: "Simple, affordable, and hygienic meals like home.",
    cuisine: "North Indian",
    rating: 4.5,
    reviews: 156,
    isPureVeg: false,
    pricePerMeal: 90,
    dailyCapacity: 250,
    deliveryAreas: ["Malad", "Borivali", "Kandivali", "Dahisar"],
    city: "Mumbai",
    address: "Malad West, Mumbai - 400064",
    phone: "9876543213",
    image: "/placeholder-vendor.jpg",
    todayMenu: "Rajma Chawal, Tawa Roti, Onion Salad, Pickle",
  },
  {
    id: "5",
    name: "Green Leaf Mess",
    description:
      "100% vegetarian meals with organic ingredients sourced from local farms.",
    cuisine: "Gujarati",
    rating: 4.7,
    reviews: 201,
    isPureVeg: true,
    pricePerMeal: 125,
    dailyCapacity: 120,
    deliveryAreas: ["Surat", "Varachha", "Udhna"],
    city: "Surat",
    address: "Varachha, Surat - 395006",
    phone: "9876543214",
    image: "/placeholder-vendor.jpg",
    todayMenu: "Thali System: 4 Rotis, 2 Sabjis, Dal, Rice, Chaas, Salad",
  },
  {
    id: "6",
    name: "Spice Route",
    description: "Exotic flavors from across India with weekly rotating menus.",
    cuisine: "Multi-Cuisine",
    rating: 4.4,
    reviews: 98,
    isPureVeg: false,
    pricePerMeal: 140,
    dailyCapacity: 80,
    deliveryAreas: ["Bandra", "Khar", "Santacruz", "Vile Parle"],
    city: "Mumbai",
    address: "Bandra West, Mumbai - 400050",
    phone: "9876543215",
    image: "/placeholder-vendor.jpg",
    todayMenu: "Hyderabadi Biryani, Raita, Mirchi Ka Salan, Boiled Eggs",
  },
];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [showPureVegOnly, setShowPureVegOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<string>("all");

  const cities = Array.from(new Set(mockVendors.map((v) => v.city)));

  const filteredVendors = mockVendors.filter((vendor) => {
    // Search query filter
    if (
      searchQuery &&
      !vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !vendor.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !vendor.deliveryAreas.some((area) =>
        area.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    ) {
      return false;
    }

    // City filter
    if (selectedCity !== "all" && vendor.city !== selectedCity) {
      return false;
    }

    // Pure veg filter
    if (showPureVegOnly && !vendor.isPureVeg) {
      return false;
    }

    // Price range filter
    if (priceRange !== "all") {
      const price = vendor.pricePerMeal;
      switch (priceRange) {
        case "under100":
          if (price >= 100) return false;
          break;
        case "100-150":
          if (price < 100 || price > 150) return false;
          break;
        case "over150":
          if (price <= 150) return false;
          break;
      }
    }

    return true;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("all");
    setShowPureVegOnly(false);
    setPriceRange("all");
  };

  return (
    <div className="min-h-screen bg-brand-off-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-slate mb-2">
            Discover Tiffin Services
          </h1>
          <p className="text-gray-600">
            Find local home chefs and mess halls near you
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by vendor name, cuisine, or delivery area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under100">Under ₹100</SelectItem>
                  <SelectItem value="100-150">₹100 - ₹150</SelectItem>
                  <SelectItem value="over150">Over ₹150</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>More Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pure-veg"
                        checked={showPureVegOnly}
                        onCheckedChange={(checked) =>
                          setShowPureVegOnly(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="pure-veg"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Pure Vegetarian Only
                      </label>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active filters */}
          {(searchQuery ||
            selectedCity !== "all" ||
            showPureVegOnly ||
            priceRange !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                </Badge>
              )}
              {selectedCity !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  City: {selectedCity}
                </Badge>
              )}
              {showPureVegOnly && (
                <Badge
                  variant="secondary"
                  className="gap-1 bg-green-100 text-green-800"
                >
                  Pure Veg
                </Badge>
              )}
              {priceRange !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Price:{" "}
                  {priceRange === "under100"
                    ? "< ₹100"
                    : priceRange === "100-150"
                      ? "₹100-150"
                      : "> ₹150"}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredVendors.length}</span>{" "}
            vendors
          </p>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-brand-slate">
                      {vendor.name}
                    </CardTitle>
                    <CardDescription>
                      {vendor.cuisine} • {vendor.city}
                    </CardDescription>
                  </div>
                  {vendor.isPureVeg && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Pure Veg
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {vendor.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 fill-brand-amber text-brand-amber" />
                  <span className="font-semibold">{vendor.rating}</span>
                  <span className="text-gray-500 text-sm">
                    ({vendor.reviews} reviews)
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Today's Menu:{" "}
                  </span>
                  <span className="text-sm text-gray-600">
                    {vendor.todayMenu}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {vendor.deliveryAreas.slice(0, 3).map((area) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {vendor.deliveryAreas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{vendor.deliveryAreas.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-brand-amber">
                    ₹{vendor.pricePerMeal}
                    <span className="text-sm font-normal text-gray-500">
                      /meal
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Capacity: {vendor.dailyCapacity}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full">
                  <Link href={`/dashboard?vendor=${vendor.id}`}>
                    Subscribe Now
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
