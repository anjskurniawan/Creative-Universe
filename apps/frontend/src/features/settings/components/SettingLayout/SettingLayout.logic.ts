import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { getActiveSettingsLabel } from "./SettingMenu/SettingMenu.config";
import { SETTINGS_TITLES } from "./SettingLayout.config";

type SettingAsideContextValue = {
  setAside: Dispatch<SetStateAction<ReactNode>>;
};

export const SettingAsideContext = createContext<SettingAsideContextValue | null>(null);

export function useSettingAside(content: ReactNode) {
  const context = useContext(SettingAsideContext);

  useEffect(() => {
    if (!context) return;
    context.setAside(content);
    return () => context.setAside(null);
  }, [context, content]);
}

export function useSettingLayoutState(title?: ReactNode, subtitle?: ReactNode) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const normalizedPath = (pathname ?? "").replace(/\/$/, "") || "/";
  const routeTitle = SETTINGS_TITLES[normalizedPath];

  return {
    isMobileDetail: normalizedPath !== "/settings",
    activeMobileLabel: getActiveSettingsLabel(normalizedPath, searchParams),
    resolvedTitle: title ?? routeTitle?.title,
    resolvedSubtitle: subtitle ?? routeTitle?.subtitle,
  };
}
