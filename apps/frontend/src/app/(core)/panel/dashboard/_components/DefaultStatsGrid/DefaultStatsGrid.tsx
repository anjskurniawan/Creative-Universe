import React from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard/StatCard";
import type { DashboardStats } from "../Dashboard.types";

interface DefaultStatsGridProps {
  stats: DashboardStats;
}

export function DefaultStatsGrid({ stats }: DefaultStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Active Users */}
      <StatCard
        title="User Aktif"
        value={stats.active_users}
        icon="groups"
        iconBgClass="bg-cu-info-soft"
        iconColorClass="text-cu-info"
        borderHoverClass="hover:border-cu-info/30"
      />

      {/* 2. Your Role */}
      <StatCard
        title="Role Kamu"
        value={stats.roles.join(", ") || "User"}
        icon="verified_user"
        iconBgClass="bg-cu-success-soft"
        iconColorClass="text-cu-success"
        borderHoverClass="hover:border-cu-success/30"
        className="capitalize"
      />

      {/* 3. Core Feature - Pricetag Generator */}
      <Link href="/generator/pricetag" className="group block">
        <StatCard
          title="Pricetag Generator"
          value="Cetak Label Baru"
          icon="local_offer"
          iconBgClass="bg-purple-50 group-hover:bg-purple-600 transition-colors duration-200"
          iconColorClass="text-purple-600 group-hover:text-white transition-colors duration-200"
          borderHoverClass="group-hover:border-purple-500/30"
        />
      </Link>
    </div>
  );
}
