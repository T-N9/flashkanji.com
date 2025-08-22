import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname === "/en/login" || url.pathname === '/') return NextResponse.next();

  const token = request.cookies.get("sb-access-token")?.value;

  if (!token) {
    const loginUrl = new URL("/en/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|callback|_next|favicon.ico|assets).*)", 
  ],
};
