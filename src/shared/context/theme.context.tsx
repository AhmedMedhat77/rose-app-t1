"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  type ReactNode,
} from "react";

import {
  parseTheme,
  resolveTheme,
  systemCookie,
  themeCookie,
  type ResolvedTheme,
  type ThemeMode,
} from "../lib/utils/theme.util";

// Re-exported so existing client imports (e.g. ThemeMode.tsx) still resolve
// from this module; the definitions live in theme.util.ts.
export {
  parseResolved,
  parseTheme,
  resolveTheme,
  systemCookie,
  themeCookie,
  themeModes,
  type ResolvedTheme,
  type ThemeMode,
} from "../lib/utils/theme.util";

const cookieMaxAge = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=${cookieMaxAge};samesite=lax`;
}

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
};

type ThemeState = {
  theme: ThemeMode;
  systemTheme: ResolvedTheme;
  initialized: boolean;
};

type ThemeAction =
  | { type: "initialize"; theme: ThemeMode; systemTheme: ResolvedTheme }
  | { type: "set-theme"; theme: ThemeMode }
  | { type: "system-change"; systemTheme: ResolvedTheme };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "initialize":
      return {
        theme: action.theme,
        systemTheme: action.systemTheme,
        initialized: true,
      };
    case "set-theme":
      return { ...state, theme: action.theme };
    case "system-change":
      return { ...state, systemTheme: action.systemTheme };
  }
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialTheme,
  initialSystemTheme,
}: {
  children: ReactNode;
  initialTheme: ThemeMode;
  initialSystemTheme: ResolvedTheme;
}) {
  // hooks
  // Seed from the server-read cookies so the rendered class matches <html>.
  const [state, dispatch] = useReducer(themeReducer, {
    theme: initialTheme,
    systemTheme: initialSystemTheme,
    initialized: true,
  });
  const resolvedTheme = resolveTheme(state.theme, state.systemTheme);

  // setters
  const setTheme = useCallback((theme: ThemeMode) => {
    const mode = parseTheme(theme);
    dispatch({ type: "set-theme", theme: mode });
    writeCookie(themeCookie, mode);
  }, []);

  // effects
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const systemTheme: ResolvedTheme = media.matches ? "dark" : "light";
    // Correct the server's (possibly stale) system value and persist it so the
    // next server render resolves "system" to the right class.
    if (systemTheme !== initialSystemTheme) {
      dispatch({ type: "system-change", systemTheme });
    }
    writeCookie(systemCookie, systemTheme);

    const onSystemChange = (event: MediaQueryListEvent) => {
      const next: ResolvedTheme = event.matches ? "dark" : "light";
      dispatch({ type: "system-change", systemTheme: next });
      writeCookie(systemCookie, next);
    };

    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, [initialSystemTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext value={{ theme: state.theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
