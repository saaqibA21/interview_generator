import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
})

export function proxy(req: any) {
  if (process.env.MOCK_AUTH === 'true') {
    return NextResponse.next()
  }
  return (authMiddleware as any)(req)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/generate-interview/:path*",
    "/api/analyze-job/:path*",
    "/api/bulk-rank/:path*",
    "/api/verify-claims/:path*",
    "/api/score-answer/:path*",
  ],
}
