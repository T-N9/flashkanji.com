// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ja', 'my'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // First, handle internationalization
  const intlResponse = intlMiddleware(request);
  
  // If intl middleware wants to redirect (for locale), do that first
  if (intlResponse && intlResponse.status === 307) {
    return intlResponse;
  }
  
  // Now handle authentication logic
  // Allow access to login page and root for all locales
  const isLoginPage = url.pathname.match(/^\/[a-z]{2}\/login$/);
  const isCallbackPage = url.pathname.match(/^\/[a-z]{2}\/callback$/);
  const isCreateProfilePage = url.pathname.match(/^\/[a-z]{2}\/create-profile$/);
  const isRootPath = url.pathname === '/';
  
  // Allow these pages without authentication
  if (isLoginPage || isCallbackPage || isCreateProfilePage || isRootPath) {
    return intlResponse || NextResponse.next();
  }
  
  // Check for authentication token
  const token = request.cookies.get("sb-access-token")?.value;
  
  if (!token) {
    // Extract locale from current path or use default
    const locale = url.pathname.split('/')[1] || 'en';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for API routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|assets).*)'
  ]
};