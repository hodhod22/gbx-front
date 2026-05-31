// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:4000 https://gbx-back.onrender.com https://api.stripe.com https://connect.stripe.com https://*.stripe.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
  );
  return response;
}

export const config = {
  matcher: "/:path*",
};
