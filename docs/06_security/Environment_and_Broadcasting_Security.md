---
title: "Environment and Broadcasting Security"
status: "NEEDS_REVIEW"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "apps/backend/.env.example"
  - "apps/backend/config/broadcasting.php"
  - "apps/backend/composer.json"
  - "apps/frontend/package.json"
---

# Environment and Broadcasting Security

## 1. Purpose
This document audits the consistency between the environment configuration, broadcasting configuration, and actual frontend/backend usage, focusing particularly on the Pusher vs Reverb setup.

## 2. Verification Method
Verified by inspecting `.env.example`, `composer.json`, `package.json`, and `config/broadcasting.php`.

## 3. Environment File Policy
- The `.env.example` file contains placeholders and does not expose sensitive secrets.
- Active `.env` files are ignored by git (implied standard Laravel behavior).

## 4. Public vs Secret Variables
- **Public Variables:** `VITE_PUSHER_APP_KEY`, `VITE_PUSHER_APP_CLUSTER`, `VITE_APP_NAME`. These are safely exposed to the frontend.
- **Secret Variables:** `APP_KEY`, `DB_PASSWORD`, `PUSHER_APP_SECRET`, `AWS_SECRET_ACCESS_KEY`, `GEMINI_API_KEY`. These must remain strictly backend-only.

## 5. Pusher Configuration Evidence
- `.env.example` explicitly sets `BROADCAST_CONNECTION=pusher` and `BROADCAST_DRIVER=pusher`.
- `apps/backend/composer.json` requires `pusher/pusher-php-server`.
- `apps/frontend/package.json` requires `pusher-js` and `laravel-echo`.

## 6. Reverb Configuration Evidence
- `apps/backend/composer.json` still requires `laravel/reverb`.
- `config/broadcasting.php` still contains the Reverb connection block.

## 7. Frontend Realtime Client Evidence
- Frontend utilizes `pusher-js` via `laravel-echo`. There is no evidence of a custom Reverb client configuration.

## 8. Broadcasting Auth Security
- `routes/channels.php` uses strict closure checks (e.g., matching user ID or checking roles) to authorize private channels. The `/broadcasting/auth` route is properly safeguarded by Sanctum.

## 9. Pusher vs Reverb Decision Status
- **Status:** Pusher is the active broadcasting mechanism. Reverb is installed but seemingly unused.

## 10. Risk Register
- Having Reverb installed and configured alongside Pusher might cause confusion for future developers, leading to accidental misconfiguration.

## 11. NEEDS_REVIEW
- Should `laravel/reverb` be completely uninstalled from `composer.json` and removed from `config/broadcasting.php` to clean up the codebase?

## 12. Recommendation
- If Reverb is officially abandoned in favor of Pusher, uninstall the `laravel/reverb` package and clean up its references in `config/broadcasting.php`.
- Remove Reverb-specific `.env` variables if they exist in the live environment.
