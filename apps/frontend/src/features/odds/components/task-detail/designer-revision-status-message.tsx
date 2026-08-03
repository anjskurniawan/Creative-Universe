export function DesignerRevisionStatusMessage({ status, message }: { status: string; message: string }) {
  return <div className="rounded-lg border border-cu-info/25 bg-cu-info/5 p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-cu-ink">Status Revisi</span><span className="rounded-md bg-cu-info px-2 py-1 text-[10px] font-bold capitalize text-white">{status}</span></div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-cu-muted">{message}</p></div>;
}
