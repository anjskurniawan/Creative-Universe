import type { ReactNode } from "react";
import type { IconSpectrumName } from "@/components/spectrum/IconSpectrum";

export interface MenuItem {
  /** Identifier unik untuk item */
  id: string;
  /** Teks label yang ditampilkan */
  label: string;
  /** Link URL tujuan jika item berupa link navigasi */
  href?: string;
  /** Nama Icon Spectrum (string) atau custom ReactNode */
  icon?: IconSpectrumName | ReactNode;
  /** Teks badge opsional (misal: "Pro", "Baru", counter) */
  badge?: string;
  /** Variant badge jika badge aktif */
  badgeVariant?: "accent" | "informative" | "positive" | "negative" | "notice" | "neutral" | "gray";
  /** Status aktif eksplisit (jika tidak disediakan, dicocokkan otomatis via activeHref) */
  isActive?: boolean;
  /** Apakah item dalam status disabled */
  isDisabled?: boolean;
  /** Handler callback saat item diklik */
  onPress?: () => void;
  /** Aria label kustom */
  "aria-label"?: string;
}

export interface MenuProps {
  /** Daftar item menu opsional untuk override jika diperlukan */
  items?: MenuItem[];
  /** Apakah navigasi dalam keadaan expanded (default: true) atau collapsed (hanya icon + tooltip) */
  isExpanded?: boolean;
  /** Setter ekspansi sidebar jika item menu membutuhkan trigger expand */
  setSidebarExpanded?: (expanded: boolean) => void;
  /** Path URL saat ini untuk menentukan item aktif otomatis */
  activeHref?: string;
  /** ClassName kustom untuk container */
  className?: string;
  /** Aria label untuk nav element (default: "Navigasi Menu") */
  "aria-label"?: string;
}

// Backward compatibility alias
export type MenuNavItem = MenuItem;
export type MenuNavProps = MenuProps;
