import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/spectrum/Button";
import { Toast, ToastQueue } from "./Toast";

const meta = {
  title: "Spectrum/Toast",
  component: Toast,
  parameters: { layout: "fullscreen" },
  args: { placement: "bottom" },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6">
      <Toast {...args} />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onPress={() => ToastQueue.neutral("Toast available")}>Show Neutral Toast</Button>
        <Button variant="primary" onPress={() => ToastQueue.positive("Toast is done!")}>Show Positive Toast</Button>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6">
      <Toast {...args} />
      <div className="flex flex-wrap gap-3">
        <Button variant="negative" onPress={() => ToastQueue.negative("Toast is burned!")}>Show Negative Toast</Button>
        <Button variant="accent" onPress={() => ToastQueue.info("Toasting…")}>Show Info Toast</Button>
      </div>
    </div>
  ),
};

export const Actionable: Story = {
  render: (args) => (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6">
      <Toast {...args} />
      <Button onPress={() => ToastQueue.info("An update is available", { actionLabel: "Update", onAction: () => {}, shouldCloseOnAction: true })}>Show Actionable Toast</Button>
    </div>
  ),
};
