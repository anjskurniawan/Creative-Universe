# CreativeUniverse Documentation

> Status: Current
> Last reviewed: 2026-08-13

This documentation is the current-state reference for CreativeUniverse. Read only the relevant document, then verify the source before making changes.

## Start here

| Need | Document |
| --- | --- |
| Understand system boundaries | [Architecture overview](architecture/overview.md) |
| Set up local development | [Local setup](development/local-setup.md) |
| Change the Laravel API | [Laravel API backend](backend/laravel-api.md) |
| Change the Next.js frontend | [Next.js static export](frontend/nextjs-static-export.md) |
| Choose a component location | [Component system](frontend/component-system.md) |
| Handle files and uploads | [Laravel storage](storage/laravel-storage.md) |
| Build or deploy | [Deployment](deployment/local-and-cpanel.md) |
| Run validation | [Commands and validation](operations/commands-and-validation.md) |
| Create an explicit commit | [Repository commits](operations/repository-commits.md) |
| Review security boundaries | [Known risks](security/known-risks.md) |
| Follow agent workflows | [Agent workflow](ai/agent-workflow.md) |
| Use React Aria | [React Aria skill](ai/react-aria-skill.md) |
| Use React Spectrum S2 | [React Spectrum S2 skill](ai/react-spectrum-s2-skill.md) |
| Add documentation | [Documentation guide](contributing/documentation.md) |

## Principles

- docs/ describes current behavior; the work log stores immutable history.
- Source code, configuration, migrations, tests, and runtime evidence are authoritative when they differ from documentation.
- Every document except this index has a Last verified date and must be updated when its contract changes.
