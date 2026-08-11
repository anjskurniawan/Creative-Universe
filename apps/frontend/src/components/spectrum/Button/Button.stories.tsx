import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Spectrum/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Continue",
    onPress: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const VariantsAndSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" size="S">Small</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="secondary" fillStyle="outline" size="L">Outline</Button>
      <Button variant="negative" size="XL">Delete</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

function PendingButtonExample() {
  const [isPending, setPending] = useState(false);

  return (
    <Button
      isPending={isPending}
      onPress={() => {
        setPending(true);
        window.setTimeout(() => setPending(false), 1500);
      }}
      variant="primary"
    >
      Save
    </Button>
  );
}

export const Pending: Story = {
  render: () => <PendingButtonExample />,
};

export const PressEvents: Story = {
  render: () => <Button onPress={() => window.alert("Pressed")}>Press me</Button>,
};
