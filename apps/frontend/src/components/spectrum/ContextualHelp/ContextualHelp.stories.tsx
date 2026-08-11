/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContextualHelp } from "./ContextualHelp";

const meta = { title: "Spectrum/ContextualHelp", component: ContextualHelp, parameters: { layout: "centered" } } satisfies Meta<typeof ContextualHelp>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
