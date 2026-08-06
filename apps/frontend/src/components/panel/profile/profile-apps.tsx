import React from "react";

interface Application {
  key: string;
  display_name: string;
  type: string;
}

interface ProfileAppsProps {
  applications: Application[];
}

export function ProfileApps({ applications }: ProfileAppsProps) {
  const subApps = applications.filter((app) => app.type === "sub_app");

  return (
    <section className="mt-6 rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-cu-ink">Aplikasi Saya</h2>
      <p className="mt-1 text-sm text-cu-muted">Aplikasi yang tersedia untuk akun Anda.</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {subApps.map((app) => (
          <span
            key={app.key}
            className="rounded-full border border-cu-line bg-cu-panel-soft px-3 py-1.5 text-xs font-medium text-cu-ink"
          >
            {app.display_name}
          </span>
        ))}
        {subApps.length === 0 && (
          <span className="text-sm text-cu-muted">Belum ada aplikasi yang dapat diakses.</span>
        )}
      </div>
    </section>
  );
}
