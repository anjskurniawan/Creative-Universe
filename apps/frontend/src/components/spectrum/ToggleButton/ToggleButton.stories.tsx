/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleButton } from "./ToggleButton";

const meta = { title: "Spectrum/ToggleButton", component: ToggleButton, parameters: { layout: "centered" } } satisfies Meta<typeof ToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
