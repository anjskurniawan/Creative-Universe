# CreativeUniverse Agent Instructions

When working in this repository, use the project-local logging skill for every implementation, analysis, review, diagnosis, validation, or blocked task:

- Read only the newest relevant entries in `notes/logs/agent-work-log.md` before acting.
- Read `skills/log/SKILL.md` and follow its workflow.
- Execute the user's primary instruction first.
- After the task, add one summary entry at the top of `notes/logs/agent-work-log.md`.
- After the entry is successfully written, tell the user exactly: `Berhasil di catat di notes logs`.

Use other project-local skills under `skills/` whenever their scope matches the task.

For single-target Developer Library synchronization, read and use `skills/update-library/SKILL.md`.
