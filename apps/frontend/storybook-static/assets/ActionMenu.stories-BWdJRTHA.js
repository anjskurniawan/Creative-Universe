import{n as e,r as t}from"./rolldown-runtime-CsOFd3vK.js";import{t as n}from"./react-Drno7eUL.js";import{o as r}from"./iframe-BDwG_xnH.js";import{c as i,n as a,t as o}from"./Content-DsXNW_pj.js";import{a as s,i as c,n as l,r as u}from"./ActionMenu-C9eXQWnm.js";import{n as d,t as f}from"./Cut-Dhw_O4uU.js";import{i as p,n as m,r as h,t as g}from"./Paste-DwGls0F8.js";var _,v,y;function b(){return(b=e((()=>{_=r(),v=n(),u(),i(),s(),y=(0,v.forwardRef)(function(e,t){return(0,_.jsx)(`div`,{className:`spectrum-component`,children:(0,_.jsx)(l,{...e,ref:t})})}),y.__docgenInfo={description:``,methods:[],displayName:`ActionMenu`}})))()}var x=t({Controlled:()=>A,Default:()=>E,Disabled:()=>O,DisabledItems:()=>k,Quiet:()=>D,__namedExportsOrder:()=>j,default:()=>T});function S(){return(0,C.jsxs)(C.Fragment,{children:[(0,C.jsxs)(c,{textValue:`Copy`,children:[(0,C.jsx)(h,{}),(0,C.jsx)(a,{slot:`label`,children:`Copy`}),(0,C.jsx)(a,{slot:`description`,children:`Copy the selected text`}),(0,C.jsx)(o,{children:`⌘C`})]}),(0,C.jsxs)(c,{textValue:`Cut`,children:[(0,C.jsx)(f,{}),(0,C.jsx)(a,{slot:`label`,children:`Cut`}),(0,C.jsx)(a,{slot:`description`,children:`Cut the selected text`}),(0,C.jsx)(o,{children:`⌘X`})]}),(0,C.jsxs)(c,{textValue:`Paste`,children:[(0,C.jsx)(g,{}),(0,C.jsx)(a,{slot:`label`,children:`Paste`}),(0,C.jsx)(a,{slot:`description`,children:`Paste the copied text`}),(0,C.jsx)(o,{children:`⌘V`})]})]})}var C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{C=r(),w=n(),p(),d(),m(),b(),T={title:`Spectrum/ActionMenu`,component:y,parameters:{layout:`centered`},args:{children:null}},E={render:()=>(0,C.jsx)(y,{"aria-label":`More actions`,children:(0,C.jsx)(S,{})})},D={args:{isQuiet:!0},render:e=>(0,C.jsx)(y,{...e,"aria-label":`More actions`,children:(0,C.jsx)(S,{})})},O={args:{isDisabled:!0},render:e=>(0,C.jsx)(y,{...e,"aria-label":`More actions`,children:(0,C.jsx)(S,{})})},k={render:()=>(0,C.jsx)(y,{"aria-label":`More actions`,disabledKeys:[`paste`],children:(0,C.jsx)(S,{})})},A={render:()=>{let[e,t]=(0,w.useState)(!1);return(0,C.jsx)(y,{"aria-label":`More actions`,isOpen:e,onOpenChange:t,children:(0,C.jsx)(S,{})})}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <ActionMenu aria-label="More actions"><MenuItems /></ActionMenu>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    isQuiet: true
  },
  render: (args: ActionMenuProps<object>) => <ActionMenu {...args} aria-label="More actions"><MenuItems /></ActionMenu>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    isDisabled: true
  },
  render: (args: ActionMenuProps<object>) => <ActionMenu {...args} aria-label="More actions"><MenuItems /></ActionMenu>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <ActionMenu aria-label="More actions" disabledKeys={["paste"]}><MenuItems /></ActionMenu>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <ActionMenu aria-label="More actions" isOpen={isOpen} onOpenChange={setIsOpen}><MenuItems /></ActionMenu>;
  }
}`,...A.parameters?.docs?.source}}},j=[`Default`,`Quiet`,`Disabled`,`DisabledItems`,`Controlled`]})))()}export{D as a,k as i,A as n,M as o,E as r,x as t};