import{n as e,r as t}from"./rolldown-runtime-CsOFd3vK.js";import{t as n}from"./react-Drno7eUL.js";import{o as r}from"./iframe-dkOi0t0j.js";import{n as i,t as a}from"./Button-TO3Ay7Jo.js";var o=t({Accent:()=>p,Disabled:()=>h,Pending:()=>g,PressEvents:()=>_,Primary:()=>f,VariantsAndSizes:()=>m,__namedExportsOrder:()=>v,default:()=>d});function s(){let[e,t]=(0,l.useState)(!1);return(0,c.jsx)(a,{isPending:e,onPress:()=>{t(!0),window.setTimeout(()=>t(!1),1500)},variant:`primary`,children:`Save`})}var c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{c=r(),l=n(),i(),{fn:u}=__STORYBOOK_MODULE_TEST__,d={title:`Spectrum/Button`,component:a,parameters:{layout:`centered`},args:{children:`Continue`,onPress:u()}},f={},p={args:{variant:`accent`}},m={render:()=>(0,c.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,c.jsx)(a,{variant:`primary`,size:`S`,children:`Small`}),(0,c.jsx)(a,{variant:`accent`,children:`Accent`}),(0,c.jsx)(a,{variant:`secondary`,fillStyle:`outline`,size:`L`,children:`Outline`}),(0,c.jsx)(a,{variant:`negative`,size:`XL`,children:`Delete`})]})},h={args:{isDisabled:!0}},g={render:()=>(0,c.jsx)(s,{})},_={render:()=>(0,c.jsx)(a,{onPress:()=>window.alert(`Pressed`),children:`Press me`})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "accent"
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-3">\r
      <Button variant="primary" size="S">Small</Button>\r
      <Button variant="accent">Accent</Button>\r
      <Button variant="secondary" fillStyle="outline" size="L">Outline</Button>\r
      <Button variant="negative" size="XL">Delete</Button>\r
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    isDisabled: true
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <PendingButtonExample />
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Button onPress={() => window.alert("Pressed")}>Press me</Button>
}`,..._.parameters?.docs?.source}}},v=[`Primary`,`Accent`,`VariantsAndSizes`,`Disabled`,`Pending`,`PressEvents`]})))()}export{f as a,_ as i,h as n,m as o,g as r,y as s,o as t};