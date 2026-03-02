import { useState, useEffect, useCallback } from "react";

export type Theme = "mono-dark" | "mono-light" | "orange" | "orange-light";

const DARK_THEMES: Theme[] = ["mono-dark", "orange"];
const THEME_CYCLE: Theme[] = ["orange", "orange-light", "mono-dark", "mono-light"];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", DARK_THEMES.includes(theme));
  localStorage.setItem("theme", theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("orange");

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme") as Theme | null;
    if (stored && THEME_CYCLE.includes(stored)) {
      setTheme(stored);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEME_CYCLE.indexOf(prev);
      const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      applyTheme(next);
      return next;
    });
  }, []);

  const selectTheme = useCallback((next: Theme) => {
    applyTheme(next);
    setTheme(next);
  }, []);

  return { theme, toggleTheme, selectTheme } as const;
}
