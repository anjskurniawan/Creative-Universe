/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorField } from "./ColorField";

const meta = { title: "Spectrum/ColorField", component: ColorField, parameters: { layout: "centered" } } satisfies Meta<typeof ColorField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { label: "Color", defaultValue: "#ff0000" } as any };
