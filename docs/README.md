# Creative Universe Documentation

**Status:** ACTIVE
**Revised:** 2026-07-15

Dokumentasi aktif di folder ini adalah sumber arah arsitektur dan operasional Creative Universe. Dokumen yang sudah tidak sesuai implementasi dipindahkan ke `backup`, sehingga tidak boleh digunakan sebagai referensi pembangunan baru.

## Urutan membaca

1. `00_governance/Source_of_Truth_Rules.md`
2. `00_architecture/Application_Catalog.md`
3. `00_architecture/Modular_SubApp_Architecture.md`
4. `00_architecture/Terminology_and_Conventions.md`
5. `03_backend_api/Core_Public_Contracts.md`
6. `03_backend_api/API_Route_Map.md`
7. `05_database/Database_ERD_Verification.md`
8. `08_operations/CPanel_Deployment_Runbook.md`
9. `05_migration/Backend_Modularization_Migration_Map.md`
10. `05_migration/Frontend_Refactor_Baseline.md`
11. `05_migration/Frontend_Audit_Report.md`
12. `05_migration/Frontend_Backend_Contract_Matrix.md`
13. `05_migration/Frontend_Module_Boundaries.md`
14. `05_migration/Frontend_Route_And_Layout_Migration.md`
15. `05_migration/Frontend_Canonical_URLs.md`
16. `05_migration/Frontend_Legacy_Route_Cleanup.md`
17. `05_migration/Frontend_API_Client_Foundation.md`
18. `05_migration/Frontend_Domain_API_Modules.md`
19. `05_migration/Frontend_Authentication_Synchronization.md`
20. `05_migration/Frontend_Application_Access.md`
21. `05_migration/Frontend_Permission_Aliases.md`
22. `05_migration/Frontend_Core_Module_Alignment.md`
23. `05_migration/Frontend_Pusher_Configuration.md`
24. `05_migration/Frontend_KV_Retail_Integration.md`
25. `05_migration/Frontend_KV_Retail_State_Stability.md`
26. `05_migration/Frontend_Creative_Report_Integration.md`
27. `05_migration/Frontend_ODDS_Integration.md`
28. `05_migration/Frontend_Core_Chat_Integration.md`
29. `05_migration/Frontend_Finalization_F19_F32.md`
30. `07_design_system/Components_Navbar.md`
31. `07_design_system/Components_Guest_Landing.md`
32. `07_design_system/Component_Hero_Heading.md`
33. `07_design_system/Component_Primary_Action_Link.md`
34. `07_design_system/Component_Error_Runner_Game.md`
35. `07_design_system/Pattern_ODDS_Gameboy_Frame.md`
36. `07_design_system/Template_Universal_Error_View.md`
37. `08_operations/Emergency_Maintenance.md`

## Dokumen aktif utama

### Governance dan arsitektur

- `00_governance/Source_of_Truth_Rules.md`
- `00_governance/Status_Label_Standard.md`
- `00_architecture/Architecture_Decision_Log.md`
- `00_architecture/Application_Catalog.md`
- `00_architecture/Modular_SubApp_Architecture.md`
- `00_architecture/Terminology_and_Conventions.md`
- `00_architecture/Headless_Architecture.md`

### Backend dan database

- `03_backend_api/Core_Public_Contracts.md`
- `03_backend_api/API_Route_Map.md`
- `05_database/Database_ERD_Verification.md`
- `06_security/RBAC_and_Permission_Matrix.md`
- `06_security/Maintenance_Command_Security.md`
- `06_security/Reverb_Removal_Decision.md`

### Operations dan migration

- `08_operations/CPanel_Deployment_Runbook.md`
- `08_operations/Emergency_Maintenance.md`
- `05_migration/Backend_Modularization_Migration_Map.md`
- `05_migration/Frontend_Refactor_Baseline.md`
- `05_migration/Frontend_Audit_Report.md`
- `05_migration/Frontend_Backend_Contract_Matrix.md`
- `05_migration/Frontend_Module_Boundaries.md`
- `05_migration/Frontend_Route_And_Layout_Migration.md`
- `05_migration/Frontend_Canonical_URLs.md`
- `05_migration/Frontend_Legacy_Route_Cleanup.md`
- `05_migration/Frontend_API_Client_Foundation.md`
- `05_migration/Frontend_Domain_API_Modules.md`
- `05_migration/Frontend_Authentication_Synchronization.md`
- `05_migration/Frontend_Application_Access.md`
- `05_migration/Frontend_Permission_Aliases.md`
- `05_migration/Frontend_Core_Module_Alignment.md`
- `05_migration/Frontend_Pusher_Configuration.md`
- `05_migration/Frontend_KV_Retail_Integration.md`
- `05_migration/Frontend_KV_Retail_State_Stability.md`
- `05_migration/Frontend_Creative_Report_Integration.md`
- `05_migration/Frontend_ODDS_Integration.md`
- `05_migration/Frontend_Core_Chat_Integration.md`
- `05_migration/Frontend_Finalization_F19_F32.md`
- Dokumen milestone dalam `05_migration` bersifat catatan historis, bukan kontrak sistem terbaru.

### Design system

- `07_design_system/Components_Navbar.md`
- `07_design_system/Components_Guest_Landing.md`
- `07_design_system/Component_Hero_Heading.md`
- `07_design_system/Component_Primary_Action_Link.md`
- `07_design_system/Component_Error_Runner_Game.md`
- `07_design_system/Pattern_ODDS_Gameboy_Frame.md`
- `07_design_system/Template_Universal_Error_View.md`
- Visualisasi dan control panel komponen tersedia melalui `/docs?section=components/navbar`.

## Web Documentation

Dokumen yang dibutuhkan untuk arah pengembangan disinkronkan oleh `apps/frontend/scripts/sync-documentation.mjs` dan dapat dibaca melalui route `/docs`. File yang tidak ada di menu webpage tidak otomatis menjadi sumber kebenaran.

## Aturan pemeliharaan

- Perubahan arsitektur harus memperbarui dokumen aktif dan test terkait dalam perubahan yang sama.
- Jangan menghidupkan kembali route, model, atau istilah lama dari dokumen milestone.
- Dokumen obsolete dipindahkan ke `backup`, bukan disimpan berdampingan dengan sumber aktif.
- Secret, token, credential, dan file `.env` tidak boleh dimasukkan ke dokumentasi atau repository.
