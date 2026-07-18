"use client";

import { CreativeUniverseLogo } from "@/design-system/atoms/brand/creative-universe-logo";
import type { KvRetailTask } from "@/features/kv-retail/api";

const STEPS = [
  { status: "ACC Draft", timestamp: "ACC Draft", label: "ACC Draft", icon: "task" },
  { status: "Progress Design", timestamp: "Progress", label: "Progress Design", icon: "edit_square" },
  { status: "Approval Design", timestamp: "Approve", label: "Approval Design", icon: "person_check" },
  { status: "Kirim Email", timestamp: "Email", label: "Kirim Email", icon: "forward_to_inbox" },
] as const;

function FigmaStepIcon({ name, color, soft }: { name: string; color: string; soft: string }) {
  if (name === "task") {
    return <svg viewBox="0 0 44 44" className="size-[44px]" fill="none" aria-hidden="true"><rect width="44" height="44" rx="22" fill={soft} /><path d="M20.95 28L26.6 22.35L25.15 20.9L20.925 25.125L18.825 23.025L17.4 24.45L20.95 28ZM16 32C15.45 32 14.9792 31.8042 14.5875 31.4125C14.1958 31.0208 14 30.55 14 30V14C14 13.45 14.1958 12.9792 14.5875 12.5875C14.9792 12.1958 15.45 12 16 12H24L30 18V30C30 30.55 29.8042 31.0208 29.4125 31.4125C29.0208 31.8042 28.55 32 28 32H16ZM23 19V14H16V30H28V19H23Z" fill={color} /></svg>;
  }
  const paths: Record<string, string> = {
    edit_square: "M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H13.925L11.925 5H5V19H19V12.05L21 10.05V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM9 15V10.75L18.175 1.575C18.375 1.375 18.6 1.225 18.85 1.125C19.1 1.025 19.35 0.975 19.6 0.975C19.8667 0.975 20.1208 1.025 20.3625 1.125C20.6042 1.225 20.825 1.375 21.025 1.575L22.425 3C22.6083 3.2 22.75 3.42083 22.85 3.6625C22.95 3.90417 23 4.15 23 4.4C23 4.65 22.9542 4.89583 22.8625 5.1375C22.7708 5.37917 22.625 5.6 22.425 5.8L13.25 15H9ZM11 13H12.4L18.2 7.2L17.5 6.5L16.775 5.8L11 11.575V13Z",
    person_check: "M17.55 12L14 8.45L15.425 7.05L17.55 9.175L21.8 4.925L23.2 6.35L17.55 12ZM6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12C7.9 12 6.95833 11.6083 6.175 10.825ZM1 20V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C10.1 13 11.1833 13.1292 12.25 13.3875C13.3167 13.6458 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2708 15.1625 16.5625 15.6375C16.8542 16.1125 17 16.6333 17 17.2V20H1ZM3 18H15V17.2C15 17.0167 14.9542 16.85 14.8625 16.7C14.7708 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5625 11.775 15.3375C10.8583 15.1125 9.93333 15 9 15C8.06667 15 7.14167 15.1125 6.225 15.3375C5.30833 15.5625 4.4 15.9 3.5 16.35C3.35 16.4333 3.22917 16.55 3.1375 16.7C3.04583 16.85 3 17.0167 3 17.2V18ZM10.4125 9.4125C10.8042 9.02083 11 8.55 11 8C11 7.45 10.8042 6.97917 10.4125 6.5875C10.0208 6.19583 9.55 6 9 6C8.45 6 7.97917 6.19583 7.5875 6.5875C7.19583 6.97917 7 7.45 7 8C7 8.55 7.19583 9.02083 7.5875 9.4125C7.97917 9.80417 8.45 10 9 10C9.55 10 10.0208 9.80417 10.4125 9.4125Z",
    forward_to_inbox: "M12 13L4 8V18H13V20H4C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V13H20V8L12 13ZM12 11L20 6H4L12 11ZM19 23L17.6 21.6L19.175 20H15V18H19.175L17.575 16.4L19 15L23 19L19 23ZM4 8V19V13V13.075V6V8Z",
  };
  return <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true"><path d={paths[name]} fill={color} /></svg>;
}

