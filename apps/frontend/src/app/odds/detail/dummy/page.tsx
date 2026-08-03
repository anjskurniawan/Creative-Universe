import OddsTaskDetailView from "@/features/odds/components/task-detail/odds-task-detail-view";
import { DummyOddsDetailProvider } from "./dummy-odds-detail-provider";

export default function DummyOddsDetailRoute() {
  return (
    <DummyOddsDetailProvider>
      <OddsTaskDetailView />
    </DummyOddsDetailProvider>
  );
}
