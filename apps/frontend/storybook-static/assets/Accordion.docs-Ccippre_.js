import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-BDwG_xnH.js";import{i as n,r}from"./react-k3YPvb47.js";import{a as i,c as a,d as o,f as s,i as c,l,p as u,u as d}from"./blocks-C98eu2cZ.js";import{n as f,t as p}from"./Accordion.stories-kPZUgRg0.js";function m(e){let t={code:`code`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(a,{of:p}),`
`,(0,g.jsx)(s,{}),`
`,(0,g.jsx)(i,{children:(0,g.jsx)(t.p,{children:`An accordion is a container for multiple accordion items. Import it from the Creative Universe
Spectrum wrapper to receive Spectrum styling, color scheme support, and Adobe Clean typography
automatically.`})}),`
`,(0,g.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import {
Accordion,
AccordionItem,
AccordionItemPanel,
AccordionItemTitle,
} from "@/components/spectrum/Accordion";

<Accordion>
<AccordionItem id="personal">
  <AccordionItemTitle>Personal Information</AccordionItemTitle>
  <AccordionItemPanel>Personal information form here.</AccordionItemPanel>
</AccordionItem>
<AccordionItem id="billing">
  <AccordionItemTitle>Billing Address</AccordionItemTitle>
  <AccordionItemPanel>Billing address form here.</AccordionItemPanel>
</AccordionItem>
</Accordion>`}),`
`,(0,g.jsx)(l,{}),`
`,(0,g.jsx)(t.h2,{id:`expanding`,children:`Expanding`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`defaultExpandedKeys`}),` for the initial uncontrolled state. Use `,(0,g.jsx)(t.code,{children:`expandedKeys`}),` with `,(0,g.jsx)(t.code,{children:`onExpandedChange`}),` to control which items are open. The expanded keys correspond to each `,(0,g.jsx)(t.code,{children:`AccordionItem`}),` `,(0,g.jsx)(t.code,{children:`id`}),`.`]}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import { useState } from "react";
import {
Accordion,
AccordionItem,
AccordionItemPanel,
AccordionItemTitle,
type Key,
} from "@/components/spectrum/Accordion";