function FigmaUiIcon({ name, color = "#2baf33", soft = "#e4f9db", className = "" }: { name: "check" | "calendar-small" | "account" | "calendar" | "stars"; color?: string; soft?: string; className?: string }) {
  const paths = {
    check: "M10.6 16.6L17.65 9.55L16.25 8.15L10.6 13.8L7.75 10.95L6.35 12.35L10.6 16.6ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z",
    "calendar-small": "M3.14998 12.6C2.86123 12.6 2.61404 12.4955 2.40841 12.2865C2.20279 12.0775 2.09998 11.832 2.09998 11.55V3.85002C2.09998 3.56808 2.20279 3.32259 2.40841 3.11357C2.61404 2.90454 2.86123 2.80002 3.14998 2.80002H4.19998V1.40002H5.24998V2.80002H8.74997V1.40002H9.79997V2.80002H10.85C11.1387 2.80002 11.3859 2.90454 11.5915 3.11357C11.7972 3.32259 11.9 3.56808 11.9 3.85002V11.55C11.9 11.832 11.7972 12.0775 11.5915 12.2865C11.3859 12.4955 11.1387 12.6 10.85 12.6H3.14998ZM3.14998 11.55H10.85V6.30002H3.14998V11.55ZM3.14998 5.25002H10.85V3.85002H3.14998V5.25002ZM7.00304 8.40002C6.85516 8.40002 6.73018 8.35 6.6281 8.24996C6.52602 8.14992 6.47498 8.02596 6.47498 7.87809C6.47498 7.73021 6.525 7.60523 6.62504 7.50315C6.72508 7.40107 6.84904 7.35002 6.99691 7.35002C7.14479 7.35002 7.26977 7.40005 7.37185 7.50009C7.47393 7.60013 7.52497 7.72409 7.52497 7.87196C7.52497 8.01984 7.47495 8.14482 7.37491 8.2469C7.27487 8.34898 7.15091 8.40002 7.00304 8.40002ZM4.3531 8.24996C4.25102 8.14992 4.19998 8.02596 4.19998 7.87809C4.19998 7.73021 4.25 7.60523 4.35004 7.50315C4.45008 7.40107 4.57404 7.35002 4.72191 7.35002C4.86979 7.35002 4.99477 7.40005 5.09685 7.50009C5.19893 7.60013 5.24998 7.72409 5.24998 7.87196C5.24998 8.01984 5.19995 8.14482 5.09991 8.2469C4.99987 8.34898 4.87591 8.40002 4.72804 8.40002C4.58016 8.40002 4.45518 8.35 4.3531 8.24996ZM9.27804 8.40002C9.13016 8.40002 9.00518 8.35 8.9031 8.24996C8.80102 8.14992 8.74997 8.02596 8.74997 7.87809C8.74997 7.73021 8.8 7.60523 8.90004 7.50315C9.00008 7.40107 9.12404 7.35002 9.27191 7.35002C9.41979 7.35002 9.54477 7.40005 9.64685 7.50009C9.74893 7.60013 9.79997 7.72409 9.79997 7.87196C9.79997 8.01984 9.74995 8.14482 9.64991 8.2469C9.54987 8.34898 9.42591 8.40002 9.27804 8.40002ZM7.00304 10.5C6.85516 10.5 6.73018 10.45 6.6281 10.35C6.52602 10.2499 6.47498 10.126 6.47498 9.97809C6.47498 9.83021 6.525 9.70523 6.62504 9.60315C6.72508 9.50107 6.84904 9.45002 6.99691 9.45002C7.14479 9.45002 7.26977 9.50005 7.37185 9.60009C7.47393 9.70013 7.52497 9.82409 7.52497 9.97196C7.52497 10.1198 7.47495 10.2448 7.37491 10.3469C7.27487 10.449 7.15091 10.5 7.00304 10.5ZM4.3531 10.35C4.25102 10.2499 4.19998 10.126 4.19998 9.97809C4.19998 9.83021 4.25 9.70523 4.35004 9.60315C4.45008 9.50107 4.57404 9.45002 4.72191 9.45002C4.86979 9.45002 4.99477 9.50005 5.09685 9.60009C5.19893 9.70013 5.24998 9.82409 5.24998 9.97196C5.24998 10.1198 5.19995 10.2448 5.09991 10.3469C4.99987 10.449 4.87591 10.5 4.72804 10.5C4.58016 10.5 4.45518 10.45 4.3531 10.35ZM9.27804 10.5C9.13016 10.5 9.00518 10.45 8.9031 10.35C8.80102 10.2499 8.74997 10.126 8.74997 9.97809C8.74997 9.83021 8.8 9.70523 8.90004 9.60315C9.00008 9.50107 9.12404 9.45002 9.27191 9.45002C9.41979 9.45002 9.54477 9.50005 9.64685 9.60009C9.74893 9.70013 9.79997 9.82409 9.79997 9.97196C9.79997 10.1198 9.74995 10.2448 9.64991 10.3469C9.54987 10.449 9.42591 10.5 9.27804 10.5Z",
    account: "M11.85 23.1C12.7 22.45 13.65 21.938 14.7 21.563C15.75 21.188 16.85 21 18 21C19.15 21 20.25 21.188 21.3 21.563C22.35 21.938 23.3 22.45 24.15 23.1C24.733 22.417 25.188 21.642 25.513 20.775C25.838 19.908 26 18.983 26 18C26 15.783 25.221 13.896 23.663 12.338C22.104 10.779 20.217 10 18 10C15.783 10 13.896 10.779 12.338 12.338C10.779 13.896 10 15.783 10 18C10 18.983 10.163 19.908 10.488 20.775C10.813 21.642 11.267 22.417 11.85 23.1ZM15.513 17.988C14.838 17.313 14.5 16.483 14.5 15.5C14.5 14.517 14.838 13.688 15.513 13.013C16.188 12.338 17.017 12 18 12C18.983 12 19.813 12.338 20.488 13.013C21.163 13.688 21.5 14.517 21.5 15.5C21.5 16.483 21.163 17.313 20.488 17.988C19.813 18.663 18.983 19 18 19C17.017 19 16.188 18.663 15.513 17.988ZM18 28C16.617 28 15.317 27.738 14.1 27.213C12.883 26.688 11.825 25.975 10.925 25.075C10.025 24.175 9.313 23.117 8.788 21.9C8.263 20.683 8 19.383 8 18C8 16.617 8.263 15.317 8.788 14.1C9.313 12.883 10.025 11.825 10.925 10.925C11.825 10.025 12.883 9.313 14.1 8.788C15.317 8.263 16.617 8 18 8C19.383 8 20.683 8.263 21.9 8.788C23.117 9.313 24.175 10.025 25.075 10.925C25.975 11.825 26.688 12.883 27.213 14.1C27.738 15.317 28 16.617 28 18C28 19.383 27.738 20.683 27.213 21.9C26.688 23.117 25.975 24.175 25.075 25.075C24.175 25.975 23.117 26.688 21.9 27.213C20.683 27.738 19.383 28 18 28Z",
    calendar: "M11 28C10.45 28 9.979 27.804 9.588 27.413C9.196 27.021 9 26.55 9 26V12C9 11.45 9.196 10.979 9.588 10.588C9.979 10.196 10.45 10 11 10H12V8H14V10H22V8H24V10H25C25.55 10 26.021 10.196 26.413 10.588C26.804 10.979 27 11.45 27 12V26C27 26.55 26.804 27.021 26.413 27.413C26.021 27.804 25.55 28 25 28H11ZM11 26H25V16H11V26ZM11 14H25V12H11V14Z",
    stars: "M8.85 16.825L12 14.925L15.15 16.85L14.325 13.25L17.1 10.85L13.45 10.525L12 7.125L10.55 10.5L6.9 10.825L9.675 13.25L8.85 16.825ZM5.825 21L7.45 13.975L2 9.25L9.2 8.625L12 2L14.8 8.625L22 9.25L16.55 13.975L18.175 21L12 17.275L5.825 21ZM17.25 7L17.775 4.775L16 3.3L18.35 3.1L19.25 1L20.15 3.1L22.5 3.3L20.725 4.775L21.25 7L19.25 5.825L17.25 7Z",
  };
  const isLarge = name === "account" || name === "calendar";
  const size = isLarge ? 36 : name === "calendar-small" ? 14 : 24;
  return <svg viewBox={`0 0 ${size} ${size}`} className={className} fill="none" aria-hidden="true">{isLarge && <rect width={size} height={size} rx={size / 2} fill={soft} />}<path d={paths[name]} fill={color} /></svg>;
}

