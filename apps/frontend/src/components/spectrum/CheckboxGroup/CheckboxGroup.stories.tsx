/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CheckboxGroup } from "./CheckboxGroup";

const meta = { title: "Spectrum/CheckboxGroup", component: CheckboxGroup, parameters: { layout: "centered" } } satisfies Meta<typeof CheckboxGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
