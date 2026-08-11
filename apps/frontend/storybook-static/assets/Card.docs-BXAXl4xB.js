import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-cJXKqkYU.js";import{i as n,r}from"./react-k3YPvb47.js";import{a as i,c as a,d as o,f as s,i as c,l,p as u,u as d}from"./blocks-C1m9VAMK.js";import{n as f,t as p}from"./Card.stories-FdDmxwO0.js";function m(e){let t={code:`code`,h2:`h2`,p:`p`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(a,{of:p}),`
`,(0,g.jsx)(s,{}),`
`,(0,g.jsx)(i,{children:(0,g.jsx)(t.p,{children:`Card summarizes an object that a user can select or navigate to. Compose a preview, content section, and optional footer to represent assets, users, or products.`})}),`
`,(0,g.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import {Card, CardPreview, Content, Image, Text} from "@/components/spectrum/Card";

<Card aria-label="Project Aurora">
<CardPreview><Image alt="Project preview" src={preview} /></CardPreview>
<Content>
  <Text slot="title">Project Aurora</Text>
  <Text slot="description">A concise project overview.</Text>
</Content>
</Card>`}),`
`,(0,g.jsx)(l,{}),`
`,(0,g.jsx)(t.h2,{id:`variants-and-states`,children:`Variants and states`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`size`}),`, `,(0,g.jsx)(t.code,{children:`density`}),`, and `,(0,g.jsx)(t.code,{children:`variant`}),` to adjust the card presentation. Use `,(0,g.jsx)(t.code,{children:`isDisabled`}),` to prevent interaction and `,(0,g.jsx)(t.code,{children:`href`}),` to make the card navigable. The `,(0,g.jsx)(t.code,{children:`AssetCard`}),`, `,(0,g.jsx)(t.code,{children:`UserCard`}),`, and `,(0,g.jsx)(t.code,{children:`ProductCard`}),` variants provide predefined layouts.`]}),`
`,(0,g.jsx)(c,{}),`
`,(0,g.jsx)(o,{include:[`Quiet`,`Disabled`,`Linked`,`Asset`,`User`,`Product`]}),`
`,(0,g.jsx)(t.h2,{id:`accessibility-and-internationalization`,children:`Accessibility and internationalization`}),`
`,(0,g.jsx)(t.p,{children:`Provide an accessible label when the card does not contain an equivalent visible label. Card content uses the Spectrum S2 locale and color scheme context supplied by the consuming application boundary.`}),`
`,(0,g.jsx)(t.h2,{id:`qa-color-schemes`,children:`QA color schemes`}),`
`,(0,g.jsx)(t.p,{children:`Use the Storybook Spectrum Light and Spectrum Dark toolbar controls to verify both color schemes.`})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=t(),r(),u(),f()})))()}_();export{h as default};