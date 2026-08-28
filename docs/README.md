# CreativeUniverse Documentation

> Status: Current
> Last reviewed: 2026-08-24

This documentation is the current-state reference for CreativeUniverse. Read only the relevant document, then verify the source before making changes.

## Start here

| Need | Document |
| --- | --- |
| Understand system boundaries | [Architecture overview](architecture/overview.md) |
| Set up local development | [Local setup](development/local-setup.md) |
| Change the Laravel API | [Laravel API backend](backend/laravel-api.md) |
| Change the Next.js frontend | [Next.js static export](frontend/nextjs-static-export.md) |
| Understand frontend CSS boundaries | [Frontend CSS architecture](frontend/css-architecture.md) |
| Audit active and historical CSS selectors | [Frontend CSS selector inventory](frontend/css-selector-inventory.md) |
| Choose a component location | [Component system](frontend/component-system.md) |
| Plan or execute frontend restructuring | [Frontend in-place restructuring architecture](frontend/rebuild-architecture.md) |
| Handle files and uploads | [Laravel storage](storage/laravel-storage.md) |
| View component structure | [Component tree & structure](frontend/component-tree.md) |
| Read active component ownership | [Component overview](frontend/component-tree-legacy-overview.md) |
| Read active component domains | [Component domains](frontend/component-tree-legacy-domains.md) |
| Follow component restructuring conventions | [Component restructuring conventions](frontend/component-tree-migration.md) |
| Track frontend restructuring phases | [Frontend restructuring registry](frontend/migration-inventory.md) |
| Track temporary frontend boundary debt | [Frontend boundary exceptions](frontend/boundary-exceptions.md) |
| Audit frontend Core ownership | [Frontend Core ownership audit](frontend/core-ownership-audit.md) |
| Audit frontend shell ownership | [Frontend shell ownership audit](frontend/shell-ownership-audit.md) |
| Audit Panel and Settings ownership | [Panel and Settings ownership audit](frontend/panel-settings-ownership-audit.md) |
| Audit Messages and Notifications ownership | [Messages and Notifications ownership audit](frontend/communication-ownership-audit.md) |
| Audit Creative AI and Creative Report ownership | [Creative ownership audit](frontend/creative-ownership-audit.md) |
| Audit KV Retail ownership | [KV Retail ownership audit](frontend/kv-retail-ownership-audit.md) |
| Audit Generator and Pricetag ownership | [Generator and Pricetag ownership audit](frontend/generator-pricetag-ownership-audit.md) |
| Audit ODDS ownership and lifecycle boundaries | [ODDS ownership audit](frontend/odds-ownership-audit.md) |
| Audit developer tools and component library ownership | [Developer tools ownership audit](frontend/developer-tools-ownership-audit.md) |
| Review final frontend structural evidence | [Frontend final structural audit](frontend/final-structural-audit.md) |
| Read the pre-move frontend baseline | [Frontend restructuring baseline](frontend/restructure-baseline.md) |
| Audit current component placement | [Component placement audit](frontend/legacy-component-audit.md) |
| Read the cancelled rebuild QA snapshot | [Deprecated rebuild component inventory](frontend/migrated-components.md) |
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
