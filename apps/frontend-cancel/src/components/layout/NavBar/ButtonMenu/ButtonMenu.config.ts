import type { ButtonMenuState } from "./ButtonMenu.types";

export function getButtonMenuStateClasses(state: ButtonMenuState, dark: boolean, active: boolean) {
  if (state === "Focus" || active) return dark ? "border border-orange-500/30 bg-orange-500/10" : "border border-slate-300 bg-slate-100";
  if (state === "Hover") return dark ? "border border-transparent bg-orange-500/10" : "border border-transparent bg-slate-100";
  return dark ? "border border-transparent hover:bg-orange-500/10" : "border border-transparent hover:bg-slate-50";
}
