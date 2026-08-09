"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  Accordion as SpectrumAccordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemPanel,
  AccordionItemTitle,
  type AccordionItemHeaderProps,
  type AccordionItemPanelProps,
  type AccordionItemProps,
  type AccordionItemRenderProps,
  type AccordionItemState,
  type AccordionItemTitleProps,
  type AccordionProps,
  type Key,
} from "@react-spectrum/s2/Accordion";

export {
  AccordionItem,
  AccordionItemHeader,
  AccordionItemPanel,
  AccordionItemTitle,
};
export type {
  AccordionItemHeaderProps,
  AccordionItemPanelProps,
  AccordionItemProps,
  AccordionItemRenderProps,
  AccordionItemState,
  AccordionItemTitleProps,
  AccordionProps,
  Key,
};

type SpectrumAccordionRef = ComponentRef<typeof SpectrumAccordion>;

export const Accordion = forwardRef<SpectrumAccordionRef, AccordionProps>(function Accordion(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumAccordion {...props} ref={ref} />
    </div>
  );
});
