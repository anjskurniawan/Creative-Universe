"use client";

import { createContext, useContext } from "react";

export type OddsTheme = "light" | "dark" | "retro";

export type OddsThemeContextType = {
  theme: OddsTheme;
  setTheme: (theme: OddsTheme) => void;
};

export const OddsThemeContext = createContext<OddsThemeContextType | null>(null);

export function useOddsTheme() {
  const context = useContext(OddsThemeContext);
  if (!context) {
    return { theme: "light" as OddsTheme, setTheme: () => {} };
  }
  return context;
}
