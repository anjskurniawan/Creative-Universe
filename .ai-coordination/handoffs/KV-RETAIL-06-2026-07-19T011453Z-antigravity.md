# Handoff: KV-RETAIL-06

- From: antigravity
- At: 2026-07-19T01:14:53Z
- Branch: feature/kv-retail-06
- Checks: npx tsc --noEmit (passed); npx eslint src/components/taskcard/task-card.tsx (0 error, 3 existing warnings); git diff --check for TaskCard and design doc (passed).

## Summary

KV Retail dikunci sebagai acuan sub-app: tiga tema Light/Dark/Retro, shell/nav/sidebar reusable, mobile TaskCard, Report aktual/realtime Pusher, dan TaskCard desktop sempit. Kontrak desktop sempit final: cover memakai panel tanggal -> judul -> countdown+status aktif horizontal -> dua label file vertikal -> chevron paling kanan; header tidak bergeser saat expand/collapse; body expand memakai TaskcardMobileLayoutCard; overlay selalu collapse dahulu agar hanya menutup cover. Referensi kanonis ada di docs/03_backend_api/KV_Retail_Task_Reference.md serta docs/07_design_system/Components_KV_Retail_Performance.md dan Pattern_KV_Retail_Performance_Themes.md. Jangan rollout style global atau memindahkan theme persistence dari sidebar tanpa instruksi Project Owner.