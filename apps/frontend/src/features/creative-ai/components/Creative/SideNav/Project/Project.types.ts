import type { MenuItem } from "../Menu";

export interface ProjectSubItem {
  /** Identifier unik sub item */
  id: string;
  /** Label teks sub item */
  label: string;
  /** Link URL tujuan */
  href?: string;
  /** Callback saat sub item diklik */
  onPress?: () => void;
  /** Status aktif eksplisit */
  isActive?: boolean;
  /** Status disabled */
  isDisabled?: boolean;
  /** Aria label kustom */
  "aria-label"?: string;
}

export interface ProjectItem extends MenuItem {
  projectId?: string;
  isOpen?: boolean;
  /** Daftar sub item di dalam folder proyek (tanpa icon) */
  subItems?: ProjectSubItem[];
  /** Callback saat aksi tambah sub-item (+) diklik */
  onAddSubItem?: () => void;
  /** Callback saat aksi opsi (...) diklik */
  onMoreOptions?: () => void;
}

export interface ProjectProps {
  items: ProjectItem[];
  isExpanded?: boolean;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  /** Handler callback saat tombol tambah folder diklik */
  onAddProject?: () => void;
  activeHref?: string;
  className?: string;
}
