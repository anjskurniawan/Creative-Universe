/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateField } from "./DateField";

const meta = { title: "Spectrum/DateField", component: DateField, parameters: { layout: "centered" } } satisfies Meta<typeof DateField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
