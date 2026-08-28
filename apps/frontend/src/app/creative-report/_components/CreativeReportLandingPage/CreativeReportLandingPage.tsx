"use client";

import { AppTitle } from "@/app/creative-report/_components/AppTitle/AppTitle";

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
