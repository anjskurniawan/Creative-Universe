import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-cJXKqkYU.js";import{i as n,r}from"./react-k3YPvb47.js";import{c as i,i as a,n as o,p as s}from"./blocks-C1m9VAMK.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./ActionMenu.stories-B1YXWwUM.js";function m(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i,{of:p}),`
`,(0,g.jsx)(t.h1,{id:`actionmenu`,children:`ActionMenu`}),`
`,(0,g.jsx)(t.p,{children:`ActionMenu combines an ActionButton with a Menu for simple “more actions” use cases. It provides Spectrum styling, keyboard navigation, focus management, and accessible menu semantics.`}),`
`,(0,g.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,g.jsx)(t.pre,{children:(0,g.jsx)(t.code,{className:`language-tsx`,children:`import {ActionMenu, Keyboard, MenuItem, Text} from '@/components/spectrum/ActionMenu';

<ActionMenu aria-label="More actions">
  <MenuItem textValue="Copy" onAction={() => copySelection()}>
    <Text slot="label">Copy</Text>
    <Text slot="description">Copy the selected text</Text>
    <Keyboard>⌘C</Keyboard>
  </MenuItem>
</ActionMenu>
`})}),`
`,(0,g.jsx)(o,{of:f}),`
`,(0,g.jsx)(t.h2,{id:`variants-and-states`,children:`Variants and states`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`isQuiet`}),` for a low-emphasis trigger, `,(0,g.jsx)(t.code,{children:`isDisabled`}),` to disable the entire menu, and `,(0,g.jsx)(t.code,{children:`disabledKeys`}),` to disable specific menu items. `,(0,g.jsx)(t.code,{children:`size`}),` controls the trigger while `,(0,g.jsx)(t.code,{children:`menuSize`}),` controls the menu.`]}),`
`,(0,g.jsx)(o,{of:c}),`
`,(0,g.jsx)(o,{of:l}),`
`,(0,g.jsx)(t.h2,{id:`controlled-open-state`,children:`Controlled open state`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`isOpen`}),` with `,(0,g.jsx)(t.code,{children:`onOpenChange`}),` when the open state must be controlled by the parent.`]}),`
`,(0,g.jsx)(o,{of:u}),`
`,(0,g.jsx)(t.h2,{id:`placement-and-accessibility`,children:`Placement and accessibility`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`direction`}),`, `,(0,g.jsx)(t.code,{children:`align`}),`, and `,(0,g.jsx)(t.code,{children:`shouldFlip`}),` to control placement. The menu flips automatically by default when space is limited. Provide an accessible name with `,(0,g.jsx)(t.code,{children:`aria-label`}),` or `,(0,g.jsx)(t.code,{children:`aria-labelledby`}),`, and use `,(0,g.jsx)(t.code,{children:`textValue`}),` for items whose visible content is not plain text.`]}),`
`,(0,g.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,g.jsxs)(t.p,{children:[`| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `,(0,g.jsx)(t.code,{children:`align`}),` | `,(0,g.jsx)(t.code,{children:`"end" \\| "start"`}),` | `,(0,g.jsx)(t.code,{children:`start`}),` | Alignment of the menu relative to the trigger. |
| `,(0,g.jsx)(t.code,{children:`children`}),` | `,(0,g.jsx)(t.code,{children:`ReactNode \\| (item: T) => ReactNode`}),` | — | The contents of the collection. |
| `,(0,g.jsx)(t.code,{children:`defaultOpen`}),` | `,(0,g.jsx)(t.code,{children:`boolean`}),` | — | Whether the overlay is open by default. |
| `,(0,g.jsx)(t.code,{children:`direction`}),` | `,(0,g.jsx)(t.code,{children:`"bottom" \\| "end" \\| "left" \\| "right" \\| "start" \\| "top"`}),` | `,(0,g.jsx)(t.code,{children:`bottom`}),` | Where the menu opens relative to its trigger. |
| `,(0,g.jsx)(t.code,{children:`disabledKeys`}),` | `,(0,g.jsx)(t.code,{children:`Iterable<Key>`}),` | — | Items that cannot be selected or focused. |
| `,(0,g.jsx)(t.code,{children:`isDisabled`}),` | `,(0,g.jsx)(t.code,{children:`boolean`}),` | — | Whether the button is disabled. |
| `,(0,g.jsx)(t.code,{children:`isOpen`}),` | `,(0,g.jsx)(t.code,{children:`boolean`}),` | — | Whether the overlay is controlled as open. |
| `,(0,g.jsx)(t.code,{children:`isQuiet`}),` | `,(0,g.jsx)(t.code,{children:`boolean`}),` | — | Whether the trigger uses a quiet style. |
| `,(0,g.jsx)(t.code,{children:`items`}),` | `,(0,g.jsx)(t.code,{children:`Iterable<T>`}),` | — | Item objects in the collection. |
| `,(0,g.jsx)(t.code,{children:`menuSize`}),` | `,(0,g.jsx)(t.code,{children:`"L" \\| "M" \\| "S" \\| "XL"`}),` | `,(0,g.jsx)(t.code,{children:`M`}),` | The size of the Menu. |
| `,(0,g.jsx)(t.code,{children:`onAction`}),` | `,(0,g.jsx)(t.code,{children:`(key: Key, value: T) => void`}),` | — | Called when an item is selected. |
| `,(0,g.jsx)(t.code,{children:`onOpenChange`}),` | `,(0,g.jsx)(t.code,{children:`(isOpen: boolean) => void`}),` | — | Called when the overlay open state changes. |
| `,(0,g.jsx)(t.code,{children:`shouldCloseOnSelect`}),` | `,(0,g.jsx)(t.code,{children:`boolean`}),` | — | Whether the menu closes when an item is selected. |
| `,(0,g.jsx)(t.code,{children:`shouldFlip`}),` | `,(0,g.jsx)(t.code,{children:`boolean`}),` | `,(0,g.jsx)(t.code,{children:`true`}),` | Whether the menu automatically flips when space is limited. |
| `,(0,g.jsx)(t.code,{children:`size`}),` | `,(0,g.jsx)(t.code,{children:`"L" \\| "M" \\| "S" \\| "XL" \\| "XS"`}),` | `,(0,g.jsx)(t.code,{children:`M`}),` | Size of the ActionButton trigger. |
| `,(0,g.jsx)(t.code,{children:`styles`}),` | `,(0,g.jsx)(t.code,{children:`StylesProp`}),` | — | Spectrum-defined styles. |
| `,(0,g.jsx)(t.code,{children:`UNSAFE_className`}),` | `,(0,g.jsx)(t.code,{children:`UnsafeClassName`}),` | — | Custom class name, intended only as a last resort. |
| `,(0,g.jsx)(t.code,{children:`UNSAFE_style`}),` | `,(0,g.jsx)(t.code,{children:`CSSProperties`}),` | — | Inline style, intended only as a last resort. |`]}),`
`,(0,g.jsx)(t.h2,{id:`controls`,children:`Controls`}),`
`,(0,g.jsx)(a,{})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=t(),r(),s(),d()})))()}_();export{h as default};