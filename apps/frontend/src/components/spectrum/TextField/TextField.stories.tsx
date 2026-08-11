import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { TextField } from "./TextField";

const meta = {
  title: "Spectrum/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "TextField is a keyboard text input with labels, descriptions, validation, and optional prefix content.",
      },
    },
  },
  args: {
    label: "Name",
    placeholder: "Enter your full name",
  },
  argTypes: {
    size: { control: "select", options: ["S", "M", "L", "XL"] },
    labelPosition: { control: "select", options: ["top", "side"] },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isRequired: { control: "boolean" },
    isInvalid: { control: "boolean" },
    type: { control: "select", options: ["text", "email", "password", "search", "tel", "url"] },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    label: "Email",
    description: "We will only use this address for account notifications.",
    placeholder: "you@example.com",
    type: "email",
  },
};

export const Required: Story = {
  args: {
    label: "Username",
    isRequired: true,
    necessityIndicator: "label",
  },
};

export const Invalid: Story = {
  args: {
    label: "Website",
    value: "not-a-url",
    type: "url",
    isInvalid: true,
    errorMessage: "Enter a valid website URL.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Account ID",
    defaultValue: "CU-0001",
    isDisabled: true,
  },
};

export const WithPrefix: Story = {
  args: {
    label: "Website",
    prefix: "https://",
    placeholder: "example.com",
  },
};

function ControlledTextFieldExample() {
  const [value, setValue] = useState("");

  return (
    <div className="flex min-w-[280px] flex-col gap-3">
      <TextField label="Name" value={value} onChange={setValue} />
      <span>Current value: {value || "(empty)"}</span>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledTextFieldExample /> };
