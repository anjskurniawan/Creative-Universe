/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TimeField } from "./TimeField";

const meta = { title: "Spectrum/TimeField", component: TimeField, parameters: { layout: "centered" } } satisfies Meta<typeof TimeField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
