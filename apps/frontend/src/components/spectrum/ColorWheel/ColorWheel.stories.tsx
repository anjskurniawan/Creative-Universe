/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorWheel } from "./ColorWheel";

const meta = { title: "Spectrum/ColorWheel", component: ColorWheel, parameters: { layout: "centered" } } satisfies Meta<typeof ColorWheel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
