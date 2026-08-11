/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Form } from "./Form";

const meta = { title: "Spectrum/Form", component: Form, parameters: { layout: "centered" } } satisfies Meta<typeof Form>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { children: "Preview", channel: "hue", isLoading: false } as any };
