/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Link } from "./Link";

const meta = { title: "Spectrum/Link", component: Link, parameters: { layout: "centered" } } satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
