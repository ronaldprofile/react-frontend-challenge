import { persist } from "zustand/middleware";
import { create } from "zustand";

export const THEME_STORAGE_KEY = "cinedash.theme";

export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: "dark",
      setTheme: theme => set({ theme }),
      toggleTheme: () =>
        set(state => ({ theme: state.theme === "dark" ? "light" : "dark" }))
    }),
    {
      name: THEME_STORAGE_KEY
    }
  )
);

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function initTheme(): void {
  const { theme } = useThemeStore.getState();
  applyTheme(theme);
  useThemeStore.subscribe(state => {
    applyTheme(state.theme);
  });
}
