import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Cut from "@react-spectrum/s2/icons/Cut";
import { ActionButton } from "./ActionButton";

const meta = {
  title: "Spectrum/ActionButton",
  component: ActionButton,
  parameters: {
    layout: "centered",
    docs: { description: { component: "ActionButtons allow users to perform an action with a quiet, task-focused visual treatment." } },
  },
  args: { children: "Edit" },
  argTypes: {
    isDisabled: { control: "boolean", description: "Whether the button is disabled." },
    isPending: { control: "boolean", description: "Whether the button is in a pending state." },
    isQuiet: { control: "boolean", description: "Whether the button uses the quiet style." },
    size: { control: "select", options: ["XS", "S", "M", "L", "XL"], description: "Size of the ActionButton." },
    staticColor: { control: "select", options: ["auto", "black", "white"], description: "Static color style over a color background." },
    onPress: { action: "pressed", description: "Handler called when the press is released over the target." },
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { render: () => <ActionButton aria-label="Cut"><Cut />Cut</ActionButton> };
export const Quiet: Story = { args: { isQuiet: true } };
export const Disabled: Story = { args: { isDisabled: true } };
export const Pending: Story = { args: { isPending: true, children: "Saving" } };

function PendingExample() {
  const [isPending, setPending] = useState(false);
  return <ActionButton isPending={isPending} onPress={() => { setPending(true); window.setTimeout(() => setPending(false), 1000); }}>Save</ActionButton>;
}

export const InteractivePending: Story = { render: () => <PendingExample /> };
