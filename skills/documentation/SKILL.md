---
name: documentation
description: Maintain CreativeApp's modular docs when project work changes or discovers durable architecture, backend flows, database schemas and relationships, API contracts, frontend routes or data usage, configuration, deployment, storage, security, integrations, dependencies, commands, or operating decisions. Use conditionally for documentation-impacting work; skip trivial formatting, temporary diagnostics, generated artifacts, and internal changes with no lasting behavior or operational impact.
---

# Documentation

Keep `docs/` a detailed, verified reference for the system as it exists now. Do not use documentation as chronological history; that belongs in `logs/logs.md` through the `work-log` skill.

## Decide whether documentation is required

Use this skill when a task creates, changes, removes, or clarifies any durable item below:

- system architecture, application boundaries, request flows, lifecycles, or status transitions;
- database tables, columns, meaning, keys, constraints, indexes, relationships, or retention behavior;
- backend routes, controllers, services, models, jobs, events, policies, side effects, or failure handling;
- API methods, paths, authentication, permissions, payloads, responses, errors, or idempotency;
- frontend routes, component ownership, state, data fetching, forms, loading/error states, or static-export constraints;
- environment variable names, configuration, dependencies, integrations, storage, deployment, operations, security, or recovery procedures;
- a verified discovery that corrects or materially expands existing documentation.

Skip this skill for typo-only edits, temporary investigation commands, generated dependency/build artifacts, and internal refactors that do not change a contract, behavior, workflow, or operating procedure.

If uncertain, ask: "Would a future developer or agent need this fact to implement, operate, debug, or deploy the system correctly?" If yes, update the documentation.

## Workflow

1. Read `docs/README.md` and only the segments relevant to the task.
2. Inspect the source of truth: code, routes, migrations, models, tests, configuration, lock files, and deployment scripts. Use logs as historical evidence, never as the sole authority for current behavior.
3. Identify the affected documentation surfaces before implementation finishes.
4. Update or create focused Markdown segments in `docs/`. Split independent concerns instead of growing one catch-all file.
5. Describe the complete end-to-end behavior, including boundaries, data movement, ownership, validation, errors, side effects, and operational constraints.
6. Update `docs/README.md` whenever a document is added, renamed, moved, or materially changes its purpose.
7. Set `Last verified: YYYY-MM-DD` to the actual verification date in every changed segment.
8. Run `powershell -NoProfile -ExecutionPolicy Bypass -File skills/documentation/scripts/validate-docs.ps1`.
9. Record the documentation changes in the final immutable `work-log` entry.

## Required depth

For backend flows, document the trigger, route, middleware or authorization, controller, service, model, state changes, jobs/events, external calls, side effects, error paths, and response.

For databases, document table purpose, important columns and semantics, primary/foreign keys, relationships, indexes, uniqueness, nullability, defaults, lifecycle, deletion policy, and migration references.

For APIs, document method and path, authentication and permissions, request fields and validation, success response, error responses/statuses, side effects, and idempotency or retry behavior.

For frontend flows, document routes, owning components, state and data sources, API calls, form and validation behavior, loading/empty/error states, navigation, and static-export limitations.

For deployment and operations, document prerequisites, environment variable names without values, exact commands, generated outputs, permissions, storage mappings, health checks, failure recovery, and rollback boundaries.

Read [references/documentation-standard.md](references/documentation-standard.md) when creating a new segment, documenting a full system flow, or deciding whether coverage is complete.

## Accuracy and structure rules

- Never invent behavior. Mark planned behavior as planned and keep it separate from current behavior.
- Prefer exact repository-relative paths, route names, table names, and commands.
- Never include secrets, credentials, tokens, private environment values, or personal account paths.
- Keep one independent concern per file and use relative Markdown links.
- Split a document before it exceeds 200 lines unless a short exception comment explains why the topic cannot be divided safely.
- Avoid duplicating large source excerpts. Link to the source and explain its contract.
- Preserve useful historical decisions in the work log; edit documentation to represent current truth.
- When replacing behavior, update all affected segments and remove stale current-state claims.

## Coordination with work-log

Use `work-log` for every project instruction. When this skill applies, finish and validate documentation before writing the task's final log entry so that the log can list the exact documentation files and validation result. Never edit an older log entry to reflect a documentation update.

## Resources

- `references/documentation-standard.md`: coverage checklist and reusable section structures.
- `scripts/validate-docs.ps1`: deterministic checks for the documentation index, dates, relative links, and segment size.
