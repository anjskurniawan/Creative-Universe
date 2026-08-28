import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface AccessDeniedProps {
  title?: string;
  message?: string;
}

export function AccessDenied({
  title = "Akses ditolak",
  message = "Anda tidak memiliki izin akses untuk membuka halaman ini.",
}: AccessDeniedProps) {
  return (
    <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center max-w-lg mx-auto mt-12">
      <MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" />
      <h1 className="mt-3 text-lg font-semibold text-cu-ink">{title}</h1>
      <p className="mt-1 text-sm text-cu-muted">
        {message}
      </p>
    </div>
  );
}
