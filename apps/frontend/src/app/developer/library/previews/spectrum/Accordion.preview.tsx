import {
  Accordion,
  AccordionItem,
  AccordionItemPanel,
  AccordionItemTitle,
} from "@/components/spectrum/Accordion";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumAccordionPreview() {
  return (
    <PreviewWrapper width="md">
      <Accordion defaultExpandedKeys={["settings"]}>
        <AccordionItem id="settings">
          <AccordionItemTitle>Settings</AccordionItemTitle>
          <AccordionItemPanel>Application settings content.</AccordionItemPanel>
        </AccordionItem>
        <AccordionItem id="preferences">
          <AccordionItemTitle>Preferences</AccordionItemTitle>
          <AccordionItemPanel>User preferences content.</AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </PreviewWrapper>
  );
}
