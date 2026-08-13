---
name: repository
description: Create a concise Git commit title and short bullet-list description from new entries in `logs/logs.md`, create and verify the local commit, then automatically push the current branch to its configured remote. Use only when the user explicitly asks to commit, make a commit, save changes to Git, or invokes this repository workflow; never trigger automatically for ordinary project work, and skip push only when the user explicitly requests commit without push.
---

# Repository

Create an intentional Git commit whose message summarizes the work-log entries added since the last committed version of the log, then push it safely to the configured upstream.

## Explicit-only boundary

- Run this skill only when the user explicitly requests a commit.
- A request to edit, build, document, inspect, or finish work does not imply permission to commit.
- An explicit commit request authorizes the local commit and one normal push of the current branch. If the user says `commit saja`, `jangan push`, or equivalent, do not push.
- Never create a pull request, tag, merge, rebase, amend, force-push, or rewrite history unless separately requested.
- Treat `logs/logs.md` as the canonical source. Do not create a duplicate `notes/log.md` or `notes/logs.md`.

## Determine the log range

1. Finish the requested implementation, documentation, validation, and final work-log entry first.
2. Run:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File skills/repository/scripts/get-log-range.ps1
   ```

3. The script compares current `logs/logs.md` with `HEAD:logs/logs.md` and returns the newest immutable entries not present in the last commit.
4. Read every returned entry from oldest to newest when reconstructing the work sequence, even though the file itself remains newest-first.
5. If committed log history is unavailable, use all current entries and state that this is the initial range.
6. If the committed and current logs diverge instead of sharing an immutable checkpoint, stop. Do not guess or rewrite history.

## Inspect the actual changes

Run `git status --short`, `git diff --stat`, and focused diffs. Use the log range to understand intent, then confirm every claim against the actual working tree. Logs guide the message but do not authorize staging unrelated files.

Before staging:

- identify user-owned or unrelated changes;
- exclude secrets, `.env` values, generated dependencies, temporary files, and unintended build output;
- preserve all unrelated changes without resetting or cleaning them;
- stop and ask if the intended commit scope cannot be separated safely.

## Build the commit message

Read [references/commit-format.md](references/commit-format.md) and produce:

- one short title describing the dominant outcome;
- a body containing a concise Markdown-style bullet list of material results;
- no timestamps, model names, log IDs, validation noise, or exhaustive file inventories unless essential.

Prefer one coherent commit. If the log range contains unrelated changes that should be reviewed independently, propose separate commits rather than mixing them silently.

## Commit and push workflow

1. Validate the relevant application, documentation, skill, and work-log checks.
2. Ensure the current task's final work-log entry has already been inserted and validated so it is included in the commit.
3. Refresh the log range and finalize the title and bullet body.
4. Stage only the intended paths with explicit `git add -- <paths>` arguments. Never use a broad stage when unrelated files exist.
5. Review `git diff --cached --stat`, `git diff --cached --check`, and the staged diff.
6. Commit with the generated title and bullet body.
7. Verify the new commit using `git show --stat --oneline --decorate -1` and inspect `git status --short --branch`.
8. Unless the user explicitly disabled push, run `scripts/push-current-branch.ps1`. It pushes to the existing upstream or establishes `origin/<current-branch>` when no upstream exists.
9. Verify that local `HEAD` equals the upstream tracking ref and inspect `git status --short --branch` again.
10. Report the commit hash, title, included scope, remote branch, push result, and whether changes remain uncommitted.

Use only a normal push. If the remote rejects the update because it is ahead or diverged, stop and report the rejection. Never pull, merge, rebase, reset, amend, or force-push automatically.

Do not edit the immutable work-log entry after commit merely to add the resulting hash. Report the hash and push result in the final response. If commit or push fails after the entry was written, add a new correction entry through `work-log`; never alter the existing entry. A push failure does not invalidate or delete the successful local commit.

## Resources

- `scripts/get-log-range.ps1`: deterministically finds current log entries absent from the committed log checkpoint.
- `scripts/push-current-branch.ps1`: performs a normal push and verifies the upstream commit; supports `-DryRun` for validation without network mutation.
- `references/commit-format.md`: title, bullet body, and message-quality rules.
