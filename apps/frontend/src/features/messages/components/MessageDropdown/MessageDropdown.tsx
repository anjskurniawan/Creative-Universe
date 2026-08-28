"use client";
import Dropdown from "@/components/layout/NavBar/Dropdown/Dropdown";
export type MessageItem = {
  id: string;
  sender: string;
  preview: string;
  time: string;
  unread?: boolean;
};
export default function MessageDropdown({
  isOpen,
  onClose,
  messages = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  messages?: MessageItem[];
}) {
  return (
    <Dropdown
      isOpen={isOpen}
      onClose={onClose}
      className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[280px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 max-lg:fixed max-lg:left-2 max-lg:right-2 max-lg:top-[72px] max-lg:w-auto max-lg:max-w-none"
    >
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#04044a]">
          Pesan
        </h3>
        {messages.some((message) => message.unread) && (
          <span className="size-2 rounded-full bg-[#ec4899]" />
        )}
      </div>
      <ul className="m-0 flex max-h-[240px] list-none flex-col gap-1 overflow-y-auto p-1">
        {messages.length ? (
          messages.map((message) => (
            <li key={message.id}>
              <button
                type="button"
                onClick={onClose}
                className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-slate-50 ${message.unread ? "bg-slate-50" : ""}`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#04044a] text-[10px] font-semibold text-white">
                  {message.sender.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-1">
                    <b className="truncate text-xs text-[#04044a]">
                      {message.sender}
                    </b>
                    <small className="text-[10px] text-[#5b7190]">
                      {message.time}
                    </small>
                  </span>
                  <span className="block truncate text-[11px] text-[#5b7190]">
                    {message.preview}
                  </span>
                </span>
              </button>
            </li>
          ))
        ) : (
          <li className="px-3 py-4 text-center text-xs text-[#5b7190]">
            Tidak ada pesan masuk
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
