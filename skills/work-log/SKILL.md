---
name: work-log
description: Maintain the immutable newest-first project work-log database for every project instruction and task. Use for implementation, analysis, diagnosis, review, validation, planning, blocked work, corrections, repeated instructions, and any project work that needs decisions, results, changed files, or reusable context recorded.
---

# Work Log

## Purpose

Record every project instruction and its outcome as durable context so future agents can recover decisions, distinguish repeated requests, and avoid misinterpreting established constraints.

## Scope

Apply this workflow to every project-related task, including read-only work and unsuccessful or blocked attempts. Do not log unrelated conversation. Higher-priority instructions and explicit privacy requests take precedence; record only a safe redacted summary when full details are sensitive.

## Canonical Paths

- Log database: `logs/logs.md` from the project root.
- Entry specification: `skills/work-log/references/log-format.md`.
- Writer: `skills/work-log/scripts/add-log-entry.ps1`.
- Validator: `skills/work-log/scripts/validate-logs.ps1`.

Temporary entry files are workflow artifacts only. Never create task log files in the repository root. Use the fixed temporary filename `.worklog-entry.md` (or an equivalent file under a system temp directory), pass `-RemoveEntryFileOnSuccess` to the writer, and verify that the temporary file no longer exists after a successful write. Existing historical `*-log.md` files are not canonical logs and must not be created by this workflow.

Resolve paths from the skill directory, not from the shell's current working directory. Do not use `AGENTS.md` as the log database.

## Required Workflow

### Before Work

1. Confirm the project root and canonical log path.
2. Read the newest entries and search relevant history by feature, file, instruction, decision, error, entry ID, or tag. Do not load the entire log when a focused search is enough.
3. Compare the latest explicit user instruction with relevant prior decisions and repository state.
4. Treat the newest explicit user instruction as authoritative when it supersedes older context. Ask for clarification only when the conflict would materially change the result.

### During Work

1. Track the instruction, interpretation, assumptions, decisions, actions, changed files, result, validation, errors, and remaining risk.
2. Use the actual system timestamp with an explicit timezone. Never invent or round a timestamp.
3. Use the actual model identity when available; otherwise write `Tidak diketahui`.
4. Sanitize commands and outputs before logging. Never copy passwords, tokens, private keys, cookies, authorization headers, `.env` values, or secret-bearing URLs.

### After Work

1. Read `references/log-format.md` completely and prepare exactly one complete entry.
2. Assign a unique entry ID. For a correction, set `Supersedes Entry ID` to the older entry; never alter the older entry.
3. Insert the new entry with `scripts/add-log-entry.ps1 -RemoveEntryFileOnSuccess`. Do not write directly when the script is available. The entry source must be the temporary `.worklog-entry.md`, never a root `*-log.md` artifact.
4. Run `scripts/validate-logs.ps1` and read back the newest entry.
5. Verify that the new entry is first, every previous entry is preserved byte-for-byte, and validation reflects what was actually run.
6. Verify the temporary entry file was removed. If the writer succeeded but later validation fails, do not output the success phrase; report the failure and preserve the existing log unchanged.
7. Only after all checks succeed, output exactly: `Berhasil di catat di logs`.
8. If writing or validation fails, do not output the success phrase. Clean up the temporary entry file manually in a `finally`/cleanup step and preserve the existing log unchanged.

## Immutable Newest-First History

- Treat recorded entries as immutable historical data.
- Never edit, rewrite, reorder, merge, delete, or silently correct an existing entry.
- Add new context or corrections as a new entry at the top.
- Preserve non-increasing chronological order from newest to oldest. Use entry IDs to disambiguate equal timestamps.
- Treat this as immutable insert-only history; it is not conventional append-to-bottom logging.

## Required Fields and Status

Use every field and the status definitions in `references/log-format.md`. Write `Tidak ada` when a field does not apply. Never leave required fields blank or claim validation that was not performed.

## Multi-Agent Safety

- Re-read the log while holding the writer's exclusive mutex before inserting.
- Reject duplicate entry IDs and entries older than the current newest entry.
- Use same-directory atomic replacement and verify that the prior content remains an exact suffix.
- On a concurrent-write conflict, regenerate context from the latest log and retry with the same entry ID only if it was not already recorded.

## Repetition, Corrections, and Retrieval

- Use tags, task/thread ID, file paths, and entry IDs to make history searchable.
- Preserve confirmed decisions unless a newer explicit instruction supersedes them.
- Record corrections with `Supersedes Entry ID` and explain the changed decision.
- Prefer `rg` searches over reading the full database as it grows.

## Growth and Archival

Keep `logs/logs.md` as the active database. When it becomes expensive to search or load, propose a date-based immutable archive and an index. Never archive, move, summarize, or delete recorded entries without explicit user approval.

## Validation Boundaries

The skill validator checks skill structure only. The log validator separately checks entry-only content, required fields for current-schema entries, unique IDs, timestamps, order, and common secret patterns. Neither validator proves that narrative claims are true; verify those claims from task evidence.

## Resources

- Read `references/log-format.md` before creating an entry.
- Use `scripts/add-log-entry.ps1` to insert entries safely.
- Use `scripts/validate-logs.ps1` after every insertion.
