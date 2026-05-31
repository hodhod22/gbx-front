// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Publika routes (kräver ingen inloggning)
const publicRoutes = ["/", "/login", "/register", "/gbx", "/api/prices"];

// Routes som kräver inloggning
const protectedRoutes = [
  "/dashboard",
  "/buy",
  "/send",
  "/admin",
  "/balances",
  "/transactions",
  "/profile",
  "/settings",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Tillåt publika routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route),
    )
  ) {
    return NextResponse.next();
  }

  // Kolla token (från cookie eller localStorage? middleware kan inte läsa localStorage, så vi använder cookie)
  const token = request.cookies.get("token")?.value;

  // Om skyddad route och ingen token – redirect till login med returnUrl
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // För startsidan – om token finns, redirecta till rätt dashboard
  if (pathname === "/") {
    if (token) {
      // Vi kan inte veta om admin här, så vi redirectar till /dashboard och låter sidan själv vidarebefodra admin
      // Alternativt lägg till en API-anrop, men det är långsamt. Vi gör enklast: redirect till /dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
