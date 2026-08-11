/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleButtonGroup } from "./ToggleButtonGroup";

const meta = { title: "Spectrum/ToggleButtonGroup", component: ToggleButtonGroup, parameters: { layout: "centered" } } satisfies Meta<typeof ToggleButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
