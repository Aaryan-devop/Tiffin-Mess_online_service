import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Note: Sign out is handled client-side with signOut() from next-auth/react
  // This route is for completeness
  return NextResponse.json({ success: true })
}
