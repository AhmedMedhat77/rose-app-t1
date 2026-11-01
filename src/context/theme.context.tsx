"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

export const themeModes = ["light", "system", "dark"] as const;
export type ThemeMode = (typeof themeModes)[number];
type ResolvedTheme = "light" | "dark";
const themeStorageKey = "rose-theme";

export function parseTheme(value: string | null): ThemeMode {
  return themeModes.includes(value as ThemeMode)
    ? (value as ThemeMode)
    : "system";
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  // =================== Hooks ===================
  const [state, dispatch] = useReducer(themeReducer, {
    theme: "system",
    systemTheme: "light",
    initialized: false,
  });
  const resolvedTheme =
    state.theme === "system" ? state.systemTheme : state.theme;

  // =================== SETTERS ===================
  const setTheme = useCallback((theme: ThemeMode) => {
    const mode = parseTheme(theme);
    dispatch({ type: "set-theme", theme: mode });
    try {
      window.localStorage.setItem(themeStorageKey, mode);
    } catch {
      // Theme selection remains available when browser storage is blocked.
    }
  }, []);

  // =================== EFFECTS ===================
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let theme: ThemeMode = "system";
    try {
      theme = parseTheme(window.localStorage.getItem(themeStorageKey));
    } catch {
      // Use the system preference when browser storage is unavailable.
    }
    dispatch({
      type: "initialize",
      theme,
      systemTheme: media.matches ? "dark" : "light",
    });

    const onSystemChange = (event: MediaQueryListEvent) => {
      dispatch({
        type: "system-change",
        systemTheme: event.matches ? "dark" : "light",
      });
    };
    const onStorage = (event: StorageEvent) => {
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch {
        return;
      }
      if (event.key === themeStorageKey || event.key === null) {
        dispatch({ type: "set-theme", theme: parseTheme(event.newValue) });
      }
    };

    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!state.initialized) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [state.initialized, resolvedTheme]);

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
