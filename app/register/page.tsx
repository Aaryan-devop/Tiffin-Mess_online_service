"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Mail, Lock, User, Building2, Phone } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "CONSUMER" as "CONSUMER" | "VENDOR",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    cuisineType: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.role === "VENDOR" && !formData.businessName) {
      setError("Business name is required for vendors")
      setIsLoading(false)
      return
    }

    try {
      // Register via API (we'll create this API endpoint)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
          ...(formData.role === "VENDOR" && {
            businessName: formData.businessName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            cuisineType: formData.cuisineType,
          })
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Auto sign in after registration
      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInRes?.ok) {
        // Redirect based on role
        if (formData.role === "VENDOR") {
          router.push("/vendor/overview")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.email || !formData.password)) {
      setError("Please fill in all required fields")
      return
    }
    if (currentStep === 2 && formData.role === "VENDOR" && !formData.businessName) {
      setError("Business name is required")
      return
    }
    setError(null)
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-brand-amber">Tiffin</span>
            <span className="text-3xl font-bold text-brand-green">Hub</span>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join thousands of tiffin services and customers
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-brand-amber text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      currentStep > step ? "bg-brand-amber" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>I want to... *</Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant={formData.role === "CONSUMER" ? "default" : "outline"}
                      className={`flex-1 ${formData.role === "CONSUMER" ? "bg-brand-amber hover:bg-brand-amber-dark" : ""}`}
                      onClick={() => setFormData(prev => ({ ...prev, role: "CONSUMER" }))}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Find Meals (Consumer)
                    </Button>
                    <Button
                      type="button"
                      variant={formData.role === "VENDOR" ? "default" : "outline"}
                      className={`flex-1 ${formData.role === "VENDOR" ? "bg-brand-amber hover:bg-brand-amber-dark" : ""}`}
                      onClick={() => setFormData(prev => ({ ...prev, role: "VENDOR" }))}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Sell Meals (Vendor)
                    </Button>
                  </div>
                </div>

                <Button type="button" onClick={nextStep} className="w-full bg-brand-amber hover:bg-brand-amber-dark">
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Vendor Info or Consumer Preferences */}
            {currentStep === 2 && formData.role === "VENDOR" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-slate">Vendor Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Maa Ki Rasoi"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisineType">Cuisine Type *</Label>
                  <Input
                    id="cuisineType"
                    name="cuisineType"
                    type="text"
                    placeholder="North Indian, South Indian, Multi-Cuisine"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Main Street, Andheri West"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="400058"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-brand-amber hover:bg-brand-amber-dark">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && formData.role === "CONSUMER" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-slate">Welcome, Food Lover!</h3>
                <p className="text-gray-600">
                  You're just one step away from discovering amazing home-style meals in your area.
                </p>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-900">
                    As a consumer, you can browse local tiffin services, subscribe to daily meals,
                    and pause anytime before 8 PM. Pay only for what you eat!
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-brand-amber hover:bg-brand-amber-dark">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Terms & Complete */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-slate">
                  {formData.role === "VENDOR" ? "Ready to Launch Your Tiffin Business?" : "Almost There!"}
                </h3>

                {formData.role === "VENDOR" ? (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      You're about to join TiffinHub as a vendor. Here's what you get:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Reach 1000+ customers in your area</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Eliminate food waste with pause notifications</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Automated billing and invoice generation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>WhatsApp broadcast to all subscribers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Real-time meal count and analytics</span>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      You're about to discover delicious home-style meals. Here's what you can do:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Browse 100+ local tiffin vendors</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Flexible daily, weekly, monthly subscriptions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Pause meals anytime before 8 PM</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Pay only for meals consumed</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Checkbox checked disabled />
                        <span>Track billing and invoices online</span>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                      required
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the <a href="#" className="text-brand-amber hover:underline">Terms of Service</a> and <a href="#" className="text-brand-amber hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formData.agreeToTerms || isLoading}
                    className="flex-1 bg-brand-amber hover:bg-brand-amber-dark"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </div>
              </div>
            )}

            {/* Step indicators */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>Step {currentStep} of 3</span>
              {currentStep > 1 && (
                <Button type="button" variant="link" className="px-0 text-xs" onClick={() => setCurrentStep(1)}>
                  Start Over
                </Button>
              )}
            </div>
          </form>

          <Separator className="my-6" />

          {/* Social Login */}
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Button variant="link" className="px-0 text-brand-amber hover:text-brand-amber-dark" asChild>
              <a href="/login">Sign in</a>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
