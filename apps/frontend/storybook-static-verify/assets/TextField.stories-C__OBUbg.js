import{n as e,r as t}from"./rolldown-runtime-CsOFd3vK.js";import{t as n}from"./react-Drno7eUL.js";import{o as r}from"./iframe-dkOi0t0j.js";import{n as i,t as a}from"./TextField-DkK60o3s.js";var o,s,c;function l(){return(l=e((()=>{o=r(),s=n(),i(),c=(0,s.forwardRef)(function(e,t){return(0,o.jsx)(`div`,{className:`spectrum-component`,children:(0,o.jsx)(a,{...e,ref:t})})}),c.__docgenInfo={description:``,methods:[],displayName:`TextField`}})))()}var u=t({Controlled:()=>x,Default:()=>h,Disabled:()=>y,Invalid:()=>v,Required:()=>_,WithDescription:()=>g,WithPrefix:()=>b,__namedExportsOrder:()=>S,default:()=>m});function d(){let[e,t]=(0,p.useState)(``);return(0,f.jsxs)(`div`,{className:`flex min-w-[280px] flex-col gap-3`,children:[(0,f.jsx)(c,{label:`Name`,value:e,onChange:t}),(0,f.jsxs)(`span`,{children:[`Current value: `,e||`(empty)`]})]})}var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{f=r(),p=n(),l(),m={title:`Spectrum/TextField`,component:c,parameters:{layout:`centered`,docs:{description:{component:`TextField is a keyboard text input with labels, descriptions, validation, and optional prefix content.`}}},args:{label:`Name`,placeholder:`Enter your full name`},argTypes:{size:{control:`select`,options:[`S`,`M`,`L`,`XL`]},labelPosition:{control:`select`,options:[`top`,`side`]},isDisabled:{control:`boolean`},isReadOnly:{control:`boolean`},isRequired:{control:`boolean`},isInvalid:{control:`boolean`},type:{control:`select`,options:[`text`,`email`,`password`,`search`,`tel`,`url`]}}},h={},g={args:{label:`Email`,description:`We will only use this address for account notifications.`,placeholder:`you@example.com`,type:`email`}},_={args:{label:`Username`,isRequired:!0,necessityIndicator:`label`}},v={args:{label:`Website`,value:`not-a-url`,type:`url`,isInvalid:!0,errorMessage:`Enter a valid website URL.`}},y={args:{label:`Account ID`,defaultValue:`CU-0001`,isDisabled:!0}},b={args:{label:`Website`,prefix:`https://`,placeholder:`example.com`}},x={render:()=>(0,f.jsx)(d,{})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Email",
    description: "We will only use this address for account notifications.",
    placeholder: "you@example.com",
    type: "email"
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Username",
    isRequired: true,
    necessityIndicator: "label"
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Website",
    value: "not-a-url",
    type: "url",
    isInvalid: true,
    errorMessage: "Enter a valid website URL."
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Account ID",
    defaultValue: "CU-0001",
    isDisabled: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Website",
    prefix: "https://",
    placeholder: "example.com"
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledTextFieldExample />
}`,...x.parameters?.docs?.source}}},S=[`Default`,`WithDescription`,`Required`,`Invalid`,`Disabled`,`WithPrefix`,`Controlled`]})))()}export{C as n,u as t};