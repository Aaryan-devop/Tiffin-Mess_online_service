import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  }
}, {
  // Optional: Custom logic for redirecting based on role
  // Note: NextAuth middleware handles authentication
  // We'll add role-based checks in individual layouts
})

export const config = {
  matcher: [
    // Protect all vendor routes
    "/vendor/:path*",
    // Protect consumer dashboard routes
    "/dashboard/:path*",
    "/billing/:path*",
    "/profile/:path*",
    // Exclude public pages
    "/",
    "/discover",
    "/login",
    "/api/auth/:path*",
    "/_next/:path*",
    "/_vercel/:path*",
  ]
}
