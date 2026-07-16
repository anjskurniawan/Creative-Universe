"use client";

import {
  SideMenuAvatar as SideMenuAvatarComponent,
  type SideMenuAvatarVariant,
  SideMenuCollaps,
  SideMenuExpand,
  type SideMenuMenuStatus,
  SideMenuIconApp,
  sideMenuIconVariantToType,
  type SideMenuIconVariant,
} from "@/components/sidemenu";
import { SidebarUtilityActions } from "@/components/sidebar-utility-actions";
import { useAuth } from "@/providers/auth-provider";

export type SideMenuVariant = "Collaps" | "Expand";
export type { SideMenuIconVariant } from "@/components/sidemenu";
export type { SideMenuMenuModel, SideMenuMenuStatus } from "@/components/sidemenu";
export type { SideMenuAvatarVariant } from "@/components/sidemenu";

export type SideMenuItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  status?: SideMenuMenuStatus;
};

type SideMenuIconProps = {
  variant?: SideMenuIconVariant;
  className?: string;
};

type SideMenuAvatarProps = {
  variant?: SideMenuAvatarVariant;
  className?: string;
};

type SideMenuProps = {
  variant?: SideMenuVariant;
  primaryItems: SideMenuItem[];
  onVariantChange?: (variant: SideMenuVariant) => void;
  className?: string;
};

export function SideMenuIcon({
  variant = "Logo Vector Group",
  className = "",
}: SideMenuIconProps) {
  return (
    <SideMenuIconApp
      state="Light"
      type={sideMenuIconVariantToType(variant)}
      className={className}
    />
  );
}

export function SideMenuAvatar({
  variant = "Avatar",
  className = "",
}: SideMenuAvatarProps) {
  const { user } = useAuth();
  const primaryRole = user?.roles[0];
  const roleLabel = primaryRole
    ? `${primaryRole}${primaryRole.toLowerCase().includes("admin") ? "" : " Admin"}`
    : "Root Admin";

  return (
    <SideMenuAvatarComponent
      variant={variant}
      name={user?.name ?? "Anjas Kurniawan"}
      role={roleLabel}
      className={className}
    />
  );
}

export function SideMenu({
  variant = "Expand",
  primaryItems,
  onVariantChange,
  className = "",
}: SideMenuProps) {
  const { user } = useAuth();
  const isExpand = variant === "Expand";
  const primaryRole = user?.roles[0];
  const roleLabel = primaryRole
    ? `${primaryRole}${primaryRole.toLowerCase().includes("admin") ? "" : " Admin"}`
    : "Root Admin";
  const avatarName = user?.name ?? "Anjas Kurniawan";

  if (isExpand) {
    return (
      <SideMenuExpand
        primaryItems={primaryItems}
        secondaryContent={<SidebarUtilityActions model="Icon + Text" />}
        onCollapse={onVariantChange ? () => onVariantChange("Collaps") : undefined}
        avatarName={avatarName}
        avatarRole={roleLabel}
        className={className}
      />
    );
  }

  return (
    <SideMenuCollaps
      primaryItems={primaryItems}
      secondaryContent={<SidebarUtilityActions model="Icon" />}
      onExpand={onVariantChange ? () => onVariantChange("Expand") : undefined}
      avatarName={avatarName}
      avatarRole={roleLabel}
      className={className}
    />
  );
}
