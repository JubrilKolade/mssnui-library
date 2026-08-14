import { auth } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that dont require auth
const publicRoutes = [
  "/login",
  "/register",
  "/api/auth",
];

// Routes only for admins and super admins
const adminRoutes = [
  "/admin",
];

// Routes only for super admins
const superAdminRoutes = [
  "/admin/users",
  "/admin/structure",
];

function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string) {
  return adminRoutes.some((route) => pathname.startsWith(route));
}

function isSuperAdminRoute(pathname: string) {
  return superAdminRoutes.some((route) => pathname.startsWith(route));
}

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    // Redirect logged in users away from auth pages
    if (session && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // No session - redirect to login
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if account is active
  if (!session.user.isActive) {
    return NextResponse.redirect(new URL("/login?error=inactive", req.url));
  }

  // Super admin routes
  if (isSuperAdminRoute(pathname)) {
    if (session.user.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Admin routes
  if (isAdminRoute(pathname)) {
    if (
      session.user.role !== "admin" &&
      session.user.role !== "super_admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"
  ],
};