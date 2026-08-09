import{n as e,r as t}from"./rolldown-runtime-CsOFd3vK.js";import{t as n}from"./react-Drno7eUL.js";import{o as r}from"./iframe-BDwG_xnH.js";import{n as i,r as a}from"./ActionButton-BA78BW0k.js";import{n as o,t as s}from"./Cut-Dhw_O4uU.js";var c,l,u;function d(){return(d=e((()=>{c=r(),l=n(),a(),u=(0,l.forwardRef)(function(e,t){return(0,c.jsx)(`div`,{className:`spectrum-component`,children:(0,c.jsx)(i,{...e,ref:t})})}),u.__docgenInfo={description:``,methods:[],displayName:`ActionButton`}})))()}var f=t({Default:()=>_,Disabled:()=>b,InteractivePending:()=>S,Pending:()=>x,Quiet:()=>y,WithIcon:()=>v,__namedExportsOrder:()=>C,default:()=>g});function p(){let[e,t]=(0,h.useState)(!1);return(0,m.jsx)(u,{isPending:e,onPress:()=>{t(!0),window.setTimeout(()=>t(!1),1e3)},children:`Save`})}var m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{m=r(),h=n(),o(),d(),g={title:`Spectrum/ActionButton`,component:u,parameters:{layout:`centered`,docs:{description:{component:`ActionButtons allow users to perform an action with a quiet, task-focused visual treatment.`}}},args:{children:`Edit`},argTypes:{isDisabled:{control:`boolean`,description:`Whether the button is disabled.`},isPending:{control:`boolean`,description:`Whether the button is in a pending state.`},isQuiet:{control:`boolean`,description:`Whether the button uses the quiet style.`},size:{control:`select`,options:[`XS`,`S`,`M`,`L`,`XL`],description:`Size of the ActionButton.`},staticColor:{control:`select`,options:[`auto`,`black`,`white`],description:`Static color style over a color background.`},onPress:{action:`pressed`,description:`Handler called when the press is released over the target.`}}},_={},v={render:()=>(0,m.jsxs)(u,{"aria-label":`Cut`,children:[(0,m.jsx)(s,{}),`Cut`]})},y={args:{isQuiet:!0}},b={args:{isDisabled:!0}},x={args:{isPending:!0,children:`Saving`}},S={render:()=>(0,m.jsx)(p,{})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <ActionButton aria-label="Cut"><Cut />Cut</ActionButton>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    isQuiet: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    isDisabled: true
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    isPending: true,
    children: "Saving"
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <PendingExample />
}`,...S.parameters?.docs?.source}}},C=[`Default`,`WithIcon`,`Quiet`,`Disabled`,`Pending`,`InteractivePending`]})))()}export{w as n,f as t};