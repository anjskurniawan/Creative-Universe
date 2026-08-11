import{n as e,r as t}from"./rolldown-runtime-CsOFd3vK.js";import{t as n}from"./react-Drno7eUL.js";import{o as r}from"./iframe-dkOi0t0j.js";import{f as i,i as a,l as o,s}from"./Content-Dzektck5.js";import{c,o as l,r as u,t as d}from"./ComboBox-B9cHuVqC.js";var f,p,m;function h(){return(h=e((()=>{f=r(),p=n(),c(),i(),m=(0,p.forwardRef)(function(e,t){return(0,f.jsx)(`div`,{className:`spectrum-component`,children:(0,f.jsx)(u,{...e,ref:t})})}),m.__docgenInfo={description:``,methods:[],displayName:`ComboBox`}})))()}var g=t({Default:()=>y,Disabled:()=>S,WithDescriptions:()=>b,WithSections:()=>x,__namedExportsOrder:()=>C,default:()=>v}),_,v,y,b,x,S,C;function w(){return(w=e((()=>{_=r(),h(),v={title:`Spectrum/ComboBox`,component:m,parameters:{docs:{description:{component:`ComboBox allows users to choose a single option from a collapsible list.`}}},args:{label:`Favorite fruit`,placeholder:`Select a fruit`}},y={args:{children:null},render:e=>(0,_.jsxs)(m,{...e,children:[(0,_.jsx)(l,{id:`apple`,children:`Apple`}),(0,_.jsx)(l,{id:`banana`,children:`Banana`}),(0,_.jsx)(l,{id:`orange`,children:`Orange`})]})},b={args:{children:null},render:e=>(0,_.jsxs)(m,{...e,label:`Permission`,defaultSelectedKey:`read`,children:[(0,_.jsxs)(l,{id:`read`,textValue:`Read`,children:[(0,_.jsx)(a,{slot:`label`,children:`Read`}),(0,_.jsx)(a,{slot:`description`,children:`Comment only`})]}),(0,_.jsxs)(l,{id:`write`,textValue:`Write`,children:[(0,_.jsx)(a,{slot:`label`,children:`Write`}),(0,_.jsx)(a,{slot:`description`,children:`Read and write`})]})]})},x={args:{children:null},render:e=>(0,_.jsxs)(m,{...e,label:`Fruit or vegetable`,children:[(0,_.jsxs)(d,{children:[(0,_.jsxs)(s,{children:[(0,_.jsx)(o,{children:`Fruit`}),(0,_.jsx)(a,{slot:`description`,children:`Sweet and nutritious`})]}),(0,_.jsx)(l,{id:`apple`,children:`Apple`}),(0,_.jsx)(l,{id:`banana`,children:`Banana`})]}),(0,_.jsxs)(d,{children:[(0,_.jsx)(s,{children:(0,_.jsx)(o,{children:`Vegetable`})}),(0,_.jsx)(l,{id:`carrot`,children:`Carrot`}),(0,_.jsx)(l,{id:`spinach`,children:`Spinach`})]})]})},S={args:{children:null,isDisabled:!0},render:e=>(0,_.jsx)(m,{...e,children:(0,_.jsx)(l,{id:`one`,children:`Unavailable`})})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: args => <ComboBox {...args}>\r
      <ComboBoxItem id="apple">Apple</ComboBoxItem>\r
      <ComboBoxItem id="banana">Banana</ComboBoxItem>\r
      <ComboBoxItem id="orange">Orange</ComboBoxItem>\r
    </ComboBox>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: args => <ComboBox {...args} label="Permission" defaultSelectedKey="read">\r
      <ComboBoxItem id="read" textValue="Read"><Text slot="label">Read</Text><Text slot="description">Comment only</Text></ComboBoxItem>\r
      <ComboBoxItem id="write" textValue="Write"><Text slot="label">Write</Text><Text slot="description">Read and write</Text></ComboBoxItem>\r
    </ComboBox>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: null
  },
  render: args => <ComboBox {...args} label="Fruit or vegetable">\r
      <ComboBoxSection>\r
        <Header><Heading>Fruit</Heading><Text slot="description">Sweet and nutritious</Text></Header>\r
        <ComboBoxItem id="apple">Apple</ComboBoxItem>\r
        <ComboBoxItem id="banana">Banana</ComboBoxItem>\r
      </ComboBoxSection>\r
      <ComboBoxSection>\r
        <Header><Heading>Vegetable</Heading></Header>\r
        <ComboBoxItem id="carrot">Carrot</ComboBoxItem>\r
        <ComboBoxItem id="spinach">Spinach</ComboBoxItem>\r
      </ComboBoxSection>\r
    </ComboBox>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: null,
    isDisabled: true
  },
  render: args => <ComboBox {...args}><ComboBoxItem id="one">Unavailable</ComboBoxItem></ComboBox>
}`,...S.parameters?.docs?.source}}},C=[`Default`,`WithDescriptions`,`WithSections`,`Disabled`]})))()}export{x as a,b as i,y as n,w as o,S as r,g as t};