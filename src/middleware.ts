import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname === "/login") return NextResponse.next();

  // Get Supabase token from cookie
  const token = request.cookies.get("sb-access-token")?.value;

  // If not authenticated, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if pathname is "/kanji"
  if (
    url.pathname === "/study/kanji/cards" ||
    url.pathname === "/study/kanji/repetition" ||
    url.pathname === "/study/jukugo/cards" ||
    url.pathname === "/study/jukugo/repetition"
  ) {
    const hasDefaultParams =
      url.searchParams.has("chapter") && url.searchParams.has("level");

    // Skip if query already has `chapter` or `level` OR if other params like `chapters` exist
    if (!hasDefaultParams && !url.searchParams.has("chapters")) {
      const updatedUrl = url.clone();
      updatedUrl.searchParams.set("chapter", "1");
      updatedUrl.searchParams.set("level", "5");
      return NextResponse.redirect(updatedUrl);
    }
  }

  if(
    url.pathname === "/study/kanji/quiz"
  ){
    const hasDefaultParams =
    url.searchParams.has("chapter") && url.searchParams.has("level") && url.searchParams.has("mode");

  // Skip if query already has `chapter` or `level` OR if other params like `chapters` exist
  if (!hasDefaultParams && !url.searchParams.has("chapters")) {
    const updatedUrl = url.clone();
    updatedUrl.searchParams.set("chapter", "1");
    updatedUrl.searchParams.set("level", "5");
    updatedUrl.searchParams.set("mode", "2");
    return NextResponse.redirect(updatedUrl);
  }
  }

  // Proceed as normal for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|callback|_next|favicon.ico).*)", 
  ],
};
