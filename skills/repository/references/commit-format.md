# Repository Commit Message Format

## Title

- Keep the title at or below 72 characters.
- Describe the dominant completed outcome, not the act of editing files.
- Use an imperative, specific phrase.
- Prefer a conventional prefix when it accurately classifies the change:
  - `feat:` new user-facing capability;
  - `fix:` defect correction;
  - `docs:` documentation-only change;
  - `refactor:` structural change without behavior change;
  - `test:` test-only change;
  - `chore:` tooling, repository, dependency, or maintenance work.
- Do not end the title with a period.

## Description

Write two to five short bullets. Each bullet should describe a material result or durable decision.

```text
chore: add explicit repository commit workflow

- derive commit context from new immutable work-log entries
- generate concise titles and bullet summaries
- push verified commits without rewriting remote history
```

## Selection rules

- Synthesize repeated log entries into one outcome.
- Prefer user-visible behavior, architecture, contracts, or operational changes over implementation trivia.
- Mention important validation only when it materially increases confidence.
- Omit model identity, timestamps, task IDs, entry IDs, temporary errors, and raw command output.
- Cross-check every bullet against staged changes.
- If the user supplies an exact title or message, preserve it unless it is unsafe or factually incorrect.
