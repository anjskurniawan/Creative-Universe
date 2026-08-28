import React from "react";
import { ActionCard } from "@/components/ui/ActionCard/ActionCard";

interface QuickActionsSectionProps {
  hasPermission: (permission: string) => boolean;
}

export function QuickActionsSection({ hasPermission }: QuickActionsSectionProps) {
  // Config for quick actions with brief command text
  const actions = [
    {
      href: "/generator/pricetag",
      icon: "print",
      iconColor: "text-purple-600",
      title: "Buat Pricetag",
      cmd: "Cetak label harga baru",
      visible: true,
    },
    {
      href: "/generator/pricetag/search",
      icon: "search",
      iconColor: "text-cu-info",
      title: "Cari Barcode",
      cmd: "Cari kode produk cepat",
      visible: true,
    },
    {
      href: "/generator/pricetag/catalog",
      icon: "database",
      iconColor: "text-cu-warning",
      title: "Katalog Produk",
      cmd: "Lihat data & stok produk",
      visible: true,
    },
    {
      href: "/generator/pricetag/history",
      icon: "history",
      iconColor: "text-slate-400",
      title: "Riwayat Cetak",
      cmd: "Log aktivitas pencetakan",
      visible: true,
    },
    {
      href: "/panel/profile",
      icon: "person",
      iconColor: "text-slate-400",
      title: "Edit Profil",
      cmd: "Ubah data kredensial Anda",
      visible: true,
    },
    {
      href: "/panel/users",
      icon: "group",
      iconColor: "text-slate-400",
      title: "Kelola User",
      cmd: "Atur hak akses & akun user",
      visible: hasPermission("manage-users"),
    },
    {
      href: "/panel/roles",
      icon: "admin_panel_settings",
      iconColor: "text-slate-400",
      title: "Kelola Role",
      cmd: "Konfigurasi role & policy",
      visible: hasPermission("manage-roles"),
    },
    {
      href: "/panel/maintenance",
      icon: "build",
      iconColor: "text-slate-400",
      title: "Maintenance",
      cmd: "Sistem & artisan command",
      visible: hasPermission("run-artisan"),
    },
  ];

  return (
    <div className="rounded-xl border border-cu-line bg-cu-surface p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-cu-ink">Aksi Cepat</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {actions
          .filter((act) => act.visible)
          .map((act) => (
            <ActionCard
              key={act.href}
              href={act.href}
              title={act.title}
              description={act.cmd}
              icon={act.icon}
              iconColorClass={act.iconColor}
            />
          ))}
      </div>
    </div>
  );
}
