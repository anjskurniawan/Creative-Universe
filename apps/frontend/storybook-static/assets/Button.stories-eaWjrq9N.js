import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{t}from"./react-Drno7eUL.js";import{o as n}from"./iframe-BDwG_xnH.js";import{r,t as i}from"./Button-C8Nz8Den.js";var a,o,s;function c(){return(c=e((()=>{a=n(),o=t(),r(),s=(0,o.forwardRef)(function(e,t){return(0,a.jsx)(`div`,{className:`spectrum-component`,children:(0,a.jsx)(i,{...e,ref:t})})}),s.__docgenInfo={description:``,methods:[],displayName:`Button`}})))()}function l(){let[e,t]=(0,d.useState)(!1);return(0,u.jsx)(s,{isPending:e,onPress:()=>{t(!0),window.setTimeout(()=>t(!1),1500)},variant:`primary`,children:`Save`})}var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{u=n(),d=t(),c(),{fn:f}=__STORYBOOK_MODULE_TEST__,p={title:`Spectrum/Button`,component:s,parameters:{layout:`centered`},tags:[`autodocs`],args:{children:`Continue`,onPress:f()}},m={},h={args:{variant:`accent`}},g={args:{isDisabled:!0}},_={render:()=>(0,u.jsx)(l,{})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "accent"
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    isDisabled: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <PendingButtonExample />
}`,..._.parameters?.docs?.source}}},v=[`Primary`,`Accent`,`Disabled`,`Pending`]})))()}y();export{h as Accent,g as Disabled,_ as Pending,m as Primary,v as __namedExportsOrder,p as default};