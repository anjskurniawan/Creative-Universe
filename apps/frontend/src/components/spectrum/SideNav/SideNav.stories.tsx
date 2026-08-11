import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SideNav, SideNavHeader, SideNavItem, SideNavItemContent, SideNavItemLink, SideNavSection, Text } from "./SideNav";

function StaticItems() {
  return <>
    <SideNavItem id="guidelines" href="/guidelines" textValue="Guidelines"><SideNavItemContent><SideNavItemLink><Text>Guidelines</Text></SideNavItemLink></SideNavItemContent>
      <SideNavItem id="style" href="/style" textValue="Style"><SideNavItemContent><SideNavItemLink><Text>Style</Text></SideNavItemLink></SideNavItemContent></SideNavItem>
      <SideNavItem id="color" href="/color" textValue="Color"><SideNavItemContent><SideNavItemLink><Text>Color</Text></SideNavItemLink></SideNavItemContent></SideNavItem>
    </SideNavItem>
    <SideNavItem id="support" textValue="Support"><SideNavItemContent><Text>Support</Text></SideNavItemContent>
      <SideNavItem id="contact" href="/contact-us" textValue="Contact Us"><SideNavItemContent><SideNavItemLink><Text>Contact Us</Text></SideNavItemLink></SideNavItemContent></SideNavItem>
    </SideNavItem>
  </>;
}

const meta = {
  title: "Spectrum/SideNav",
  component: SideNav,
  parameters: { layout: "centered", docs: { description: { component: "SideNav provides navigation through nested hierarchical links." } } },
  args: { children: null, "aria-label": "Files", selectedRoute: "/guidelines", defaultExpandedKeys: ["guidelines", "color"] },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <SideNav {...args}><StaticItems /></SideNav> };
export const WithSections: Story = { render: (args) => <SideNav {...args} selectedRoute="/files" defaultExpandedKeys={[]}><SideNavSection><SideNavHeader>Favorites</SideNavHeader><SideNavItem href="/applications" textValue="Applications"><SideNavItemContent><SideNavItemLink><Text>Applications</Text></SideNavItemLink></SideNavItemContent></SideNavItem></SideNavSection><SideNavSection><SideNavHeader>Workspaces</SideNavHeader><SideNavItem href="/files" textValue="Files"><SideNavItemContent><SideNavItemLink><Text>Files</Text></SideNavItemLink></SideNavItemContent></SideNavItem></SideNavSection></SideNav> };
export const DisabledItems: Story = { render: (args) => <SideNav {...args} disabledKeys={["support"]}><StaticItems /></SideNav> };
