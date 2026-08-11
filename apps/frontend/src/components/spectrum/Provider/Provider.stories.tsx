/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Provider } from "./Provider";

const meta = { title: "Spectrum/Provider", component: Provider, parameters: { layout: "centered" } } satisfies Meta<typeof Provider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
