"use client";

import { UniversalErrorView } from "@/design-system/templates/feedback/universal-error-view";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <UniversalErrorView onRetry={reset} />;
}
