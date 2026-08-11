import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Spectrum/Badge",
  component: Badge,
  parameters: { layout: "centered", docs: { description: { component: "Badges show a small amount of color-categorized metadata." } } },
  args: { children: "New", variant: "neutral", fillStyle: "bold", size: "S" },
  argTypes: {
    variant: { control: "select", options: ["accent", "blue", "brown", "celery", "chartreuse", "cinnamon", "cyan", "fuchsia", "gray", "green", "indigo", "informative", "magenta", "negative", "neutral", "notice", "orange", "pink", "positive", "purple", "red", "seafoam", "silver", "turquoise", "yellow"] },
    fillStyle: { control: "select", options: ["bold", "outline", "subtle"] },
    overflowMode: { control: "select", options: ["truncate", "wrap"] },
    size: { control: "select", options: ["S", "M", "L", "XL"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SemanticPositive: Story = { args: { children: "Approved", variant: "positive" } };
export const SemanticNegative: Story = { args: { children: "Blocked", variant: "negative" } };
export const Outline: Story = { args: { children: "In review", variant: "notice", fillStyle: "outline" } };
export const Subtle: Story = { args: { children: "Draft", variant: "informative", fillStyle: "subtle" } };
export const Truncated: Story = { args: { children: "This is a very long badge label", overflowMode: "truncate", variant: "purple", size: "M" } };
