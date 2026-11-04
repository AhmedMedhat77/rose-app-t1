// Theme values shared by the server (layout reads cookies, sets the <html>
// class) and the client provider. Kept free of "use client" and React context
// so a Server Component can import it.

export const themeModes = ["light", "system", "dark"] as const;
export type ThemeMode = (typeof themeModes)[number];
export type ResolvedTheme = "light" | "dark";

// Cookies (not localStorage) so the server can read the theme during render
// and emit the class on <html>, avoiding a flash before hydration.
// themeCookie drives the toggle; systemCookie carries the client's last known
// OS preference so the server can resolve "system" to a concrete class.
export const themeCookie = "rose-theme";
export const systemCookie = "rose-system";

export function parseTheme(value: string | null | undefined): ThemeMode {
  return themeModes.includes(value as ThemeMode)
    ? (value as ThemeMode)
    : "system";
}

export function parseResolved(value: string | null | undefined): ResolvedTheme {
  return value === "dark" ? "dark" : "light";
}

export function resolveTheme(
  theme: ThemeMode,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}
