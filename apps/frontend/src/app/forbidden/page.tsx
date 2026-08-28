import { UniversalErrorView } from "@/components/feedback/UniversalErrorView";

export default function ForbiddenPage() {
  return <UniversalErrorView errorKind="forbidden" />;
}
