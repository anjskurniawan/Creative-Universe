import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const avatarSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23ba0dcb'/%3E%3Ccircle cx='48' cy='38' r='16' fill='white'/%3E%3Cpath d='M20 82c3-17 14-25 28-25s25 8 28 25' fill='white'/%3E%3C/svg%3E";

const meta = {
  title: "Spectrum/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: { description: { component: "Avatars are thumbnail representations of users or organizations." } },
  },
  args: { alt: "Creative Universe user", src: avatarSrc, size: 48 },
  argTypes: {
    size: { control: "select", options: [16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 112] },
    isOverBackground: { control: { type: "boolean" } },
    src: { control: "text" },
    alt: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 24 } };
export const Large: Story = { args: { size: 96 } };
export const OverBackground: Story = { args: { isOverBackground: true, size: 64 } };
export const WithoutImage: Story = { args: { src: undefined, alt: "Avatar without an image", size: 48 } };
