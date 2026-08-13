# CreativeApp Documentation Standard

Use this reference when creating or substantially revising a documentation segment. Select only the sections relevant to the subject; do not create empty headings.

## Canonical documentation map

| Subject | Default location |
| --- | --- |
| Architecture and boundaries | `docs/architecture/` |
| Local development | `docs/development/` |
| Laravel backend | `docs/backend/` |
| Database design | `docs/database/` |
| API contracts | `docs/api/` |
| Next.js frontend | `docs/frontend/` |
| Integrations | `docs/integrations/` |
| Storage and files | `docs/storage/` |
| Deployment and releases | `docs/deployment/` |
| Commands and operations | `docs/operations/` |
| Security | `docs/security/` |
| Agent workflows | `docs/ai/` |
| Documentation policy | `docs/contributing/` |

Create a missing directory only when its first real subject exists. Add every new segment to `docs/README.md`.

## Common document header

```markdown
# Descriptive title

> Status: Current | Planned | Deprecated  
> Last verified: YYYY-MM-DD

One paragraph describing the purpose, audience, and boundary of this document.
```

`Status` is recommended when readers could confuse current and future behavior. `Last verified` is mandatory for every segment other than `docs/README.md`.

## System or backend flow

Cover the complete chain where it exists:

1. Purpose and actors.
2. Entry point: UI action, route, command, event, schedule, or webhook.
3. Authentication, authorization, middleware, and validation.
4. Controller or handler ownership.
5. Service/domain logic and business rules.
6. Model reads and writes, transaction boundaries, and locking.
7. State transitions and allowed/forbidden transitions.
8. Jobs, events, notifications, caches, files, or external integrations.
9. Response or observable result.
10. Expected failures, retries, compensation, and recovery.
11. Source files and focused validation evidence.

Use a sequence diagram only when three or more participants or asynchronous branches are difficult to follow in prose.

## Database reference

For each table, include:

- purpose and owning domain;
- primary key and identifier strategy;
- important columns with type, nullability, default, and business meaning;
- foreign keys and relationship cardinality;
- indexes and the query or constraint they support;
- unique, check, or application-level constraints;
- timestamps, soft deletion, archival, retention, and cascade behavior;
- migration and model source paths;
- sensitive fields and access restrictions;
- known scale or consistency concerns.

Do not copy an entire migration. Explain the schema contract and link to the migration.

## API contract

Document each endpoint or tightly related endpoint group with:

```markdown
### `METHOD /path`

- Purpose:
- Authentication:
- Permission:
- Request headers:
- Path/query parameters:
- Request body and validation:
- Success status and response:
- Error statuses and response shape:
- Side effects:
- Idempotency/retry behavior:
- Backend source:
- Tests:
```

Distinguish public API guarantees from internal implementation details. Include examples only when they clarify a non-obvious shape, and use sanitized values.

## Frontend reference

For a page or workflow, include:

- route and static/dynamic rendering constraints;
- owning page, layout, feature, and reusable components;
- user roles and permitted actions;
- local/global/server state ownership;
- API endpoint usage and data transformation;
- form validation and submission behavior;
- loading, empty, success, error, and retry states;
- navigation and URL/query state;
- accessibility and responsive constraints when relevant;
- source paths and UI/build validation evidence.

When the frontend is statically exported, explicitly identify any feature that still requires a live backend or browser-side request.

## Deployment and operations reference

Include:

- target environment and topology;
- prerequisites and supported runtime versions;
- environment variable names, purpose, required/optional status, and safe examples only;
- build, migration, storage, cache, and release commands;
- artifact and document-root paths;
- file ownership and permission requirements;
- health checks and success criteria;
- backup, rollback, and recovery boundaries;
- known hosting limitations and unresolved production decisions.

Never publish real credentials, private paths, or production secrets.

## Security reference

Record authentication and authorization boundaries, trust boundaries, sensitive data, input and upload validation, secret handling, dependency advisories, audit expectations, and known mitigations. Clearly label accepted risks and the approval or decision that keeps them active.

## Decision and status handling

- Document current truth in present tense.
- Put future designs in a clearly marked `Planned` section or separate planned document.
- Put chronological evidence and supersession history in `logs/logs.md`.
- When a new decision replaces old behavior, remove stale current-state instructions and link related segments.
- Do not claim validation that was not performed.

## Completeness checklist

- The document states its purpose and boundary.
- Claims are verified against current source, tests, configuration, or runtime evidence.
- Backend, database, API, and frontend implications are covered when applicable.
- Error paths, permissions, side effects, and operational constraints are explicit.
- Source paths and related documents are linked.
- `Last verified` uses the actual verification date.
- `docs/README.md` exposes the segment.
- Relative links resolve.
- No secrets or private values are present.
- The file remains focused and no longer than 200 lines without an exception.
