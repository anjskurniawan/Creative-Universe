import{n as e}from"./rolldown-runtime-CsOFd3vK.js";import{o as t}from"./iframe-dkOi0t0j.js";import{i as n,r}from"./react-k3YPvb47.js";import{a as i,c as a,d as o,f as s,i as c,l,p as u,u as d}from"./blocks-BcDC8w0t.js";import{n as f,t as p}from"./Calendar.stories-BzM89w28.js";function m(e){let t={code:`code`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(a,{of:p}),`
`,(0,g.jsx)(s,{}),`
`,(0,g.jsx)(i,{children:(0,g.jsxs)(t.p,{children:[`Calendar menampilkan grid hari dalam satu atau beberapa bulan untuk memilih satu tanggal. Component ini adalah wrapper React Spectrum S2, sehingga style dan aksesibilitas Spectrum aktif otomatis saat diimpor dari `,(0,g.jsx)(t.code,{children:`@/components/spectrum/Calendar`}),`.`]})}),`
`,(0,g.jsx)(t.h2,{id:`qa-color-scheme`,children:`QA color scheme`}),`
`,(0,g.jsxs)(t.p,{children:[`Gunakan toolbar `,(0,g.jsx)(t.strong,{children:`Spectrum Light`}),` atau `,(0,g.jsx)(t.strong,{children:`Spectrum Dark`}),` di bagian atas Storybook untuk memeriksa tampilan Calendar pada kedua color scheme. Kontrol ini hanya memengaruhi story kategori Spectrum.`]}),`
`,(0,g.jsx)(t.h2,{id:`penggunaan-dasar`,children:`Penggunaan dasar`}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import { Calendar } from "@/components/spectrum/Calendar";

<Calendar aria-label="Tanggal pilihan" />`}),`
`,(0,g.jsxs)(t.p,{children:[(0,g.jsx)(t.code,{children:`aria-label`}),` wajib diberikan apabila Calendar tidak memiliki label visual yang terhubung. Gunakan `,(0,g.jsx)(t.code,{children:`defaultValue`}),` untuk nilai awal yang tidak dikontrol.`]}),`
`,(0,g.jsx)(l,{}),`
`,(0,g.jsx)(t.h2,{id:`nilai-controlled`,children:`Nilai controlled`}),`
`,(0,g.jsxs)(t.p,{children:[`Gunakan `,(0,g.jsx)(t.code,{children:`value`}),` dan `,(0,g.jsx)(t.code,{children:`onChange`}),` ketika tanggal perlu disimpan pada state atau disinkronkan dengan form.`]}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import { parseDate } from "@internationalized/date";
import { useState } from "react";
import { Calendar } from "@/components/spectrum/Calendar";

function Example() {
const [date, setDate] = useState(parseDate("2025-02-03"));

return <Calendar aria-label="Tanggal pilihan" value={date} onChange={setDate} />;
}`}),`
`,(0,g.jsx)(o,{title:`Contoh interaktif`,include:[`Controlled`,`TwoMonths`,`Disabled`]}),`
`,(0,g.jsx)(t.h2,{id:`validasi-dan-ketersediaan-tanggal`,children:`Validasi dan ketersediaan tanggal`}),`
`,(0,g.jsxs)(t.p,{children:[`Batasi rentang dengan `,(0,g.jsx)(t.code,{children:`minValue`}),` dan `,(0,g.jsx)(t.code,{children:`maxValue`}),`. Gunakan `,(0,g.jsx)(t.code,{children:`isDateUnavailable`}),` untuk aturan tambahan seperti tanggal penuh atau akhir pekan. `,(0,g.jsx)(t.code,{children:`isInvalid`}),` dan `,(0,g.jsx)(t.code,{children:`errorMessage`}),` digunakan jika aturan validasi berasal dari aplikasi.`]}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";

const now = today(getLocalTimeZone());

<Calendar
aria-label="Tanggal janji temu"
minValue={now}
maxValue={now.add({ months: 3 })}
isDateUnavailable={(date) => isWeekend(date, "id-ID")}
/>`}),`
`,(0,g.jsx)(t.h2,{id:`tampilan-dan-fokus`,children:`Tampilan dan fokus`}),`
`,(0,g.jsxs)(t.ul,{children:[`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`visibleMonths`}),` menampilkan beberapa bulan sekaligus.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`firstDayOfWeek`}),` mengatur awal minggu.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`focusedValue`}),` dan `,(0,g.jsx)(t.code,{children:`onFocusChange`}),` mengontrol bulan yang sedang terlihat.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`pageBehavior="visible"`}),` berpindah sebesar jumlah bulan terlihat; gunakan `,(0,g.jsx)(t.code,{children:`"single"`}),` untuk berpindah satu bulan.`]}),`
`,(0,g.jsxs)(t.li,{children:[(0,g.jsx)(t.code,{children:`isDisabled`}),` menonaktifkan Calendar; `,(0,g.jsx)(t.code,{children:`isReadOnly`}),` mempertahankan nilai tetapi tidak mengizinkan perubahan.`]}),`
`]}),`
`,(0,g.jsx)(t.h2,{id:`internasionalisasi`,children:`Internasionalisasi`}),`
`,(0,g.jsxs)(t.p,{children:[`Calendar memakai locale pengguna secara default. Berikan nilai dari `,(0,g.jsx)(t.code,{children:`@internationalized/date`}),` untuk parsing, manipulasi tanggal, zona waktu, atau sistem kalender lain. Untuk mengubah sistem kalender tampilan, gunakan `,(0,g.jsx)(t.code,{children:`Provider`}),` Spectrum dengan locale yang memakai Unicode calendar extension.`]}),`
`,(0,g.jsx)(d,{language:`tsx`,code:`import { parseDate } from "@internationalized/date";
import { Provider } from "@react-spectrum/s2/Provider";
import { Calendar } from "@/components/spectrum/Calendar";

<Provider locale="id-ID-u-ca-gregory">
<Calendar aria-label="Tanggal pilihan" defaultValue={parseDate("2025-02-03")} />
</Provider>`}),`
`,(0,g.jsx)(t.h2,{id:`api-dan-controls`,children:`API dan Controls`}),`
`,(0,g.jsxs)(t.p,{children:[`Gunakan panel Controls untuk mencoba props yang dapat dikonfigurasi. Props penting lainnya yang diteruskan langsung ke Calendar Spectrum: `,(0,g.jsx)(t.code,{children:`defaultValue`}),`, `,(0,g.jsx)(t.code,{children:`value`}),`, `,(0,g.jsx)(t.code,{children:`onChange`}),`, `,(0,g.jsx)(t.code,{children:`minValue`}),`, `,(0,g.jsx)(t.code,{children:`maxValue`}),`, `,(0,g.jsx)(t.code,{children:`isDateUnavailable`}),`, `,(0,g.jsx)(t.code,{children:`focusedValue`}),`, `,(0,g.jsx)(t.code,{children:`onFocusChange`}),`, `,(0,g.jsx)(t.code,{children:`selectionAlignment`}),`, `,(0,g.jsx)(t.code,{children:`errorMessage`}),`, dan `,(0,g.jsx)(t.code,{children:`createCalendar`}),`.`]}),`
`,(0,g.jsx)(c,{})]})}function h(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,g.jsx)(t,{...e,children:(0,g.jsx)(m,{...e})}):m(e)}var g;function _(){return(_=e((()=>{g=t(),r(),u(),f()})))()}_();export{h as default};