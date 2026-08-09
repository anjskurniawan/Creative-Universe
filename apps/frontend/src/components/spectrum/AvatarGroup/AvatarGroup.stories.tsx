import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarGroup } from "./AvatarGroup";

const avatarSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23ba0dcb'/%3E%3Ccircle cx='48' cy='38' r='16' fill='white'/%3E%3Cpath d='M20 82c3-17 14-25 28-25s25 8 28 25' fill='white'/%3E%3C/svg%3E";

function GroupAvatars() {
  return <><Avatar alt="Abraham Baker" src={avatarSrc} /><Avatar alt="Adriana Sullivan" src={avatarSrc} /><Avatar alt="Jonathan Kelly" src={avatarSrc} /><Avatar alt="Zara Bush" src={avatarSrc} /></>;
}

const meta = {
  title: "Spectrum/AvatarGroup",
  component: AvatarGroup,
  parameters: { layout: "centered", docs: { description: { component: "Avatar groups display related people or entities together." } } },
  args: { label: "Project members", size: 32, children: null },
  argTypes: {
    label: { control: "text" },
    size: { control: "select", options: [16, 20, 24, 28, 32, 36, 40] },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <AvatarGroup {...args}><GroupAvatars /></AvatarGroup> };
export const Small: Story = { args: { size: 20 }, render: (args) => <AvatarGroup {...args}><GroupAvatars /></AvatarGroup> };
export const Large: Story = { args: { size: 40 }, render: (args) => <AvatarGroup {...args}><GroupAvatars /></AvatarGroup> };
export const TwoMembers: Story = { render: (args) => <AvatarGroup {...args}><Avatar alt="Abraham Baker" src={avatarSrc} /><Avatar alt="Adriana Sullivan" src={avatarSrc} /></AvatarGroup> };

