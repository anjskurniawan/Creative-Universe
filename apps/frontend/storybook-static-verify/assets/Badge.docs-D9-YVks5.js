import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-dkOi0t0j.js";import{i as n,r}from"./react-k3YPvb47.js";import{c as i,i as a,n as o,p as s}from"./blocks-BcDC8w0t.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./Badge.stories-BjuqlONW.js";function g(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(i,{of:h}),`
`,(0,v.jsx)(t.h1,{id:`badge`,children:`Badge`}),`
`,(0,v.jsx)(t.p,{children:`Badges show a small amount of color-categorized metadata and are ideal for getting a user's attention.`}),`
`,(0,v.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,v.jsx)(t.pre,{children:(0,v.jsx)(t.code,{className:`language-tsx`,children:`import {Badge} from "@/components/spectrum/Badge";

<Badge variant="informative">In progress</Badge>
`})}),`
`,(0,v.jsx)(o,{of:d}),`
`,(0,v.jsx)(t.h2,{id:`semantic-variants`,children:`Semantic variants`}),`
`,(0,v.jsxs)(t.p,{children:[`Use semantic variants such as `,(0,v.jsx)(t.code,{children:`positive`}),`, `,(0,v.jsx)(t.code,{children:`negative`}),`, `,(0,v.jsx)(t.code,{children:`notice`}),`, or `,(0,v.jsx)(t.code,{children:`informative`}),` when the badge communicates meaning. Use color variants such as `,(0,v.jsx)(t.code,{children:`blue`}),`, `,(0,v.jsx)(t.code,{children:`purple`}),`, or `,(0,v.jsx)(t.code,{children:`green`}),` for non-semantic categorization.`]}),`
`,(0,v.jsx)(o,{of:c}),`
`,(0,v.jsx)(o,{of:u}),`
`,(0,v.jsx)(t.h2,{id:`fill-styles-and-overflow`,children:`Fill styles and overflow`}),`
`,(0,v.jsxs)(t.p,{children:[`Use `,(0,v.jsx)(t.code,{children:`bold`}),`, `,(0,v.jsx)(t.code,{children:`outline`}),`, or `,(0,v.jsx)(t.code,{children:`subtle`}),` with `,(0,v.jsx)(t.code,{children:`fillStyle`}),` to control the visual treatment. Set `,(0,v.jsx)(t.code,{children:`overflowMode`}),` to `,(0,v.jsx)(t.code,{children:`truncate`}),` when the badge must stay on one line, or use `,(0,v.jsx)(t.code,{children:`wrap`}),` for longer content.`]}),`
`,(0,v.jsx)(o,{of:p}),`
`,(0,v.jsx)(o,{of:f}),`
`,(0,v.jsx)(o,{of:m}),`
`,(0,v.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,v.jsxs)(t.p,{children:[`Badge content should be concise and understandable without relying only on color. Use semantic variants when applicable and provide `,(0,v.jsx)(t.code,{children:`aria-label`}),` when the visible content does not fully describe the badge.`]}),`
`,(0,v.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,v.jsxs)(t.p,{children:[`| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `,(0,v.jsx)(t.code,{children:`aria-describedby`}),` | `,(0,v.jsx)(t.code,{children:`string`}),` | — | Identifies the element that describes the badge. |
| `,(0,v.jsx)(t.code,{children:`aria-details`}),` | `,(0,v.jsx)(t.code,{children:`string`}),` | — | Identifies detailed information about the badge. |
| `,(0,v.jsx)(t.code,{children:`aria-label`}),` | `,(0,v.jsx)(t.code,{children:`string`}),` | — | Defines an accessible name for the badge. |
| `,(0,v.jsx)(t.code,{children:`aria-labelledby`}),` | `,(0,v.jsx)(t.code,{children:`string`}),` | — | References the element that labels the badge. |
| `,(0,v.jsx)(t.code,{children:`children`}),` | `,(0,v.jsx)(t.code,{children:`ReactNode`}),` | — | The content to display in the badge. |
| `,(0,v.jsx)(t.code,{children:`fillStyle`}),` | `,(0,v.jsx)(t.code,{children:`"bold" \\| "outline" \\| "subtle"`}),` | `,(0,v.jsx)(t.code,{children:`bold`}),` | The fill treatment of the badge. |
| `,(0,v.jsx)(t.code,{children:`id`}),` | `,(0,v.jsx)(t.code,{children:`string`}),` | — | The element's unique identifier. |
| `,(0,v.jsx)(t.code,{children:`overflowMode`}),` | `,(0,v.jsx)(t.code,{children:`"truncate" \\| "wrap"`}),` | `,(0,v.jsx)(t.code,{children:`wrap`}),` | Sets text behavior for badge contents. |
| `,(0,v.jsx)(t.code,{children:`size`}),` | `,(0,v.jsx)(t.code,{children:`"S" \\| "M" \\| "L" \\| "XL"`}),` | `,(0,v.jsx)(t.code,{children:`S`}),` | The size of the badge. |
| `,(0,v.jsx)(t.code,{children:`slot`}),` | `,(0,v.jsx)(t.code,{children:`string \\| null`}),` | — | A slot name for receiving parent props. |
| `,(0,v.jsx)(t.code,{children:`styles`}),` | `,(0,v.jsx)(t.code,{children:`StylesProp`}),` | — | Spectrum-defined styles returned by the style macro. |
| `,(0,v.jsx)(t.code,{children:`UNSAFE_className`}),` | `,(0,v.jsx)(t.code,{children:`UnsafeClassName`}),` | — | Custom class name, intended only as a last resort. |
| `,(0,v.jsx)(t.code,{children:`UNSAFE_style`}),` | `,(0,v.jsx)(t.code,{children:`CSSProperties`}),` | — | Inline style, intended only as a last resort. |
| `,(0,v.jsx)(t.code,{children:`variant`}),` | `,(0,v.jsx)(t.code,{children:`accent \\| blue \\| brown \\| celery \\| chartreuse \\| cinnamon \\| cyan \\| fuchsia \\| gray \\| green \\| indigo \\| informative \\| magenta \\| negative \\| neutral \\| notice \\| orange \\| pink \\| positive \\| purple \\| red \\| seafoam \\| silver \\| turquoise \\| yellow`}),` | `,(0,v.jsx)(t.code,{children:`neutral`}),` | Changes the background color or semantic meaning of the badge. |`]}),`
`,(0,v.jsx)(t.h2,{id:`controls`,children:`Controls`}),`
`,(0,v.jsx)(a,{})]})}function _(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,v.jsx)(t,{...e,children:(0,v.jsx)(g,{...e})}):g(e)}var v;function y(){return(y=e((()=>{v=t(),r(),s(),l()})))()}y();export{_ as default};