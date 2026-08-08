"use client";

import { AppTitle } from "@/components/layout/app-title";

export default function CreativeReportLandingPage() {
  return (
    <main className="w-full h-full flex flex-col min-h-[70vh]">
      <AppTitle 
        title="Creative Report" 
        subtitle="Analisis performa bulanan, evaluasi kontribusi, dan tata kelola tim kreatif secara terpadu."
        icon="monitoring"
      />
    </main>
  );
}
