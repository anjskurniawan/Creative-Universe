import OddsTaskDetailView from "@/features/odds/components/OddsTaskDetail/OddsTaskDetail";
import { DummyOddsDetailProvider } from "./_components/DummyOddsDetailProvider/DummyOddsDetailProvider";

export default function DummyOddsDetailRoute() {
  return (
    <DummyOddsDetailProvider>
      <OddsTaskDetailView />
    </DummyOddsDetailProvider>
  );
}
