import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // This is a very simple middleware - you'd want something more robust in production

  // Only run middleware for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if user is logged in as admin
    // In a real app, you'd verify a JWT token here
    const authCookie = request.cookies.get("adminAuth")?.value;

    // If no auth cookie or invalid, redirect to login
    if (!authCookie) {
      return NextResponse.redirect(new URL("/auth/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
