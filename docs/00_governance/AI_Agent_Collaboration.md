---
title: "Codex and Antigravity Collaboration Protocol"
status: "ACTIVE"
version: "1.0"
created: "2026-07-17"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
---

# Codex and Antigravity Collaboration Protocol

Codex and Antigravity share this repository, not their private conversation
history. The tracked `.ai-coordination/` directory is therefore their shared,
auditable coordination channel. It works locally and after Git push/pull.

## Required lifecycle

`READY -> IN_PROGRESS -> HANDOFF -> DONE`

`BLOCKED` may be used from any active state. Only one agent may own a task in
`IN_PROGRESS`. A new agent must take over only after a `HANDOFF`, `BLOCKED`,
or `DONE` state is recorded.

## Automatic shared context

Use `scripts/agent-sync.ps1` rather than editing task metadata by hand:

```powershell
# view all work, conflicts, and recent handoffs
.\scripts\agent-sync.ps1 status

# create an agreed unit of work
.\scripts\agent-sync.ps1 new -Id "CR-123" -Title "Validate member import" -Owner "codex" -Scope "Creative Report import validation only" -NonScope "Do not change onboarding"

# atomically reserve the task in a shared local worktree
.\scripts\agent-sync.ps1 claim -Id "CR-123" -Owner "antigravity" -Branch "codex/cr-123-member-import"

# publish an implementation handoff to the other agent
.\scripts\agent-sync.ps1 handoff -Id "CR-123" -Owner "antigravity" -Summary "Validation and tests are ready for review." -Checks "php artisan test tests/Feature/... (passed)"
```

The script creates a per-task lock during updates. Status is derived from task
files and handoffs, so each agent sees the same current state after refresh.
Commit and push `.ai-coordination/` with the implementation; the other agent
must pull/rebase before claiming follow-up work.

## Scope protection

- A task must name its scope and explicit non-scope before it is claimed.
- If task scope overlaps an active task, split the work or wait for handoff.
- Business-rule ambiguity uses `BLOCKED` and `NEEDS_REVIEW`; do not decide it
  independently.
- Existing Source of Truth Rules and architecture documents take precedence
  over any agent suggestion.

## What this does and does not automate

This protocol automatically maintains a shared, durable task state and
handoff record. It cannot make Codex and Antigravity exchange live chat
messages by itself: that requires an Antigravity API, webhook, or its own
automation extension with credentials. If such access becomes available, its
webhook should call the same script, keeping this repository state canonical.
