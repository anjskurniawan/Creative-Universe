import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  AssetCard,
  Card,
  CardPreview,
  Content,
  Image,
  ProductCard,
  Text,
  UserCard,
} from "./Card";

const previewImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%235d5ce2'/%3E%3Ccircle cx='480' cy='90' r='130' fill='%23a9e8ff' fill-opacity='.65'/%3E%3Cpath d='M0 285 170 145l125 95 95-75 250 195H0Z' fill='%23f5d76e'/%3E%3C/svg%3E";

const meta = {
  title: "Spectrum/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Cards summarize objects that users can select or navigate to, with composable preview, content, and footer sections.",
      },
    },
  },
  args: {
    children: null,
    textValue: "Project card",
  },
  argTypes: {
    size: { control: "select", options: ["XS", "S", "M", "L", "XL"] },
    density: { control: "select", options: ["compact", "regular", "spacious"] },
    variant: { control: "select", options: ["primary", "secondary", "tertiary", "quiet"] },
    isDisabled: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

function BasicCard() {
  return (
    <Card textValue="Project Aurora" size="M">
      <CardPreview><Image alt="Abstract purple and yellow landscape" src={previewImage} /></CardPreview>
      <Content>
        <Text slot="title">Project Aurora</Text>
        <Text slot="description">A concise project overview for the design team.</Text>
      </Content>
    </Card>
  );
}

export const Default: Story = { render: () => <BasicCard /> };

export const Quiet: Story = { args: { variant: "quiet" }, render: (args) => <Card {...args}><Content><Text slot="title">Quiet card</Text><Text slot="description">A lower emphasis card variant.</Text></Content></Card> };

export const Disabled: Story = { render: () => <Card textValue="Disabled project" isDisabled><Content><Text slot="title">Disabled project</Text><Text slot="description">This card cannot be selected.</Text></Content></Card> };

export const Linked: Story = { render: () => <Card textValue="Open project" href="/developer/playground"><Content><Text slot="title">Open Playground</Text><Text slot="description">Navigate to a project destination.</Text></Content></Card> };

export const Asset: Story = { render: () => <AssetCard textValue="Aurora asset"><CardPreview><Image alt="Aurora asset preview" src={previewImage} /></CardPreview><Content><Text slot="title">Aurora asset</Text><Text slot="description">PNG · 2/3/2025</Text></Content></AssetCard> };

export const User: Story = { render: () => <UserCard textValue="Simone Carter"><Content><Text slot="title">Simone Carter</Text><Text slot="description">Art Director at Luma Creative Studios.</Text></Content></UserCard> };

export const Product: Story = { render: () => <ProductCard textValue="Creative toolkit"><CardPreview><Image slot="preview" alt="Creative toolkit preview" src={previewImage} /></CardPreview><Content><Text slot="title">Creative toolkit</Text><Text slot="description">A complete set of design resources.</Text></Content></ProductCard> };
