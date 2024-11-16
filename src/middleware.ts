import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the pathname is "/kanji" and has no query parameters
  if (request.nextUrl.pathname === "/kanji" && !request.nextUrl.searchParams.has("chapter") && !request.nextUrl.searchParams.has("level")) {
    // Clone the URL and add the query parameters
    const url = request.nextUrl.clone();
    url.searchParams.set("chapter", "1");
    url.searchParams.set("level", "5");

    // Redirect to the new URL
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed if it doesn't match the criteria
  return NextResponse.next();
}

export const config = {
  matcher: "/kanji", // Apply middleware only to `/kanji` route
};
