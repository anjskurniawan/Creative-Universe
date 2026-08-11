/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RangeSlider } from "./RangeSlider";

const meta = { title: "Spectrum/RangeSlider", component: RangeSlider, parameters: { layout: "centered" } } satisfies Meta<typeof RangeSlider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
