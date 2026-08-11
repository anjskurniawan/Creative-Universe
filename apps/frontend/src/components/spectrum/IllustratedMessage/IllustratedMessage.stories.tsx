/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IllustratedMessage } from "./IllustratedMessage";

const meta = { title: "Spectrum/IllustratedMessage", component: IllustratedMessage, parameters: { layout: "centered" } } satisfies Meta<typeof IllustratedMessage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
