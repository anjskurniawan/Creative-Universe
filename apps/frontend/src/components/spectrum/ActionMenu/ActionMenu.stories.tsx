import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Copy from "@react-spectrum/s2/icons/Copy";
import Cut from "@react-spectrum/s2/icons/Cut";
import Paste from "@react-spectrum/s2/icons/Paste";
import { ActionMenu, Keyboard, MenuItem, Text, type ActionMenuProps } from "./ActionMenu";

const meta = {
  title: "Spectrum/ActionMenu",
  component: ActionMenu,
  parameters: { layout: "centered" },
  args: { children: null },
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function MenuItems() {
  return (
    <>
      <MenuItem textValue="Copy"><Copy /><Text slot="label">Copy</Text><Text slot="description">Copy the selected text</Text><Keyboard>⌘C</Keyboard></MenuItem>
      <MenuItem textValue="Cut"><Cut /><Text slot="label">Cut</Text><Text slot="description">Cut the selected text</Text><Keyboard>⌘X</Keyboard></MenuItem>
      <MenuItem textValue="Paste"><Paste /><Text slot="label">Paste</Text><Text slot="description">Paste the copied text</Text><Keyboard>⌘V</Keyboard></MenuItem>
    </>
  );
}

export const Default: Story = { render: () => <ActionMenu aria-label="More actions"><MenuItems /></ActionMenu> };
export const Quiet: Story = { args: { isQuiet: true }, render: (args: ActionMenuProps<object>) => <ActionMenu {...args} aria-label="More actions"><MenuItems /></ActionMenu> };
export const Disabled: Story = { args: { isDisabled: true }, render: (args: ActionMenuProps<object>) => <ActionMenu {...args} aria-label="More actions"><MenuItems /></ActionMenu> };
export const DisabledItems: Story = { render: () => <ActionMenu aria-label="More actions" disabledKeys={["paste"]}><MenuItems /></ActionMenu> };
export const Controlled: Story = { render: () => { const [isOpen, setIsOpen] = useState(false); return <ActionMenu aria-label="More actions" isOpen={isOpen} onOpenChange={setIsOpen}><MenuItems /></ActionMenu>; } };
