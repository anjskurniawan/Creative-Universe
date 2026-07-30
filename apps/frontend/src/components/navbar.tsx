"use client";

import PreviewNavbar, {
  type NavbarProps as PreviewNavbarProps,
} from "@/app/layout-preview/components/content/navbar/navbar";
export { CreativeUniverseLogo } from "@/components/ui/creative-universe-logo";

export type NavbarVariant = "light" | "dark" | "transparent-dark";
export type NavbarSession = "connected" | "guest" | "preview-authenticated";
export type NavbarProps = {
  variant?: NavbarVariant;
  sticky?: boolean;
  session?: NavbarSession;
  previewUser?: PreviewNavbarProps["userProfile"];
  interactive?: boolean;
  hideBrand?: boolean;
};

export function Navbar({
  variant = "light",
  sticky = true,
  session = "connected",
  previewUser,
  hideBrand = false,
}: NavbarProps) {
  void session;
  return (
    <div className={sticky ? "sticky top-0 z-50" : "relative z-50"}>
      <PreviewNavbar
        viewport="Desktop"
        userProfile={previewUser}
        hideBrand={hideBrand}
        className={variant === "transparent-dark" ? "bg-transparent text-white" : undefined}
      />
    </div>
  );
}

export function createPreviewUser() {
  return {
    name: "Alex Kurniadi",
    role: "Project Owner",
    initials: "AK",
  };
}

export type { PreviewNavbarProps };
