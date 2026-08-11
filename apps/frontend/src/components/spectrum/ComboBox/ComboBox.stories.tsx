import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ComboBox, ComboBoxItem, ComboBoxSection, Header, Heading, Text } from "./ComboBox";

const meta = {
  title: "Spectrum/ComboBox",
  component: ComboBox,
  parameters: { docs: { description: { component: "ComboBox allows users to choose a single option from a collapsible list." } } },
  args: { label: "Favorite fruit", placeholder: "Select a fruit" },
} satisfies Meta<typeof ComboBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: (args) => (
    <ComboBox {...args}>
      <ComboBoxItem id="apple">Apple</ComboBoxItem>
      <ComboBoxItem id="banana">Banana</ComboBoxItem>
      <ComboBoxItem id="orange">Orange</ComboBoxItem>
    </ComboBox>
  ),
};

export const WithDescriptions: Story = {
  args: { children: null },
  render: (args) => (
    <ComboBox {...args} label="Permission" defaultSelectedKey="read">
      <ComboBoxItem id="read" textValue="Read"><Text slot="label">Read</Text><Text slot="description">Comment only</Text></ComboBoxItem>
      <ComboBoxItem id="write" textValue="Write"><Text slot="label">Write</Text><Text slot="description">Read and write</Text></ComboBoxItem>
    </ComboBox>
  ),
};

export const WithSections: Story = {
  args: { children: null },
  render: (args) => (
    <ComboBox {...args} label="Fruit or vegetable">
      <ComboBoxSection>
        <Header><Heading>Fruit</Heading><Text slot="description">Sweet and nutritious</Text></Header>
        <ComboBoxItem id="apple">Apple</ComboBoxItem>
        <ComboBoxItem id="banana">Banana</ComboBoxItem>
      </ComboBoxSection>
      <ComboBoxSection>
        <Header><Heading>Vegetable</Heading></Header>
        <ComboBoxItem id="carrot">Carrot</ComboBoxItem>
        <ComboBoxItem id="spinach">Spinach</ComboBoxItem>
      </ComboBoxSection>
    </ComboBox>
  ),
};

export const Disabled: Story = {
  args: { children: null, isDisabled: true },
  render: (args) => <ComboBox {...args}><ComboBoxItem id="one">Unavailable</ComboBoxItem></ComboBox>,
};
