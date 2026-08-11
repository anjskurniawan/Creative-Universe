import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SettingTitle } from "./SettingTitle";

const meta = {
  title: "Spectrum/Settings/SettingTitle",
  component: SettingTitle,
  parameters: { docs: { description: { component: "A Spectrum-styled heading used as the title for Settings pages." } } },
  args: { title: "Authentication" },
} satisfies Meta<typeof SettingTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongTitle: Story = { args: { title: "Security and authentication settings" } };
export const WithSubtitle: Story = { args: { title: "Authentication", subtitle: "Manage how your account verifies identity and access." } };
