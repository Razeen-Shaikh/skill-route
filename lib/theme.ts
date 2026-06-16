import { ThemeName } from "@/lib/interfaces";

export type AppTheme = "light" | "dark";

export function toAppTheme(theme: string | null | undefined): AppTheme {
  if (!theme) return "light";
  return theme.toUpperCase() === "DARK" || theme === "dark" ? "dark" : "light";
}

export function toDbTheme(theme: string | null | undefined): ThemeName {
  return toAppTheme(theme) === "dark" ? "DARK" : "LIGHT";
}

export function migrateLegacyThemeStorage() {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("theme");
  if (stored === "LIGHT" || stored === "DARK") {
    localStorage.setItem("theme", stored === "DARK" ? "dark" : "light");
  }
}
