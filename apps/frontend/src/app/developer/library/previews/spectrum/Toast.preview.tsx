import { Button } from "@/components/spectrum/Button";
import { Toast, ToastQueue } from "@/components/spectrum/Toast";

export function SpectrumToastPreview() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6">
      <Toast placement="bottom" />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onPress={() => ToastQueue.neutral("A neutral message")}>Neutral</Button>
        <Button variant="primary" onPress={() => ToastQueue.positive("Your changes are saved")}>Positive</Button>
        <Button variant="negative" onPress={() => ToastQueue.negative("Something went wrong")}>Negative</Button>
      </div>
    </div>
  );
}
