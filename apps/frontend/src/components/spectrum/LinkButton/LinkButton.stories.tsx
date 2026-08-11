import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkButton } from "./LinkButton";

const meta = { title: "Spectrum/LinkButton", component: LinkButton, args: { children: "Open project", href: "#project" } } satisfies Meta<typeof LinkButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
export const Disabled: Story = { args: { isDisabled: true } };
