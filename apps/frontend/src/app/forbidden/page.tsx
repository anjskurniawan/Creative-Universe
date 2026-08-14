import { UniversalErrorView } from "@/components/feedback/universal-error-view";

export default function ForbiddenPage() {
  return <UniversalErrorView errorKind="forbidden" />;
}
