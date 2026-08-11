/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressCircle } from "./ProgressCircle";

const meta = { title: "Spectrum/ProgressCircle", component: ProgressCircle, parameters: { layout: "centered" } } satisfies Meta<typeof ProgressCircle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
