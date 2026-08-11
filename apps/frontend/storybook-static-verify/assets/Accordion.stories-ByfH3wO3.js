import{n as e,r as t}from"./rolldown-runtime-CsOFd3vK.js";import{t as n}from"./react-Drno7eUL.js";import{o as r}from"./iframe-dkOi0t0j.js";import{i,r as a}from"./ActionButton-DB9jnDn2.js";import{n as o,t as s}from"./useSpectrumContextProps-Dk-QyBK8.js";import{i as c,r as l}from"./useDOMRef-C08O6FHm.js";import{a as u,c as d,i as f,n as p,o as m,r as h,s as g,t as _}from"./Disclosure-D9Jn_tLH.js";var v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{m(),c(),o(),v=r(),d(),y=n(),b=function(e,t){let n=` `;return n+=(String(t||``).match(/(?:^|\s)(J|G|I|H|_u|_v|_s|__A|_d|_J|z|y|B|A|_P|_9|W|_l|_A|_z|_6|Z|N|L|F|M|K)[^\s]+/g)||[]).join(``),n+=` sd16`,n+=` _ta16`,n},x=(0,y.createContext)(null),S=(0,y.forwardRef)(function(e,t){[e,t]=s(e,t,x);let n=l(t),{UNSAFE_style:r,UNSAFE_className:i=``,size:a=`M`,density:o=`regular`,isQuiet:c}=e;return(0,v.jsx)(f.Provider,{value:{size:a,isQuiet:c,density:o},children:(0,v.jsx)(g,{...e,ref:n,style:r,className:(i??``)+b(null,e.styles),children:e.children})})}),C=(0,y.forwardRef)(function(e,t){return(0,v.jsx)(p,{...e,ref:t})}),w=(0,y.forwardRef)(function(e,t){return(0,v.jsx)(h,{...e,ref:t})}),T=(0,y.forwardRef)(function(e,t){return(0,v.jsx)(_,{...e,ref:t})}),E=(0,y.forwardRef)(function(e,t){return(0,v.jsx)(u,{...e,ref:t})})})))()}var O,k,A;function j(){return(j=e((()=>{O=r(),k=n(),D(),A=(0,k.forwardRef)(function(e,t){return(0,O.jsx)(`div`,{className:`spectrum-component`,children:(0,O.jsx)(S,{...e,ref:t})})}),A.__docgenInfo={description:``,methods:[],displayName:`Accordion`}})))()}var M=t({Controlled:()=>B,Default:()=>R,MultipleExpanded:()=>z,WithHeaderActions:()=>V,__namedExportsOrder:()=>H,default:()=>L});function N(e){return(0,F.jsxs)(A,{...e,children:[(0,F.jsxs)(C,{id:`settings`,children:[(0,F.jsx)(w,{children:`Settings`}),(0,F.jsx)(E,{children:`Application settings content.`})]}),(0,F.jsxs)(C,{id:`preferences`,children:[(0,F.jsx)(w,{children:`Preferences`}),(0,F.jsx)(E,{children:`User preferences content.`})]}),(0,F.jsxs)(C,{id:`advanced`,children:[(0,F.jsx)(w,{children:`Advanced`}),(0,F.jsx)(E,{children:`Advanced configuration options.`})]})]})}function P(){let[e,t]=(0,I.useState)(new Set([`settings`]));return(0,F.jsx)(N,{expandedKeys:e,onExpandedChange:t})}var F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{F=r(),i(),I=n(),j(),L={title:`Spectrum/Accordion`,component:A,parameters:{layout:`centered`,docs:{description:{component:`A container for multiple expandable accordion items.`}}},args:{children:null},argTypes:{allowsMultipleExpanded:{control:`boolean`,description:`Whether multiple accordion items can be expanded at the same time.`},density:{control:`select`,options:[`compact`,`regular`,`spacious`],description:`The amount of space between accordion items.`},isDisabled:{control:`boolean`,description:`Whether all accordion items are disabled.`},isQuiet:{control:`boolean`,description:`Whether the accordion is displayed with a quiet style.`},size:{control:`select`,options:[`S`,`M`,`L`,`XL`],description:`The size of the accordion.`}},render:e=>(0,F.jsx)(N,{...e})},R={args:{defaultExpandedKeys:[`settings`]}},z={args:{allowsMultipleExpanded:!0,defaultExpandedKeys:[`settings`,`preferences`]}},B={render:()=>(0,F.jsx)(P,{})},V={render:()=>(0,F.jsxs)(A,{children:[(0,F.jsxs)(C,{id:`project`,children:[(0,F.jsxs)(T,{children:[(0,F.jsx)(w,{children:`Project Settings`}),(0,F.jsx)(a,{"aria-label":`Edit project settings`,children:`Edit`})]}),(0,F.jsx)(E,{children:`Configure your project settings including name, description, and permissions.`})]}),(0,F.jsxs)(C,{id:`preferences`,children:[(0,F.jsx)(w,{children:`Preferences`}),(0,F.jsx)(E,{children:`User preferences content.`})]})]})},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    defaultExpandedKeys: ["settings"]
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    allowsMultipleExpanded: true,
    defaultExpandedKeys: ["settings", "preferences"]
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledAccordionExample />
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion>\r
      <AccordionItem id="project">\r
        <AccordionItemHeader>\r
          <AccordionItemTitle>Project Settings</AccordionItemTitle>\r
          <ActionButton aria-label="Edit project settings">Edit</ActionButton>\r
        </AccordionItemHeader>\r
        <AccordionItemPanel>\r
          Configure your project settings including name, description, and permissions.\r
        </AccordionItemPanel>\r
      </AccordionItem>\r
      <AccordionItem id="preferences">\r
        <AccordionItemTitle>Preferences</AccordionItemTitle>\r
        <AccordionItemPanel>User preferences content.</AccordionItemPanel>\r
      </AccordionItem>\r
    </Accordion>
}`,...V.parameters?.docs?.source}}},H=[`Default`,`MultipleExpanded`,`Controlled`,`WithHeaderActions`]})))()}export{U as n,M as t};