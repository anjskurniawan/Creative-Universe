import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ActionBar, ActionButton } from "./ActionBar";

const meta = {
  title: "Spectrum/ActionBar",
  component: ActionBar,
  parameters: { layout: "centered", docs: { description: { component: "Action bars support single and bulk selection patterns when users need to perform actions on one or more items at the same time." } } },
  args: { selectedItemCount: 2, children: null },
  argTypes: {
    selectedItemCount: { control: "number", description: "The number of selected items linked to the ActionBar. The bar is hidden when this is 0." },
    isEmphasized: { control: "boolean", description: "Whether the ActionBar uses the emphasized style." },
    onClearSelection: { action: "clear selection", description: "Handler called when the clear-selection button is pressed." },
  },
  render: (args) => <ActionBar {...args}><ActionButton aria-label="Edit">Edit</ActionButton><ActionButton aria-label="Copy">Copy</ActionButton><ActionButton aria-label="Delete">Delete</ActionButton></ActionBar>,
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Emphasized: Story = { args: { isEmphasized: true, selectedItemCount: 4 } };
export const AllItemsSelected: Story = { args: { selectedItemCount: "all" } };

function ControlledSelectionExample() {
  const [selectedItemCount, setSelectedItemCount] = useState<number | "all">(3);
  return <ActionBar selectedItemCount={selectedItemCount} onClearSelection={() => setSelectedItemCount(0)}><ActionButton aria-label="Archive" onPress={() => setSelectedItemCount(0)}>Archive</ActionButton><ActionButton aria-label="Share">Share</ActionButton></ActionBar>;
}

export const ControlledClearSelection: Story = { render: () => <ControlledSelectionExample /> };
