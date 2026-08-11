/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonGroup } from "./ButtonGroup";

const meta = { title: "Spectrum/ButtonGroup", component: ButtonGroup, parameters: { layout: "centered" } } satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
