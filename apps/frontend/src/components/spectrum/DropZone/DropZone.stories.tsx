/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropZone } from "./DropZone";

const meta = { title: "Spectrum/DropZone", component: DropZone, parameters: { layout: "centered" } } satisfies Meta<typeof DropZone>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
