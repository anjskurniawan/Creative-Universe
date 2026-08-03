"use client";

import { Suspense } from "react";
import OddsTaskDetailView from "@/features/odds/components/task-detail/odds-task-detail-view";

export default function OddsDetailPage() {
  return <Suspense fallback={null}><OddsTaskDetailView /></Suspense>;
}
