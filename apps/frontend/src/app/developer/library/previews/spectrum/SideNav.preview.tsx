import { SideNav, SideNavItem, SideNavItemContent, SideNavItemLink, Text } from "@/components/spectrum/SideNav";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumSideNavPreview() {
  return <PreviewWrapper width="md"><SideNav aria-label="Files" selectedRoute="/guidelines" defaultExpandedKeys={["guidelines"]}><SideNavItem href="/guidelines" id="guidelines" textValue="Guidelines"><SideNavItemContent><SideNavItemLink><Text>Guidelines</Text></SideNavItemLink></SideNavItemContent><SideNavItem href="/style" id="style" textValue="Style"><SideNavItemContent><SideNavItemLink><Text>Style</Text></SideNavItemLink></SideNavItemContent></SideNavItem><SideNavItem href="/color" id="color" textValue="Color"><SideNavItemContent><SideNavItemLink><Text>Color</Text></SideNavItemLink></SideNavItemContent></SideNavItem></SideNavItem></SideNav></PreviewWrapper>;
}

