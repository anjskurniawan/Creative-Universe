"use client";

import type { ReactNode } from "react";

type StandardBriefDetailsProps = {
  children: ReactNode;
};

/**
 * Varian brief naratif yang saat ini dipakai oleh Request Baru.
 * Kontennya dipisahkan dari wizard agar dapat hidup berdampingan dengan
 * varian brief berbasis tabel tanpa mengubah kontrak form request.
 */
export function StandardBriefDetails({ children }: StandardBriefDetailsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">{children}</div>
  );
}
