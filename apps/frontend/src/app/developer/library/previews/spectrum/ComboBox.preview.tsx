import { ComboBox, ComboBoxItem, ComboBoxSection, Header, Heading, Text } from "@/components/spectrum/ComboBox";

export function SpectrumComboBoxPreview() {
  return (
    <ComboBox label="Choose a workspace" placeholder="Select a workspace" defaultSelectedKey="design">
      <ComboBoxSection>
        <Header><Heading>Teams</Heading><Text slot="description">Available workspaces</Text></Header>
        <ComboBoxItem id="design">Design</ComboBoxItem>
        <ComboBoxItem id="research">Research</ComboBoxItem>
      </ComboBoxSection>
      <ComboBoxSection>
        <Header><Heading>Personal</Heading></Header>
        <ComboBoxItem id="drafts">Drafts</ComboBoxItem>
      </ComboBoxSection>
    </ComboBox>
  );
}
