"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Lock, User, ChefHat } from "lucide-react"
import { GoogleOAuthButton } from "@/components/google-oauth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const defaultRole = searchParams.get("role") || "consumer";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"consumer" | "vendor">(
    defaultRole === "vendor" ? "vendor" : "consumer",
  );
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.ok) {
        // Redirect based on role
        if (role === "vendor") {
          router.push("/vendor/overview");
        } else {
          router.push(callbackUrl);
        }
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(provider, {
        callbackUrl: role === "vendor" ? "/vendor/overview" : callbackUrl,
      });
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || "OAuth sign in failed. Make sure Google OAuth is configured in .env.local");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-brand-amber">Tiffin</span>
            <span className="text-3xl font-bold text-brand-green">Hub</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your {role === "vendor" ? "vendor" : "consumer"} account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Role Selection */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={role === "consumer" ? "default" : "outline"}
              className={`flex-1 ${role === "consumer" ? "bg-brand-amber hover:bg-brand-amber-dark" : ""}`}
              onClick={() => setRole("consumer")}
            >
              <User className="h-4 w-4 mr-2" />
              Consumer
            </Button>
            <Button
              type="button"
              variant={role === "vendor" ? "default" : "outline"}
              className={`flex-1 ${role === "vendor" ? "bg-brand-amber hover:bg-brand-amber-dark" : ""}`}
              onClick={() => setRole("vendor")}
            >
              <ChefHat className="h-4 w-4 mr-2" />
              Vendor
            </Button>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Button
                variant="link"
                className="px-0 text-sm text-brand-amber hover:text-brand-amber-dark"
              >
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-amber hover:bg-brand-amber-dark"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleOAuthButton onClick={() => handleOAuthSignIn("google")} isLoading={isLoading} />
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              Don't have an account?{" "}
              <Button variant="link" className="px-0 text-sm text-brand-amber hover:text-brand-amber-dark" asChild>
                <a href="/register">Sign up</a>
              </Button>
            </p>
          </div>

          {/* Quick Registration Links */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="/register?role=consumer">
                <User className="h-3 w-3 mr-2" />
                Join as Consumer
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="/register?role=vendor">
                <ChefHat className="h-3 w-3 mr-2" />
                Register as Vendor
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
