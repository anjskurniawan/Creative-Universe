/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RangeCalendar } from "./RangeCalendar";

const meta = { title: "Spectrum/RangeCalendar", component: RangeCalendar, parameters: { layout: "centered" } } satisfies Meta<typeof RangeCalendar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
