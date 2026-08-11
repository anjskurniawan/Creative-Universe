import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-dkOi0t0j.js";import{i as n,r}from"./react-k3YPvb47.js";import{a as i,c as a,d as o,f as s,i as c,l,p as u,u as d}from"./blocks-BcDC8w0t.js";import{n as f,t as p}from"./TextField.stories-C__OBUbg.js";function m(e){let t={code:`code`,h2:`h2`,p:`p`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(a,{of:p}),`
`,(0,g.jsx)(s,{}),`
`,(0,g.jsx)(i,{children:(0,g.jsx)(t.p,{children:`TextField is a keyboard text input for custom text entries. It supports labels, descriptions, validation, prefix decorations, controlled values, and native input types.`})}),`
`,(0,g.jsx)(t.h2,{id:`basic-usage`,children:`Basic usage`}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import {TextField} from "@/components/spectrum/TextField";

<TextField label="Name" placeholder="Enter your full name" />`}),`
`,(0,g.jsx)(l,{}),`
`,(0,g.jsx)(t.h2,{id:`controlled-value`,children:`Controlled value`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`value`}),` and `,(0,g.jsx)(t.code,{children:`onChange`}),` when the entered text needs to be stored in application state. Use `,(0,g.jsx)(t.code,{children:`defaultValue`}),` for an uncontrolled initial value.`]}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import {useState} from "react";
import {TextField} from "@/components/spectrum/TextField";

function Example() {
const [name, setName] = useState("");
return <TextField label="Name" value={name} onChange={setName} />;
}`}),`
`,(0,g.jsx)(o,{include:[`Controlled`,`WithDescription`,`Required`,`Invalid`,`Disabled`,`WithPrefix`]}),`
`,(0,g.jsx)(t.h2,{id:`validation-and-form-integration`,children:`Validation and form integration`}),`
`,(0,g.jsxs)(t.p,{children:[`Use `,(0,g.jsx)(t.code,{children:`isRequired`}),`, `,(0,g.jsx)(t.code,{children:`minLength`}),`, `,(0,g.jsx)(t.code,{children:`maxLength`}),`, `,(0,g.jsx)(t.code,{children:`pattern`}),`, `,(0,g.jsx)(t.code,{children:`type`}),`, `,(0,g.jsx)(t.code,{children:`validate`}),`, `,(0,g.jsx)(t.code,{children:`isInvalid`}),`, and `,(0,g.jsx)(t.code,{children:`errorMessage`}),` to communicate validation rules. Provide `,(0,g.jsx)(t.code,{children:`name`}),` when submitting the field in a form.`]}),`
`,(0,g.jsx)(t.h2,{id:`accessibility-and-internationalization`,children:`Accessibility and internationalization`}),`
`,(0,g.jsxs)(t.p,{children:[`Provide a visible `,(0,g.jsx)(t.code,{children:`label`}),` whenever possible. Use `,(0,g.jsx)(t.code,{children:`aria-label`}),` only when a visible label cannot be provided. TextField follows the locale and direction from the consuming Spectrum Provider.`]}),`
`,(0,g.jsx)(t.h2,{id:`api-and-controls`,children:`API and Controls`}),`
`,(0,g.jsxs)(t.p,{children:[`All props are forwarded to the React Spectrum S2 TextField. Important props include `,(0,g.jsx)(t.code,{children:`label`}),`, `,(0,g.jsx)(t.code,{children:`description`}),`, `,(0,g.jsx)(t.code,{children:`placeholder`}),`, `,(0,g.jsx)(t.code,{children:`value`}),`, `,(0,g.jsx)(t.code,{children:`defaultValue`}),`, `,(0,g.jsx)(t.code,{children:`onChange`}),`, `,(0,g.jsx)(t.code,{children:`prefix`}),`, `,(0,g.jsx)(t.code,{children:`size`}),`, `,(0,g.jsx)(t.code,{children:`isDisabled`}),`, `,(0,g.jsx)(t.code,{children:`isReadOnly`}),`, `,(0,g.jsx)(t.code,{children:`isRequired`}),`, `,(0,g.jsx)(t.code,{children:`isInvalid`}),`, `,(0,g.jsx)(t.code,{children:`errorMessage`}),`, `,(0,g.jsx)(t.code,{children:`type`}),`, and `,(0,g.jsx)(t.code,{children:`name`}),`.`]}),`
`,(0,g.jsx)(c,{}),`
`,(0,g.jsx)(t.h2,{id:`qa-color-schemes`,children:`QA color schemes`}),`
`,(0,g.jsx)(t.p,{children:`Use the Storybook Spectrum Light and Spectrum Dark toolbar controls to verify both color schemes.`})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=t(),r(),u(),f()})))()}_();export{h as default};