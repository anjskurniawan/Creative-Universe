"use client";

import { UniversalErrorView } from "@/design-system/templates/feedback/universal-error-view";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="id"><body><UniversalErrorView onRetry={reset} /></body></html>;
}
