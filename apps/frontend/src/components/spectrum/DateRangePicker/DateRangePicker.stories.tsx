/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DateRangePicker } from "./DateRangePicker";

const meta = { title: "Spectrum/DateRangePicker", component: DateRangePicker, parameters: { layout: "centered" } } satisfies Meta<typeof DateRangePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
