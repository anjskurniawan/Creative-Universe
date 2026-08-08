"use client";

import { Suspense } from "react";
import MessagesPageContent from "@/components/messages/messages-page";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="rounded-lg border border-cu-line bg-white p-6 text-sm text-cu-muted">Memuat pesan...</div>}>
      <MessagesPageContent />
    </Suspense>
  );
}
