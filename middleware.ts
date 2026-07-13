import NextAuth from "next-auth";
import { authConfig } from "@/src/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/login", "/register", "/api/auth"];

const adminRoutes = ["/admin"];

const superAdminRoutes = ["/admin/users", "/admin/structure"];

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

  if (isPublicRoute(pathname)) {
    if (session && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!session.user.isActive) {
    return NextResponse.redirect(new URL("/login?error=inactive", req.url));
  }

  if (isSuperAdminRoute(pathname)) {
    if (session.user.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
