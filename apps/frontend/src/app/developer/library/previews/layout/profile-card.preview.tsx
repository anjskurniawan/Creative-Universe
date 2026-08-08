import ProfileCard from "@/components/layout/profile/card";
import { PreviewWrapper } from "../preview-wrapper";

export function ProfileCardPreview() {
  return (
    <PreviewWrapper width="lg">
      <div className="flex min-h-[200px] w-full justify-center rounded-xl border border-slate-100 bg-slate-50 p-6">
        <div className="w-80">
          <ProfileCard name="Rian Setiawan" role="Lead Frontend Engineer" departments={["Creative Tech"]} />
        </div>
      </div>
    </PreviewWrapper>
  );
}
