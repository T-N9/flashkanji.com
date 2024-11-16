import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Check if pathname is "/kanji"
  if (url.pathname === "/kanji") {
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

  // Proceed as normal for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: "/kanji", // Apply middleware only to `/kanji` route
};
