import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

// Handles locale detection, cookie syncing and locale-prefixed rewrites.
const intlMiddleware = createMiddleware(routing);

// Matches a leading locale segment, e.g. `/en` or `/ar`, as a whole path part.
const localePrefix = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

// Locale-stripped paths that require authentication. Add routes here to
// protect them. A request is protected when its pathname equals a listed
// route or starts with `<route>/`. Everything not listed is public.
const PROTECTED_ROUTES: string[] = [
  // e.g. "/dashboard", "/profile"
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function generateURL(path: string, locale: string, request: NextRequest) {
  const url = new URL(`/${locale}${path}`, request.nextUrl.origin);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url;
}

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  // Strip the locale (e.g. `/en/dashboard`) so auth checks are locale-agnostic,
  // and keep the locale so redirects stay within localized routing.
  const locale = path.match(localePrefix)?.[1] ?? routing.defaultLocale;
  const pathname = path.replace(localePrefix, "") || "/";

  if (!token && isProtectedRoute(pathname)) {
    return NextResponse.redirect(generateURL("/login", locale, request));
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
