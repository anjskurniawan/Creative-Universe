export interface AuthCardFooterProps {
  text: string;
}

export function AuthCardFooter({ text }: AuthCardFooterProps) {
  return (
    <div className="bg-white border-t border-divider flex items-center px-6 py-4 w-full shrink-0 min-h-[52px] rounded-b-[16px]">
      <p className="font-sans font-normal text-[12px] text-slate-400 tracking-[0.6px] leading-[1.5] w-full">
        {text}
      </p>
    </div>
  );
}
