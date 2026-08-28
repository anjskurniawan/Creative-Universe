"use client";

import { Toast } from "@/components/feedback/Toast/Toast";
import { EditMemberHeader } from "@/app/creative-report/creative-agent/edit/_components/EditMemberHeader/EditMemberHeader";
import { EditMemberTabs } from "@/app/creative-report/creative-agent/edit/_components/EditMemberTabs/EditMemberTabs";
import { EditMemberPersonalTab } from "@/app/creative-report/creative-agent/edit/_components/EditMemberPersonalTab/EditMemberPersonalTab";
import { EditMemberSpecialtiesTab } from "@/app/creative-report/creative-agent/edit/_components/EditMemberSpecialtiesTab/EditMemberSpecialtiesTab";
import { useEditMember } from "@/app/creative-report/creative-agent/edit/use-edit-member";

export default function EditCreativeMemberPage() {
  const {
    member,
    setMember,
    categories,
    image,
    setImage,
    saving,
    error,
    setError,
    activeTab,
    setActiveTab,
    selected,
    photo,
    photoIsVideo,
    save,
  } = useEditMember();

  // Tampilan loading atau error jika data profil belum berhasil dimuat
  if (!member) {
    return <p className="p-4 text-sm text-[#7b868a]">{error ?? "Memuat profil anggota..."}</p>;
  }

  // --- RENDER UI ---
  return (
    <main className="cu-style flex h-full min-w-0 w-full flex-1 flex-col">
      {/* Header Halaman */}
      <EditMemberHeader name={member.name} />

      {/* Global Toast Error Portal */}
      {error && <Toast message={error} status="error" onClose={() => setError(null)} />}

      {/* Wrapper Konten Formulir */}
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-[#e1e8eb] bg-white shadow-sm">
        {/* Navigasi Tab Pengaturan */}
        <EditMemberTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Area Konten Tab */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          {/* TAB 1: IDENTITAS / PERSONAL */}
          {activeTab === "identity" && (
            <EditMemberPersonalTab
              member={member}
              setMember={setMember}
              image={image}
              setImage={setImage}
              photo={photo}
              photoIsVideo={photoIsVideo}
              saving={saving}
              onSave={save}
            />
          )}

          {/* TAB 2: SPESIALISASI ODDS */}
          {activeTab === "specialties" && (
            <EditMemberSpecialtiesTab
              member={member}
              setMember={setMember}
              categories={categories}
              selected={selected}
              saving={saving}
              onSave={save}
            />
          )}
        </div>
      </div>
    </main>
  );
}
