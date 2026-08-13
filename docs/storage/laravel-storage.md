# Laravel Storage

> Status: Current
> Last verified: 2026-08-13

Laravel storage lives in apps/backend/storage/. The default local disk stores private files; the public disk is only for intentionally public content.

## Disks

| Disk | Root | Visibility |
| --- | --- | --- |
| local | storage/app/private | private |
| public | storage/app/public | public |
| s3 | configured object storage | configuration-dependent |

config/file-storage.php selects disk names and visibility through environment variables without recording their values in documentation.

## Public link

apps/backend/public/storage must point to apps/backend/storage/app/public. Run npm run prepare:storage to prepare it and npm run check:storage to validate it.

The script refuses to replace a file or link that does not resolve to the expected target. Store uploads privately by default and validate file type, size, ownership, and access in the backend.
