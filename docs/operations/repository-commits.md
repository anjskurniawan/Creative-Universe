# Repository Commits

> Status: Current
> Last verified: 2026-08-13

A commit is only created after the user explicitly requests it.

## Required sequence

1. Finish implementation and validation.
2. Update durable documentation where needed.
3. Add and validate one final entry in logs/logs.md.
4. Run skills/repository/scripts/get-log-range.ps1.
5. Separate scoped changes from changes owned by the user or other agents.
6. Stage intended files explicitly and review the staged diff.
7. Commit with a summary that matches the staged diff.
8. Push normally only when a commit was requested and push was not disabled.

## Initial log range

When logs/logs.md has never existed in HEAD, the script returns initial range true and uses all current entries as context. It must not fail because the log baseline has not been committed.

Never reset, clean, rebase, amend, force-push, merge, or open a pull request without explicit instruction.
