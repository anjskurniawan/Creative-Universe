/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorArea } from "./ColorArea";

const meta = { title: "Spectrum/ColorArea", component: ColorArea, parameters: { layout: "centered" } } satisfies Meta<typeof ColorArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
