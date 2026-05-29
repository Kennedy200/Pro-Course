import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/student", "/lecturer", "/admin"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("procourse_token")?.value;

  // Protect dashboard routes
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in, DON'T block auth pages — let the page handle it
  // This fixes the back button issue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/lecturer/:path*",
    "/admin/:path*",
  ],
};