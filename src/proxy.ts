import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that dont require auth
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
  // Public read-only structure data used by the register form
  "/api/structure",
];

// Routes only for admins and super admins
const adminRoutes = [
  "/admin",
];

// Routes only for super admins
const superAdminRoutes = [
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

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const session = token
    ? {
        user: {
          id: token.id as string | undefined,
          role: token.role as string | undefined,
          isActive: token.isActive as boolean | undefined,
        },
      }
    : null;

  // Landing page: public entry point.
  // Anonymous visitors see the landing first;
  // signed-in users go straight to their library.
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    // Redirect logged in users away from auth pages
    // (but let deactivated accounts through so they can see the error)
    if (
      session &&
      req.nextUrl.searchParams.get("error") !== "inactive" &&
      (pathname === "/login" ||
        pathname === "/register" ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password"))
    ) {
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
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"
  ],
};