"use client";

import { Suspense } from "react";
import OddsTaskDetailView from "@/features/odds/components/OddsTaskDetail/OddsTaskDetail";

export default function OddsDetailPage() {
  return <Suspense fallback={null}><OddsTaskDetailView /></Suspense>;
}
