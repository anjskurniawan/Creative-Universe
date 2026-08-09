import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionButton } from "@react-spectrum/s2/ActionButton";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemPanel,
  AccordionItemTitle,
  type AccordionProps,
  type Key,
} from "./Accordion";

function SettingsAccordion(props: Partial<AccordionProps>) {
  return (
    <Accordion {...props}>
      <AccordionItem id="settings">
        <AccordionItemTitle>Settings</AccordionItemTitle>
        <AccordionItemPanel>Application settings content.</AccordionItemPanel>
      </AccordionItem>
      <AccordionItem id="preferences">
        <AccordionItemTitle>Preferences</AccordionItemTitle>
        <AccordionItemPanel>User preferences content.</AccordionItemPanel>
      </AccordionItem>
      <AccordionItem id="advanced">
        <AccordionItemTitle>Advanced</AccordionItemTitle>
        <AccordionItemPanel>Advanced configuration options.</AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}

const meta = {
  title: "Spectrum/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A container for multiple expandable accordion items.",
      },
    },
  },
  args: {
    children: null,
  },
  argTypes: {
    allowsMultipleExpanded: {
      control: "boolean",
      description: "Whether multiple accordion items can be expanded at the same time.",
    },
    density: {
      control: "select",
      options: ["compact", "regular", "spacious"],
      description: "The amount of space between accordion items.",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether all accordion items are disabled.",
    },
    isQuiet: {
      control: "boolean",
      description: "Whether the accordion is displayed with a quiet style.",
    },
    size: {
      control: "select",
      options: ["S", "M", "L", "XL"],
      description: "The size of the accordion.",
    },
  },
  render: (args) => <SettingsAccordion {...args} />,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultExpandedKeys: ["settings"],
  },
};

export const MultipleExpanded: Story = {
  args: {
    allowsMultipleExpanded: true,
    defaultExpandedKeys: ["settings", "preferences"],
  },
};

function ControlledAccordionExample() {
  const [expandedKeys, setExpandedKeys] = useState(new Set<Key>(["settings"]));

  return <SettingsAccordion expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys} />;
}

export const Controlled: Story = {
  render: () => <ControlledAccordionExample />,
};

export const WithHeaderActions: Story = {
  render: () => (
    <Accordion>
      <AccordionItem id="project">
        <AccordionItemHeader>
          <AccordionItemTitle>Project Settings</AccordionItemTitle>
          <ActionButton aria-label="Edit project settings">Edit</ActionButton>
        </AccordionItemHeader>
        <AccordionItemPanel>
          Configure your project settings including name, description, and permissions.
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem id="preferences">
        <AccordionItemTitle>Preferences</AccordionItemTitle>
        <AccordionItemPanel>User preferences content.</AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  ),
};
