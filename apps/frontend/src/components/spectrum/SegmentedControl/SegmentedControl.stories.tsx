/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SegmentedControl } from "./SegmentedControl";

const meta = { title: "Spectrum/SegmentedControl", component: SegmentedControl, parameters: { layout: "centered" } } satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
