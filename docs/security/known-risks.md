# Known Security Risks and Boundaries

> Status: Current
> Last verified: 2026-08-13

This document summarizes boundaries visible in the current source. It is not a substitute for a security audit or production review.

## Secrets and public values

- Never commit .env files, AI provider tokens, cloud credentials, database passwords, or cookies.
- Every NEXT_PUBLIC_ value is embedded in browser JavaScript and must not contain a secret.
- Backend environment includes mail, Pusher, object storage, Google Apps Script, Fonnte, Groq, and Kie AI configuration. Documentation may name variables but must not include values.

## API protection

- Private APIs use Sanctum, application access, roles, and permissions.
- CORS supports credentials and gets allowed origins from ALLOWED_ORIGINS. Origins must remain restricted to known domains.
- Production API 500 responses are masked when debug is disabled.
- Broadcast channels authorize subscriptions on the server.

## Operational exposure

- routes/web_artisan.php exposes remote commands under /_cmd/*. It uses artisan-token and rate limiting but remains a high-risk administrative surface.
- migrate-fresh and full seed are blocked in production by source, but administrative routes still need strong token and network restrictions.
- The web document root must expose only backend public files. Source, logs, private storage, and environment files must not be public.

The current static packaging script removes apps/backend/public/ before copying. Review the script and back up the public directory before deployment.