function Example() {
const [expandedKeys, setExpandedKeys] = useState(new Set<Key>(["settings"]));

return (
<Accordion expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
<AccordionItem id="settings">
<AccordionItemTitle>Settings</AccordionItemTitle>
<AccordionItemPanel>Application settings content.</AccordionItemPanel>
</AccordionItem>
</Accordion>
);
}`}),`
`,(0,g.jsxs)(t.p,{children:[`Set `,(0,g.jsx)(t.code,{children:`allowsMultipleExpanded`}),` when several items may stay open at the same time.`]}),`
`,(0,g.jsx)(t.h2,{id:`content`,children:`Content`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`AccordionItemHeader`}),` to add elements next to an item title, such as icons or action buttons.`]}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import { ActionButton } from "@react-spectrum/s2/ActionButton";
import {
Accordion,
AccordionItem,
AccordionItemHeader,
AccordionItemPanel,
AccordionItemTitle,
} from "@/components/spectrum/Accordion";

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
</Accordion>`}),`
`,(0,g.jsx)(o,{title:`Examples`,include:[`Controlled`,`MultipleExpanded`,`WithHeaderActions`]}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`<Accordion>
  <AccordionItem>
    <AccordionItemHeader>
      <AccordionItemTitle />
    </AccordionItemHeader>
    <AccordionItemPanel />
  </AccordionItem>
</Accordion>
`})}),`
`,(0,g.jsx)(t.h3,{id:`accordion`,children:`Accordion`}),`
`,(0,g.jsxs)(t.p,{children:[`| Name                                | Type                             | Default   | Description                                                        |
| ----------------------------------- | -------------------------------- | --------- | ------------------------------------------------------------------ |
| `,(0,g.jsx)(t.code,{children:`allowsMultipleExpanded`}),`            | `,(0,g.jsx)(t.code,{children:`boolean`}),`                        | —         | Whether multiple accordion items can be expanded at the same time. |
| `,(0,g.jsx)(t.code,{children:`defaultExpandedKeys`}),`               | `,(0,g.jsx)(t.code,{children:`Iterable<Key>`}),`                  | —         | The initial expanded keys in the uncontrolled state.               |
| `,(0,g.jsx)(t.code,{children:`expandedKeys`}),`                      | `,(0,g.jsx)(t.code,{children:`Iterable<Key>`}),`                  | —         | The currently expanded keys in the controlled state.               |
| `,(0,g.jsx)(t.code,{children:`onExpandedChange`}),`                  | `,(0,g.jsx)(t.code,{children:`(keys: Set<Key>) => void`}),`       | —         | Called when accordion items are expanded or collapsed.             |
| `,(0,g.jsx)(t.code,{children:`density`}),`                           | `,(0,g.jsx)(t.code,{children:`compact \\| regular \\| spacious`}),` | `,(0,g.jsx)(t.code,{children:`regular`}),` | The amount of space between accordion items.                       |
| `,(0,g.jsx)(t.code,{children:`size`}),`                              | `,(0,g.jsx)(t.code,{children:`S \\| M \\| L \\| XL`}),`              | `,(0,g.jsx)(t.code,{children:`M`}),`       | The size of the accordion.                                         |
| `,(0,g.jsx)(t.code,{children:`isDisabled`}),`                        | `,(0,g.jsx)(t.code,{children:`boolean`}),`                        | `,(0,g.jsx)(t.code,{children:`false`}),`   | Whether all accordion items are disabled.                          |
| `,(0,g.jsx)(t.code,{children:`isQuiet`}),`                           | `,(0,g.jsx)(t.code,{children:`boolean`}),`                        | `,(0,g.jsx)(t.code,{children:`false`}),`   | Whether the accordion uses a quiet style.                          |
| `,(0,g.jsx)(t.code,{children:`styles`}),`                            | `,(0,g.jsx)(t.code,{children:`StylesPropWithHeight`}),`           | —         | Spectrum-defined styles returned by the style macro.               |
| `,(0,g.jsx)(t.code,{children:`UNSAFE_className`}),` / `,(0,g.jsx)(t.code,{children:`UNSAFE_style`}),` | `,(0,g.jsx)(t.code,{children:`string`}),` / `,(0,g.jsx)(t.code,{children:`CSSProperties`}),`       | —         | Last-resort custom CSS escape hatches.                             |`]}),`
`,(0,g.jsx)(t.h3,{id:`accordionitem`,children:`AccordionItem`}),`
`,(0,g.jsxs)(t.p,{children:[`| Name                         | Type                            | Default   | Description                                       |
| ---------------------------- | ------------------------------- | --------- | ------------------------------------------------- |
| `,(0,g.jsx)(t.code,{children:`id`}),`                         | `,(0,g.jsx)(t.code,{children:`Key`}),`                           | —         | Identifier that matches `,(0,g.jsx)(t.code,{children:`expandedKeys`}),`.           |
| `,(0,g.jsx)(t.code,{children:`defaultExpanded`}),`            | `,(0,g.jsx)(t.code,{children:`boolean`}),`                       | `,(0,g.jsx)(t.code,{children:`false`}),`   | Whether the item is initially expanded.           |
| `,(0,g.jsx)(t.code,{children:`isExpanded`}),`                 | `,(0,g.jsx)(t.code,{children:`boolean`}),`                       | —         | Controlled expanded state for an individual item. |
| `,(0,g.jsx)(t.code,{children:`onExpandedChange`}),`           | `,(0,g.jsx)(t.code,{children:`(isExpanded: boolean) => void`}),` | —         | Called when the item changes expanded state.      |
| `,(0,g.jsx)(t.code,{children:`isDisabled`}),`                 | `,(0,g.jsx)(t.code,{children:`boolean`}),`                       | `,(0,g.jsx)(t.code,{children:`false`}),`   | Whether the item is disabled.                     |
| `,(0,g.jsx)(t.code,{children:`density`}),`, `,(0,g.jsx)(t.code,{children:`size`}),`, `,(0,g.jsx)(t.code,{children:`isQuiet`}),` | —                               | Inherited | Item-level display options.                       |`]}),`
`,(0,g.jsx)(t.h3,{id:`accordionitemheader-and-accordionitemtitle`,children:`AccordionItemHeader and AccordionItemTitle`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`AccordionItemHeader`}),` accepts the header content. `,(0,g.jsx)(t.code,{children:`AccordionItemTitle`}),` renders the item heading and accepts `,(0,g.jsx)(t.code,{children:`level`}),`, which defaults to `,(0,g.jsx)(t.code,{children:`3`}),`. Both also support `,(0,g.jsx)(t.code,{children:`id`}),`, `,(0,g.jsx)(t.code,{children:`UNSAFE_className`}),`, and `,(0,g.jsx)(t.code,{children:`UNSAFE_style`}),`.`]}),`
`,(0,g.jsx)(t.h3,{id:`accordionitempanel`,children:`AccordionItemPanel`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`AccordionItemPanel`}),` contains the expandable content. It supports standard accessibility labels and `,(0,g.jsx)(t.code,{children:`role`}),`, which defaults to `,(0,g.jsx)(t.code,{children:`group`}),`; use `,(0,g.jsx)(t.code,{children:`region`}),` when the panel needs a landmark role.`]}),`
`,(0,g.jsx)(t.h2,{id:`controls`,children:`Controls`}),`
`,(0,g.jsxs)(t.p,{children:[`Use the Storybook Controls panel to QA `,(0,g.jsx)(t.code,{children:`allowsMultipleExpanded`}),`, `,(0,g.jsx)(t.code,{children:`density`}),`, `,(0,g.jsx)(t.code,{children:`isDisabled`}),`, `,(0,g.jsx)(t.code,{children:`isQuiet`}),`, and `,(0,g.jsx)(t.code,{children:`size`}),`.`]}),`
`,(0,g.jsx)(c,{})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=t(),r(),u(),f()})))()}_();export{h as default};