/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorSlider } from "./ColorSlider";

const meta = { title: "Spectrum/ColorSlider", component: ColorSlider, parameters: { layout: "centered" } } satisfies Meta<typeof ColorSlider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { label: "Hue", channel: "hue", colorSpace: "hsl", defaultValue: "#ff0000" } as any };
