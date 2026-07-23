"use client";

import { createContext, useContext } from "react";

export const CreativeReportThemeContext = createContext<{
  theme: "light" | "dark" | "retro";
  setTheme: (theme: "light" | "dark" | "retro") => void;
}>({
  theme: "light",
  setTheme: () => {},
});

export function useCreativeReportTheme() {
  return useContext(CreativeReportThemeContext);
}
