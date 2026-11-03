import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "./features/auth";

// Handles locale detection, cookie syncing and locale-prefixed rewrites.
const intlMiddleware = createMiddleware(routing);

// Matches a leading locale segment, e.g. `/en` or `/ar`, as a whole path part.
const localePrefix = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

function generateURL(path: string, locale: string, request: NextRequest) {
  const url = new URL(`/${locale}${path}`, request.nextUrl.origin);

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url;
}

// Locale-stripped paths that require authentication. A request is protected
// when its pathname equals a route or starts with `<route>/`. Everything not
// listed here is public.
const AUTH_ROUTES = ["/"];

function isProtectedRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );
}

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // from constants for auth
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // The pathname is locale-prefixed (e.g. `/en/auth/login`); strip the locale
  // so auth checks work regardless of the active locale, and keep the locale
  // so redirects stay within the localized routing.
  const locale = path.match(localePrefix)?.[1] ?? routing.defaultLocale;
  const pathname = path.replace(localePrefix, "") || "/";
  const isAuthRoute = pathname.startsWith("/auth");

  if (!token) {
    if (isAuthRoute || !isProtectedRoute(pathname)) {
      return intlMiddleware(request);
    }

    return NextResponse.redirect(generateURL("/auth/login", locale, request));
  }

  // Logged-in users shouldn't see the auth screens.
  if (isAuthRoute) {
    return NextResponse.redirect(generateURL("", locale, request));
  }

  // Delegate to next-intl so locale handling keeps working for allowed routes.
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
