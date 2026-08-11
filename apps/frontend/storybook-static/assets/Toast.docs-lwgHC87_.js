import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-cJXKqkYU.js";import{i as n,r}from"./react-k3YPvb47.js";import{c as i,i as a,n as o,p as s}from"./blocks-C1m9VAMK.js";import{a as c,i as l,n as u,r as d,t as f}from"./Toast.stories-D3mEERk3.js";function p(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,...n(),...e.components};return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(i,{of:d}),`
`,(0,h.jsx)(t.h1,{id:`toast`,children:`Toast`}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`ToastContainer`}),` renders queued toasts in an application. Place it at the root of the application, then use `,(0,h.jsx)(t.code,{children:`ToastQueue`}),` to add neutral, positive, negative, or informational messages.`]}),`
`,(0,h.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,h.jsxs)(t.p,{children:[`Render one `,(0,h.jsx)(t.code,{children:`Toast`}),` or `,(0,h.jsx)(t.code,{children:`ToastContainer`}),` near the application root and enqueue messages from user actions.`]}),`
`,(0,h.jsx)(o,{of:u}),`
`,(0,h.jsx)(t.h2,{id:`variants-and-actions`,children:`Variants and actions`}),`
`,(0,h.jsxs)(t.p,{children:[`Use the variant-specific queue methods for semantic feedback. Pass `,(0,h.jsx)(t.code,{children:`actionLabel`}),`, `,(0,h.jsx)(t.code,{children:`onAction`}),`, and `,(0,h.jsx)(t.code,{children:`shouldCloseOnAction`}),` to add an action button.`]}),`
`,(0,h.jsx)(o,{of:l}),`
`,(0,h.jsx)(o,{of:f}),`
`,(0,h.jsx)(t.h2,{id:`dismissal-and-accessibility`,children:`Dismissal and accessibility`}),`
`,(0,h.jsxs)(t.p,{children:[`Use the `,(0,h.jsx)(t.code,{children:`timeout`}),` option for automatic dismissal. Toasts have a minimum accessible timeout of five seconds, and actionable toasts do not automatically dismiss. Timers pause when users focus or hover a toast.`]}),`
`,(0,h.jsx)(t.p,{children:`The returned close function can dismiss a toast programmatically. Toast content should be concise and meaningful because it is announced through the toast region.`}),`
`,(0,h.jsx)(t.h2,{id:`api`,children:`API`}),`
`,(0,h.jsx)(a,{}),`
`,(0,h.jsxs)(t.p,{children:[(0,h.jsx)(t.code,{children:`ToastQueue`}),` exposes `,(0,h.jsx)(t.code,{children:`neutral`}),`, `,(0,h.jsx)(t.code,{children:`positive`}),`, `,(0,h.jsx)(t.code,{children:`negative`}),`, and `,(0,h.jsx)(t.code,{children:`info`}),` methods. `,(0,h.jsx)(t.code,{children:`ToastContainer`}),` supports `,(0,h.jsx)(t.code,{children:`placement`}),` and accessible region props.`]})]})}function m(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,h.jsx)(t,{...e,children:(0,h.jsx)(p,{...e})}):p(e)}var h;function g(){return(g=e((()=>{h=t(),r(),s(),c()})))()}g();export{m as default};