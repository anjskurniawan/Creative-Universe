/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorSwatch } from "./ColorSwatch";

const meta = { title: "Spectrum/ColorSwatch", component: ColorSwatch, parameters: { layout: "centered" } } satisfies Meta<typeof ColorSwatch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
