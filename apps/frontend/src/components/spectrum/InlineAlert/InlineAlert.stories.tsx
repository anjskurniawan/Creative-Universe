import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content, Heading, InlineAlert } from "./InlineAlert";

const meta = {
  title: "Spectrum/InlineAlert",
  component: InlineAlert,
  parameters: { docs: { description: { component: "Inline alerts display non-modal feedback associated with objects in a view." } } },
  args: { variant: "neutral", fillStyle: "border", children: null },
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <InlineAlert {...args}><Heading>Payment Information</Heading><Content>Enter your billing address, shipping address, and payment method to complete your purchase.</Content></InlineAlert> };
export const Negative: Story = { args: { variant: "negative", fillStyle: "subtleFill", children: null }, render: (args) => <InlineAlert {...args}><Heading>Error</Heading><Content>There was an error processing your request. Please try again.</Content></InlineAlert> };
export const Positive: Story = { args: { variant: "positive", fillStyle: "boldFill", children: null }, render: (args) => <InlineAlert {...args}><Heading>Saved</Heading><Content>Your changes were saved successfully.</Content></InlineAlert> };
