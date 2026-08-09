import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Cut from "@react-spectrum/s2/icons/Cut";
import Copy from "@react-spectrum/s2/icons/Copy";
import Paste from "@react-spectrum/s2/icons/Paste";
import { ActionButtonGroup, ActionButton, Text } from "./ActionButtonGroup";

function Actions() {
  return (
    <>
      <ActionButton aria-label="Cut"><Cut /><Text>Cut</Text></ActionButton>
      <ActionButton aria-label="Copy"><Copy /><Text>Copy</Text></ActionButton>
      <ActionButton aria-label="Paste"><Paste /><Text>Paste</Text></ActionButton>
    </>
  );
}

const meta = {
  title: "Spectrum/ActionButtonGroup",
  component: ActionButtonGroup,
  parameters: {
    layout: "centered",
    docs: { description: { component: "An ActionButtonGroup is a grouping of related ActionButtons." } },
  },
  args: { children: null },
  argTypes: {
    density: { control: "select", options: ["compact", "regular"], description: "Spacing between the buttons." },
    isDisabled: { control: "boolean", description: "Whether the group is disabled." },
    isJustified: { control: "boolean", description: "Whether buttons divide the container width equally." },
    isQuiet: { control: "boolean", description: "Whether the group uses the quiet style." },
    orientation: { control: "select", options: ["horizontal", "vertical"], description: "The axis the group should align with." },
    size: { control: "select", options: ["XS", "S", "M", "L", "XL"], description: "Size of the buttons." },
    staticColor: { control: "select", options: ["auto", "black", "white"], description: "Static color used over a color background." },
  },
  render: (args) => <ActionButtonGroup {...args}><Actions /></ActionButtonGroup>,
} satisfies Meta<typeof ActionButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const Compact: Story = { args: { density: "compact", size: "S" } };
export const Justified: Story = { args: { isJustified: true } };
export const Disabled: Story = { args: { isDisabled: true } };
export const Quiet: Story = { args: { isQuiet: true } };
