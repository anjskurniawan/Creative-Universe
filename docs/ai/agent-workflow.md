# Agent Workflow

> Status: Current
> Last verified: 2026-08-13

AGENTS.md is the agent instruction entry point at the repository root and under apps/frontend/. Project skills live in skills/.

## Mandatory flow

1. Read skills/work-log/SKILL.md and relevant log context for every project task.
2. Read docs/README.md and only the relevant documents.
3. Load skills according to their triggers.
4. Evaluate documentation impact and update docs before the final log entry when durable facts change.
5. Validate the scope.
6. Write one immutable newest-first entry through the work-log writer.

## Installed project skills

| Skill | Trigger |
| --- | --- |
| work-log | every project task |
| documentation | durable changes or discoveries |
| component-organizer | explicit request to organize component structure |
| react-aria | React Aria work or a new reusable Universe component |
| react-spectrum-s2 | explicit Spectrum work or a spectrum/ component |
| repository | explicit commit |

Do not alter other worktree changes, commit or push without explicit instruction, or record secrets in documentation or logs.