function dateParts(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return {
    day: safeDate.toLocaleDateString("id-ID", { weekday: "long" }),
    date: String(safeDate.getDate()).padStart(2, "0"),
    monthYear: safeDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" }).toUpperCase(),
  };
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function formatSubmitDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function agentSuggestions(content?: string | null, isGenerating = false): string[] {
  if (!content) return [isGenerating ? "Creative Agent sedang menyiapkan saran terbaru." : "Creative Agent belum menghasilkan saran yang dapat ditampilkan."];

  const suggestions = content
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return suggestions.length ? suggestions : ["Creative Agent belum menghasilkan saran yang dapat ditampilkan."];
}

export function TaskPrintPreview({ task, creativeAgentContent, isCreativeAgentGenerating = false }: { task: KvRetailTask; creativeAgentContent?: string | null; isCreativeAgentGenerating?: boolean }) {
  const done = task.status === "Done";
  const violation = Object.entries(task.timing_evaluation?.violations ?? {}).find(([, value]) => value?.late)?.[0];
  // A deadline violation is late, not automatically a bottleneck. The API's
  // dedicated bottleneck flag determines the green bottleneck variant.
  const green = done;
  const primary = green ? "#2baf33" : "#6931f1";
  const soft = green ? "#e4f9db" : "#eeecfc";
  const border = green ? "#00aa0a" : "#6931f1";
  const parts = dateParts(task.task_given_date);
  const suggestions = agentSuggestions(creativeAgentContent, isCreativeAgentGenerating);

  return (
    <article className="flex min-h-[632px] w-[403px] flex-col items-center justify-center gap-2 rounded-2xl p-4 font-sans text-black" style={{ backgroundColor: green ? "#f5fff2" : "#eeecfc" }}>
      <header className="flex w-full items-center justify-between border-b pb-2" style={{ borderColor: primary, borderBottomWidth: "0.2px" }}>
        <div className="flex items-center gap-2">
          <div className="flex size-[38px] items-center justify-center rounded-lg bg-black p-1 text-white"><CreativeUniverseLogo className="h-6 w-[22.109px]" /></div>
          <div><p className="text-[13px] font-semibold leading-4 tracking-[-0.13px]">Creative Universe</p><p className="text-[10px] leading-[13px]">ODDS</p></div>
        </div>
        <FigmaUiIcon name="check" color="#000000" className="size-6" />
      </header>

      <section className="flex w-full items-start gap-2">
        <div className="flex w-[88px] shrink-0 flex-col items-center justify-center rounded-xl p-3 text-center text-white" style={{ backgroundColor: primary }}><span className="text-xs">{parts.day}</span><strong className="text-[36px] leading-9">{parts.date}</strong><span className="text-xs">{parts.monthYear}</span></div>
        <div className="flex min-w-0 flex-1 flex-col justify-center self-stretch gap-1"><h1 className="text-[24px] font-semibold leading-[29px]">{task.task_name || "Untitled task"}</h1><div className="flex w-fit items-center gap-1 rounded border px-2 py-1 text-[10px] leading-[13px]" style={{ backgroundColor: soft, borderColor: border, borderWidth: "0.1px", color: primary }}><FigmaUiIcon name="calendar-small" color={primary} className="size-[14px]" />Tugas di Submit tanggal {formatSubmitDate(task.task_given_date)}</div></div>
      </section>

      <section className="flex w-full flex-col gap-[14px] rounded-lg bg-white p-2">
        <div className="flex items-center gap-2"><FigmaUiIcon name="account" color="#2f2f2f" soft={soft} className="size-9" /><div><p className="text-[10px] text-[#9a9a9a]">Vendor</p><p className="text-sm font-semibold text-[#2f2f2f]">{task.pic_vendor || "-"}</p></div></div>
        <div className="flex items-center gap-2"><FigmaUiIcon name="calendar" color={primary} soft={soft} className="size-9" /><div><p className="text-[10px] text-[#9a9a9a]">Deadline</p><p className="text-sm font-semibold text-[#4b4b4b]">{formatDate(task.deadline_date)}</p></div></div>
      </section>

      <section className="w-full rounded-lg bg-white p-2"><h2 className="text-sm font-semibold text-[#2f2f2f]">Progress</h2><div className="mt-2 flex w-full items-center justify-between py-2">{STEPS.map((step, index) => {
        const delayed = violation === step.status || violation === step.label;
        const timestamp = task.task_timestamps?.[step.timestamp];
        const pending = !done && !timestamp;
        const color = pending ? "#9ca3af" : delayed ? "#f13131" : primary;
        const stepSoft = pending ? "#f3f4f6" : delayed ? "#fcecec" : soft;
        const stepBorder = pending ? "#d1d5db" : delayed ? "#f13131" : color;
        const widthClass = index === 0 ? "w-[67px]" : index === 1 ? "w-[96px]" : index === 2 ? "w-[87px]" : "w-[80px]";
        return <div key={step.status} className={`flex ${widthClass} shrink-0 flex-col items-center gap-1 text-center`}><p className="h-[13px] whitespace-nowrap text-[8px] leading-[13px]" style={{ color }}>{timestamp || ""}</p><div className="flex size-[44px] items-center justify-center rounded-full" style={{ backgroundColor: stepSoft }}><FigmaStepIcon name={step.icon} color={color} soft={stepSoft} /></div><span className="flex h-[21px] w-full items-center justify-center whitespace-nowrap rounded border px-1 py-1 text-[8px] leading-[13px]" style={{ backgroundColor: stepSoft, borderColor: stepBorder, borderWidth: "0.1px", color }}>{step.label}</span></div>;
      })}</div></section>

      <section className="w-full rounded-lg bg-white p-2"><h2 className="text-sm font-semibold text-[#2f2f2f]">Detail</h2><div className="flex items-start gap-2 py-2"><div className="flex h-[126px] w-[126px] shrink-0 items-center justify-center gap-1 rounded border p-2 text-center" style={{ backgroundColor: soft, borderColor: border, borderWidth: "0.1px", color: primary }}><FigmaUiIcon name="stars" color={primary} className="size-6" /><span className="text-[10px] font-semibold leading-[13px]">Creative Agent Suggest</span></div><ul className="flex flex-1 list-disc flex-col gap-[5px] pl-4 pt-1 text-[10px] leading-[13px] text-[#555]">{suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul></div></section>
    </article>
  );
}
