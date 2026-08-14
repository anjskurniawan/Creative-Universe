"use client";

import { UniversalErrorView } from "@/components/feedback/universal-error-view";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <UniversalErrorView errorKind="runtime" onRetry={reset} />;
}
