/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./Switch";

const meta = { title: "Spectrum/Switch", component: Switch, parameters: { layout: "centered" } } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
