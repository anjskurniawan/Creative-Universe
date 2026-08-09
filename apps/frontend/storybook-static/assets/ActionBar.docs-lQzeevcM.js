import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-BDwG_xnH.js";import{i as n,r}from"./react-k3YPvb47.js";import{a as i,c as a,f as o,i as s,l as c,p as l,u}from"./blocks-C98eu2cZ.js";import{n as d,t as f}from"./ActionBar.stories-CddpnAEs.js";function p(e){let t={code:`code`,h2:`h2`,p:`p`,strong:`strong`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(a,{of:f}),`
`,(0,h.jsx)(o,{}),`
`,(0,h.jsx)(i,{children:(0,h.jsx)(t.p,{children:`Action bars are used for single and bulk selection patterns when a user needs to perform actions on one or more items at the same time. This wrapper automatically applies React Spectrum S2 styles, typography, color schemes, and accessibility behavior.`})}),`
`,(0,h.jsx)(t.h2,{id:`qa-color-scheme`,children:`QA color scheme`}),`
`,(0,h.jsxs)(t.p,{children:[`Use the `,(0,h.jsx)(t.strong,{children:`Spectrum Light`}),` or `,(0,h.jsx)(t.strong,{children:`Spectrum Dark`}),` toolbar control in Storybook to inspect both color schemes.`]}),`
`,(0,h.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,h.jsxs)(t.p,{children:[`Pass `,(0,h.jsx)(t.code,{children:`selectedItemCount`}),` and place one or more `,(0,h.jsx)(t.code,{children:`ActionButton`}),` components inside the bar. The bar is hidden when the count is `,(0,h.jsx)(t.code,{children:`0`}),`.`]}),`
`,(0,h.jsx)(u,{language:`tsx`,code:`import { ActionBar, ActionButton } from "@/components/spectrum/ActionBar";

<ActionBar selectedItemCount={2}>
<ActionButton aria-label="Edit">Edit</ActionButton>
<ActionButton aria-label="Copy">Copy</ActionButton>
<ActionButton aria-label="Delete">Delete</ActionButton>
</ActionBar>`}),`
`,(0,h.jsx)(c,{}),`
`,(0,h.jsx)(t.h2,{id:`tableview-listview-and-treeview`,children:`TableView, ListView, and TreeView`}),`
`,(0,h.jsxs)(t.p,{children:[`ActionBar is intended to be rendered by collection components through `,(0,h.jsx)(t.code,{children:`renderActionBar`}),`. Pass the selected collection size to `,(0,h.jsx)(t.code,{children:`selectedItemCount`}),` and keep the actions inside the bar. The same pattern works with `,(0,h.jsx)(t.code,{children:`ListView`}),` and `,(0,h.jsx)(t.code,{children:`TreeView`}),`.`]}),`
`,(0,h.jsx)(u,{language:`tsx`,code:`<TableView
aria-label="Table with action bar"
selectionMode="multiple"
renderActionBar={(selectedKeys) => (
  <ActionBar selectedItemCount={selectedKeys.size}>
    <ActionButton aria-label="Edit">Edit</ActionButton>
    <ActionButton aria-label="Copy">Copy</ActionButton>
    <ActionButton aria-label="Delete">Delete</ActionButton>
  </ActionBar>
)}
>`}),`
`,(0,h.jsx)(t.h2,{id:`clearing-selection`,children:`Clearing selection`}),`
`,(0,h.jsxs)(t.p,{children:[`Use `,(0,h.jsx)(t.code,{children:`onClearSelection`}),` to connect the built-in clear-selection button to the state owned by the collection.`]}),`
`,(0,h.jsx)(u,{language:`tsx`,code:`<ActionBar
selectedItemCount={selectedKeys.size}
onClearSelection={() => setSelectedKeys(new Set())}
>
<ActionButton aria-label="Archive">Archive</ActionButton>
</ActionBar>`}),`
`,(0,h.jsx)(t.h2,{id:`all-items-and-emphasis`,children:`All items and emphasis`}),`
`,(0,h.jsxs)(t.p,{children:[`Use `,(0,h.jsx)(t.code,{children:`selectedItemCount="all"`}),` when every item is selected. Set `,(0,h.jsx)(t.code,{children:`isEmphasized`}),` to `,(0,h.jsx)(t.code,{children:`true`}),` when the actions need stronger visual emphasis.`]}),`
`,(0,h.jsx)(u,{language:`tsx`,code:`<ActionBar selectedItemCount="all" isEmphasized>
<ActionButton aria-label="Archive">Archive</ActionButton>
</ActionBar>`}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsxs)(`table`,{children:[(0,h.jsx)(`thead`,{children:(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`th`,{children:`Name`}),(0,h.jsx)(`th`,{children:`Type`}),(0,h.jsx)(`th`,{children:`Default`}),(0,h.jsx)(`th`,{children:`Description`})]})}),(0,h.jsxs)(`tbody`,{children:[(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`children`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`ReactNode`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`A list of ActionButtons to display.`})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`id`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`string | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`The element's unique identifier.`})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`isEmphasized`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`boolean | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`Whether the ActionBar uses an emphasized style.`})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`onClearSelection`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`(() => void) | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`Handler called when the clear-selection button is pressed.`})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`scrollRef`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`RefObject<HTMLElement | null> | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`Ref to the scrollable element above which the bar appears.`})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`selectedItemCount`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`number | "all" | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsxs)(`td`,{children:[`Number of selected items; hidden when `,(0,h.jsx)(`code`,{children:`0`}),`.`]})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`slot`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`string | null | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`Slot name for receiving parent props.`})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`styles`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`StylesProp | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsxs)(`td`,{children:[`Spectrum styles returned by the `,(0,h.jsx)(`code`,{children:`style()`}),` macro.`]})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`UNSAFE_className`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`UnsafeClassName | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`Custom class name, intended only as a last resort.`})]}),(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`UNSAFE_style`})}),(0,h.jsx)(`td`,{children:(0,h.jsx)(`code`,{children:`CSSProperties | undefined`})}),(0,h.jsx)(`td`,{children:`-`}),(0,h.jsx)(`td`,{children:`Inline style, intended only as a last resort.`})]})]})]}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`ActionButton`}),` is re-exported from this wrapper for convenience. Its props include `,(0,h.jsx)(t.code,{children:`aria-label`}),`, `,(0,h.jsx)(t.code,{children:`isDisabled`}),`, `,(0,h.jsx)(t.code,{children:`isQuiet`}),`, `,(0,h.jsx)(t.code,{children:`isPending`}),`, `,(0,h.jsx)(t.code,{children:`onPress`}),`, and other React Spectrum S2 action behavior.`]}),`
`,(0,h.jsx)(t.h2,{id:`controls`,children:`Controls`}),`
`,(0,h.jsxs)(t.p,{children:[`Use the Controls panel to try `,(0,h.jsx)(t.code,{children:`selectedItemCount`}),`, `,(0,h.jsx)(t.code,{children:`isEmphasized`}),`, and the clear-selection action.`]}),`
`,(0,h.jsx)(s,{})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;function g(){return(g=e((()=>{h=t(),r(),l(),d()})))()}g();export{m as default};