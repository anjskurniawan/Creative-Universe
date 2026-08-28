# Active Component Tree — Historical Overview

> Status: Active restructuring reference  
> Last verified: 2026-08-24  
> Source: `apps/frontend/src/components/`

## Kelompok ownership historis

| Kelompok | Peran legacy | Arah mapping target |
|---|---|---|
| `universe/` | Design system milik project, React Aria, shell, layout, dan animasi | Evaluasi ke `components/ui`, `components/layout`, atau feature |
| `spectrum/` | Wrapper/adapter React Spectrum S2 | `components/spectrum/` |
| `ui/`, `typography/` | Primitive UI dan typography | `components/ui/` |
| `panel/`, `dashboard/`, `settings/` | UI domain panel | `features/<domain>/components/` |
| `creative/`, `creative-report/` | Workspace dan laporan evaluasi | `features/creative-report/` |
| `odds/` | Task management ODDS | `features/odds/` |
| `auth/`, `login/`, `onboarding/` | Authentication dan onboarding | `features/auth/` atau route-local `_components/` |
| `navigation/`, `messages/`, `notifications/` | KV SideMenu plus communication state/composition | `features/kv-retail`, `features/messages`, dan `features/notifications` melalui split tanpa feature-to-feature imports |
| `feedback/` | Error dan feedback generic | `components/feedback/` |

## Prinsip penting

- Struktur aktif memiliki beberapa rumah historis untuk konsep yang sama; jangan mempertahankan pembagian itu secara mekanis.
- `features/` target menjadi rumah domain logic sekaligus UI domain.
- `components/` target hanya untuk component reusable yang sudah terbukti generic.
- `apps/frontend-cancel/` read-only dan tidak boleh menjadi dependency frontend aktif.
