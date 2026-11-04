import {
  parseResolved,
  parseTheme,
  resolveTheme,
  systemCookie,
  themeCookie,
} from "@/shared/lib/utils/theme.util";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import {
  greatVibes,
  geistMono,
  monsieur,
  sarabun,
  tajawal,
} from "@/shared/lib/constants/fonts.constant";
import "../globals.css";

import NextAuthProvider from "@/providers/next-auth.provider";
import { ThemeProvider } from "@/shared/context/theme.context";
import { Toaster } from "@/shared/ui/toast";

export const metadata: Metadata = {
  title: "Rose App",
  description: "Rose Application",
  icons: "../favicon.ico",
};

// The <html> theme class is resolved from the request cookie, so this route
// cannot be prerendered into a static shell. Block on the server instead of
// streaming — the root element itself can't sit behind a Suspense fallback.
export const instant = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Direction for HTML
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Resolve the theme from cookies during render so <html> ships with the
  // right class and there is no flash before hydration.
  const cookieStore = await cookies();
  const theme = parseTheme(cookieStore.get(themeCookie)?.value);
  const systemTheme = parseResolved(cookieStore.get(systemCookie)?.value);
  const resolvedTheme = resolveTheme(theme, systemTheme);

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={dir}
      className={`${sarabun.variable} ${tajawal.variable} ${geistMono.variable} ${monsieur.variable} ${greatVibes.variable} ${resolvedTheme} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextAuthProvider>
          <ThemeProvider initialTheme={theme} initialSystemTheme={systemTheme}>
            <NextIntlClientProvider>
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
