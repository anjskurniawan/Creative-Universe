import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-cJXKqkYU.js";import{i as n,r}from"./react-k3YPvb47.js";import{c as i,i as a,n as o,p as s}from"./blocks-C1m9VAMK.js";import{i as c,n as l,r as u,t as d}from"./SideNav.stories-BJC6BCxI.js";function f(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(i,{of:l}),`
`,(0,m.jsx)(t.h1,{id:`sidenav`,children:`SideNav`}),`
`,(0,m.jsx)(t.p,{children:`A SideNav provides users with a way to navigate a nested hierarchical set of links. It supports static and dynamic collections, expansion, routing, sections, disabled items, and accessible navigation semantics.`}),`
`,(0,m.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-tsx`,children:`import {SideNav, SideNavItem, SideNavItemContent, SideNavItemLink, Text} from "@/components/spectrum/SideNav";

<SideNav aria-label="Files" selectedRoute="/guidelines" defaultExpandedKeys={["guidelines"]}>
  <SideNavItem href="/guidelines" id="guidelines" textValue="Guidelines">
    <SideNavItemContent>
      <SideNavItemLink><Text>Guidelines</Text></SideNavItemLink>
    </SideNavItemContent>
  </SideNavItem>
</SideNav>
`})}),`
`,(0,m.jsx)(o,{of:d}),`
`,(0,m.jsx)(t.h2,{id:`sections`,children:`Sections`}),`
`,(0,m.jsxs)(t.p,{children:[`Use `,(0,m.jsx)(t.code,{children:`SideNavSection`}),` and `,(0,m.jsx)(t.code,{children:`SideNavHeader`}),` to group related items. Sections are non-collapsible and non-interactive.`]}),`
`,(0,m.jsx)(o,{of:u}),`
`,(0,m.jsx)(t.h2,{id:`routing-and-selection`,children:`Routing and selection`}),`
`,(0,m.jsxs)(t.p,{children:[`SideNav does not support uncontrolled selection. Manage the current route through `,(0,m.jsx)(t.code,{children:`selectedRoute`}),` and update it from your router. Items with an `,(0,m.jsx)(t.code,{children:`href`}),` must render a `,(0,m.jsx)(t.code,{children:`SideNavItemLink`}),` inside `,(0,m.jsx)(t.code,{children:`SideNavItemContent`}),`.`]}),`
`,(0,m.jsx)(t.h2,{id:`collections-and-nesting`,children:`Collections and nesting`}),`
`,(0,m.jsxs)(t.p,{children:[`SideNav follows the Collection Components API. Use `,(0,m.jsx)(t.code,{children:`items`}),` and a recursive render function for dynamic collections, or use static nested `,(0,m.jsx)(t.code,{children:`SideNavItem`}),` children for small trees. Set `,(0,m.jsx)(t.code,{children:`defaultExpandedKeys`}),` for initial expansion and `,(0,m.jsx)(t.code,{children:`expandedKeys`}),` with `,(0,m.jsx)(t.code,{children:`onExpandedChange`}),` for controlled expansion.`]}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsxs)(t.p,{children:[`Provide `,(0,m.jsx)(t.code,{children:`aria-label`}),` or `,(0,m.jsx)(t.code,{children:`aria-labelledby`}),` for the navigation landmark. Give each item a useful `,(0,m.jsx)(t.code,{children:`textValue`}),` for typeahead and accessible collection behavior. Use `,(0,m.jsx)(t.code,{children:`disabledKeys`}),` for items that cannot be selected or interacted with.`]}),`
`,(0,m.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,m.jsx)(t.h3,{id:`sidenav-1`,children:`SideNav`}),`
`,(0,m.jsxs)(t.p,{children:[`| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `,(0,m.jsx)(t.code,{children:`aria-label`}),` | `,(0,m.jsx)(t.code,{children:`string`}),` | — | Defines an accessible name for the navigation. |
| `,(0,m.jsx)(t.code,{children:`autoFocus`}),` | `,(0,m.jsx)(t.code,{children:`boolean \\| FocusStrategy`}),` | — | Whether to focus the grid list or an option. |
| `,(0,m.jsx)(t.code,{children:`children`}),` | `,(0,m.jsx)(t.code,{children:`ReactNode \\| (item: T) => ReactNode`}),` | — | The contents of the collection. |
| `,(0,m.jsx)(t.code,{children:`defaultExpandedKeys`}),` | `,(0,m.jsx)(t.code,{children:`Iterable<Key>`}),` | — | Initial expanded keys in the collection. |
| `,(0,m.jsx)(t.code,{children:`disabledKeys`}),` | `,(0,m.jsx)(t.code,{children:`Iterable<Key>`}),` | — | Items that cannot be selected or interacted with. |
| `,(0,m.jsx)(t.code,{children:`expandedKeys`}),` | `,(0,m.jsx)(t.code,{children:`Iterable<Key>`}),` | — | Currently expanded keys in the collection. |
| `,(0,m.jsx)(t.code,{children:`id`}),` | `,(0,m.jsx)(t.code,{children:`string`}),` | — | The element's unique identifier. |
| `,(0,m.jsx)(t.code,{children:`items`}),` | `,(0,m.jsx)(t.code,{children:`Iterable<T>`}),` | — | Item objects in a dynamic collection. |
| `,(0,m.jsx)(t.code,{children:`onExpandedChange`}),` | `,(0,m.jsx)(t.code,{children:`(keys: Set<Key>) => any`}),` | — | Called when items are expanded or collapsed. |
| `,(0,m.jsx)(t.code,{children:`selectedRoute`}),` | `,(0,m.jsx)(t.code,{children:`string \\| null`}),` | — | The route currently selected. |
| `,(0,m.jsx)(t.code,{children:`styles`}),` | `,(0,m.jsx)(t.code,{children:`StylesPropWithHeight`}),` | — | Spectrum-defined styles. |
| `,(0,m.jsx)(t.code,{children:`UNSAFE_className`}),` | `,(0,m.jsx)(t.code,{children:`UnsafeClassName`}),` | — | Custom class name, intended only as a last resort. |
| `,(0,m.jsx)(t.code,{children:`UNSAFE_style`}),` | `,(0,m.jsx)(t.code,{children:`CSSProperties`}),` | — | Inline style, intended only as a last resort. |`]}),`
`,(0,m.jsx)(t.h3,{id:`sidenavitem`,children:`SideNavItem`}),`
`,(0,m.jsxs)(t.p,{children:[`| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `,(0,m.jsx)(t.code,{children:`children`}),` | `,(0,m.jsx)(t.code,{children:`ReactNode`}),` | — | Content and nested children of the item. |
| `,(0,m.jsx)(t.code,{children:`hasChildItems`}),` | `,(0,m.jsx)(t.code,{children:`boolean`}),` | — | Whether the item has children. |
| `,(0,m.jsx)(t.code,{children:`href`}),` | `,(0,m.jsx)(t.code,{children:`string`}),` | — | URL to link to. |
| `,(0,m.jsx)(t.code,{children:`id`}),` | `,(0,m.jsx)(t.code,{children:`Key`}),` | — | Unique item identifier. |
| `,(0,m.jsx)(t.code,{children:`isDisabled`}),` | `,(0,m.jsx)(t.code,{children:`boolean`}),` | — | Whether the item is disabled. |
| `,(0,m.jsx)(t.code,{children:`textValue`}),` | `,(0,m.jsx)(t.code,{children:`string`}),` | — | Text representation used for typeahead. |`]}),`
`,(0,m.jsx)(t.h3,{id:`sidenavitemcontent-and-sidenavitemlink`,children:`SideNavItemContent and SideNavItemLink`}),`
`,(0,m.jsxs)(t.p,{children:[`Both components accept `,(0,m.jsx)(t.code,{children:`children: ReactNode`}),`. `,(0,m.jsx)(t.code,{children:`SideNavItemContent`}),` contains the item content and optional actions; `,(0,m.jsx)(t.code,{children:`SideNavItemLink`}),` renders the navigable content for items with an `,(0,m.jsx)(t.code,{children:`href`}),`.`]}),`
`,(0,m.jsx)(t.h3,{id:`sidenavsection-and-sidenavheader`,children:`SideNavSection and SideNavHeader`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`SideNavSection`}),` groups items, while `,(0,m.jsx)(t.code,{children:`SideNavHeader`}),` renders the section heading. Sections do not collapse or act as links.`]}),`
`,(0,m.jsx)(t.h2,{id:`controls`,children:`Controls`}),`
`,(0,m.jsx)(a,{})]})}function p(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(f,{...e})}):f(e)}var m;function h(){return(h=e((()=>{m=t(),r(),s(),c()})))()}h();export{p as default};