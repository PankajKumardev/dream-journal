import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/api/auth", "/privacy", "/terms"];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
  
  // Static files and Next.js internals
  const isStaticOrInternal = 
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.includes(".");

  // Allow public routes and static files
  if (isPublicRoute || isStaticOrInternal) {
    return NextResponse.next();
  }

  // Check for session token
  const sessionToken = request.cookies.get("authjs.session-token") || 
                       request.cookies.get("__Secure-authjs.session-token");

  // Redirect to login if no session
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*|api/auth).*)",
  ],
};
