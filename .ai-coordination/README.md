# Shared Agent State

This directory is the durable handoff channel for Codex and Antigravity.

- `tasks/` contains one Markdown file per task and its lifecycle metadata.
- `handoffs/` contains immutable implementation summaries.
- Use `scripts/agent-sync.ps1`; do not manually change task ownership while
  another agent may be claiming it.

See `docs/00_governance/AI_Agent_Collaboration.md` for the full protocol.
