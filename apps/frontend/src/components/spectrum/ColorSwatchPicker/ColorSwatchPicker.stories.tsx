/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorSwatchPicker } from "./ColorSwatchPicker";
import { ColorSwatch } from "../ColorSwatch";

const meta = { title: "Spectrum/ColorSwatchPicker", component: ColorSwatchPicker, parameters: { layout: "centered" } } satisfies Meta<typeof ColorSwatchPicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { "aria-label": "Theme colors", children: <><ColorSwatch color="#ff0000" /><ColorSwatch color="#0000ff" /></> } as any };
