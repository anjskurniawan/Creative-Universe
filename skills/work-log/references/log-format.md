# Work Log Entry Specification

## Entry Template

Create one Markdown block with this exact field order. Replace every placeholder; use `Tidak ada` when a field does not apply.

```markdown
---
## YYYY-MM-DD HH:mm:ss TZ - Judul singkat

- **Entry ID:** `UUID`
- **Timestamp:** `YYYY-MM-DDTHH:mm:ss+TZ`
- **Agent/Model:** `Identitas aktual` or `Tidak diketahui`
- **Task/Thread ID:** `ID aktual` or `Tidak ada`
- **Tags:** `tag-1`, `tag-2`
- **Status:** `Selesai` / `Selesai sebagian` / `Analisis` / `Review` / `Terblokir` / `Dibatalkan`
- **User Instruction:** Ringkasan setia terhadap instruksi pengguna.
- **Interpretation and Scope:** Batas pekerjaan yang dipahami dan dikerjakan.
- **Relevant Prior Context:** Entri, keputusan, atau instruksi terdahulu yang digunakan.
- **Assumptions:** Asumsi yang benar-benar dibuat, atau `Tidak ada`.
- **Decisions:** Keputusan dan alasan penting.
- **Work Performed:** Tindakan yang benar-benar dilakukan.
- **Result:** Hasil aktual dan kondisi akhir.
- **Reference Files Inspected:** Path atau `Tidak ada`.
- **Reference Files Changed:** Path dan jenis perubahan, atau `Tidak ada`.
- **Files Created, Moved, or Deleted:** Path dan tindakan, atau `Tidak ada`.
- **Commands and Tools Used:** Nama command/tool yang sudah disanitasi, atau `Tidak ada`.
- **Technical Validation:** Pemeriksaan dan hasil aktual, atau alasan tidak dijalankan.
- **Visual or Live Validation:** Pemeriksaan dan hasil aktual, atau alasan tidak dijalankan.
- **Errors and Blockers:** Error, blocker, dampak, atau `Tidak ada`.
- **Risks and Open Questions:** Risiko tersisa atau `Tidak ada`.
- **Supersedes Entry ID:** `UUID lama` atau `Tidak ada`.
- **Follow-up:** Tindak lanjut atau `Tidak ada`.
```

## Status Definitions

- `Selesai`: seluruh scope yang diminta selesai dan validasi proporsional lulus.
- `Selesai sebagian`: ada hasil berguna, tetapi sebagian scope masih tersisa.
- `Analisis`: pekerjaan bersifat read-only selain pencatatan log.
- `Review`: pemeriksaan atau evaluasi tanpa implementasi perubahan yang direkomendasikan.
- `Terblokir`: pekerjaan tidak dapat dilanjutkan karena blocker konkret yang dijelaskan.
- `Dibatalkan`: pekerjaan dihentikan berdasarkan instruksi pengguna.

## Content Rules

- Gunakan timestamp sistem aktual dengan timezone eksplisit.
- Gunakan UUID unik per entri.
- Gunakan tag singkat, konsisten, lowercase, dan dapat dicari.
- Pisahkan instruksi pengguna dari interpretasi agent.
- Catat command secara ringkas; hilangkan nilai rahasia dan data autentikasi.
- Jangan menyalin prompt, output, atau file sensitif secara penuh.
- Jangan mengubah entri lama. Koreksi selalu menjadi entri baru dengan `Supersedes Entry ID`.
- Entri terbaru harus berada paling atas dan seluruh file `logs/logs.md` hanya boleh berisi blok entri.
