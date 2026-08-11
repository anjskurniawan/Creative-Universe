/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LabeledValue } from "./LabeledValue";

const meta = { title: "Spectrum/LabeledValue", component: LabeledValue, parameters: { layout: "centered" } } satisfies Meta<typeof LabeledValue>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
