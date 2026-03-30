import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  }
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
