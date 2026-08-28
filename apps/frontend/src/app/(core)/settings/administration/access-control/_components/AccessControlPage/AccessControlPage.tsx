"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { useAuth } from "@/hooks/auth";

export default function AccessControlPage() {
  const { user, hasPermission } = useAuth();

  if (!user) return null;
  if (!hasPermission("manage-settings")) return <p className="text-sm text-cu-danger">Anda tidak memiliki permission manage-settings.</p>;

  return (
    <div className="space-y-8 animate-fade-in">
      <aside className="w-full space-y-4">
        <div>
          <h3 className="flex items-center gap-2 border-b border-cu-line pb-2 text-sm font-semibold text-cu-ink">
            <MaterialIcon name="badge" size="sm" className="text-cu-muted" />
            Hak Akses Anda
          </h3>
          <p className="mt-3 text-xs text-cu-muted">Daftar peran dan izin langsung yang melekat pada akun Anda.</p>
        </div>
        <div className="space-y-4 rounded-xl border border-cu-line bg-cu-surface p-4">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">Peran Anda</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {user.roles?.length ? user.roles.map((role) => <span key={role} className="inline-flex rounded-full border border-cu-line bg-cu-panel-soft px-2.5 py-0.5 text-[10px] font-bold text-cu-ink">{role}</span>) : <span className="text-xs italic text-cu-muted">Tidak ada peran</span>}
            </div>
          </div>
          <div className="border-t border-cu-line/60 pt-3">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">Izin Langsung</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {user.permissions?.length ? user.permissions.map((permission) => <span key={permission} className="inline-flex rounded-full border border-cu-line/60 bg-cu-surface px-2.5 py-0.5 text-[10px] font-medium text-cu-muted">+{permission}</span>) : <span className="text-xs italic text-cu-muted">Tidak ada izin langsung</span>}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
