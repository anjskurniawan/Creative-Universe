# AGENTS.md

## Project Overview

## Scope and Repository Structure

## Development Commands

## Coding Conventions

- Place every reusable frontend component under `apps/frontend/src/components/`; do not add component implementations directly at the components root. Reusable composed layouts may use `apps/frontend/src/components/layouts/` as their dedicated category.
- Use `apps/frontend/src/components/universe/` by default for project-owned components, including components scaffolded from React Aria Components and components built from scratch.
- Use `apps/frontend/src/components/spectrum/` only for components implemented with or wrapping React Spectrum S2 from `@react-spectrum/s2`.
- When the user does not explicitly request Spectrum S2, treat `universe` as the default component family.
- Keep component ownership explicit: do not silently move a Universe component into Spectrum, mix both implementations in one primitive, or expose one family under the other family's path.
- Create each component in a PascalCase subdirectory, with its primary implementation using the same PascalCase filename.
- Keep route-specific page layouts and route shells under `apps/frontend/src/app/`; place reusable composed layouts under `apps/frontend/src/components/layouts/`. Use `universe/` or `spectrum/` for reusable design-system primitives and components, not as a replacement for the layouts category.

## Testing and Validation

## Git and Change Management

## Security and Sensitive Data

## Documentation and Communication

- Treat `docs/` as the canonical current-state reference and `logs/logs.md` as immutable chronological history.
- Use `docs/README.md` as the documentation entry point for every project task. Read only the segments relevant to the instruction, then follow their links when deeper context is needed.
- Do not load all of `docs/` by default. Search and open documentation progressively to keep context focused.
- Treat source code, migrations, tests, configuration, and runtime evidence as the final authority when documentation conflicts with implementation; reconcile durable differences through the documentation workflow.
- Evaluate documentation impact on every task. Update the relevant documentation before completion when durable architecture, backend, database, API, frontend, configuration, deployment, storage, security, integration, dependency, command, or operational behavior changes or is newly verified.
- Keep documentation modular, detailed, source-backed, free of secrets, and indexed from `docs/README.md`.

## Skills

### Mandatory local skill: work-log

- For every project-related instruction and task, read `skills/work-log/SKILL.md` completely and follow it, including for analysis, planning, diagnosis, review, validation, implementation, blocked work, and corrections.
- Retrieve only the recent log context relevant to the instruction.
- At the end, add exactly one complete newest-first entry through the skill's writer, validate it, and verify the saved entry. Never edit, delete, reorder, or silently correct an existing entry; supersede it with a new entry.

### Conditional local skill: documentation

- Evaluate documentation impact for every task.
- When work changes or discovers durable information that a future developer or agent needs to build, operate, debug, secure, or deploy the system correctly, read `skills/documentation/SKILL.md` completely and follow it.
- Skills in `skills/` are project-owned and agent-neutral. Do not register, install, copy, or expose them as global or Codex catalog skills.
- It is optional for tasks without documentation impact, such as typo-only edits, temporary diagnostics, generated artifacts, or internal refactors with no lasting contract or behavior change.
- When used, finish and validate documentation before creating the final work-log entry.

### Optional local skill: react-aria

- Read and follow `skills/react-aria/SKILL.md` when the user explicitly requests React Aria, `react-aria-components`, an Aria-based component, or any create, update, review, refactor, fix, or test involving an existing Aria-backed component.
- For every genuinely new reusable Universe component, use this skill first as a mandatory discovery gate before writing the implementation. Search the bundled component catalog by behavior and relevant synonyms, then read the exact component reference when a possible match exists.
- When a suitable React Aria component or primitive exists, scaffold the new Universe component from that API and preserve its accessibility, interaction, state, collection, and keyboard contracts. The result still belongs under `apps/frontend/src/components/universe/` and owns its project styling.
- When no suitable React Aria scaffold exists after checking the bundled catalog and relevant component references, record the no-match decision, stop applying the Aria implementation workflow, and build the Universe component independently with appropriate accessibility and validation.
- Do not invoke this skill for an explicit Spectrum S2 request unless the Spectrum workflow intentionally falls back to React Aria for a custom Spectrum component. Use `skills/react-spectrum-s2/SKILL.md` as the primary skill in that case.
- This is a project-local, agent-neutral skill sourced from `https://react-aria.adobe.com`. Do not register it globally, duplicate it into a vendor catalog, or configure the optional React Aria MCP server unless the user explicitly asks.

### Optional local skill: react-spectrum-s2

- Read and follow `skills/react-spectrum-s2/SKILL.md` when the user explicitly requests a component related to React Spectrum, Spectrum S2, `@react-spectrum/s2`, or asks to change an existing component under `apps/frontend/src/components/spectrum/`.
- Do not invoke this skill for generic component requests or Universe components. `apps/frontend/src/components/universe/` remains the default when Spectrum S2 is not explicitly requested.
- For Spectrum component work, read the exact bundled component reference and any directly relevant guide before implementation. Use the official S2 API, subpath imports, composition model, styling macro, accessibility contract, and testing guidance rather than guessing.
- Store reusable output from this skill under `apps/frontend/src/components/spectrum/` using the project component structure. Project rules in `AGENTS.md` and `docs/frontend/component-system.md` remain authoritative for repository paths, static-export constraints, documentation, validation, and work logging.
- This is a project-local, agent-neutral skill sourced from `https://react-spectrum.adobe.com`. Do not register it globally, duplicate it into a vendor catalog, or configure the optional React Spectrum MCP server unless the user explicitly asks.

### Optional local skill: component-organizer

- Read and follow `skills/component-organizer/SKILL.md` only when the user explicitly asks to organize, tidy, split, restructure, or clean the file/folder structure of an existing frontend component, or explicitly invokes `component-organizer`.
- Do not trigger it for ordinary component creation, bug fixes, visual changes, behavior changes, or generic refactoring that does not request structural organization.
- Preserve the component's behavior, props, rendered UI, Tailwind styling, accessibility, public exports, and consumers unless the user separately requests a contract change.
- Use the live CreativeUniverse path and casing as authority: default project-owned components belong to `apps/frontend/src/components/universe/`, explicit Spectrum S2 components to `apps/frontend/src/components/spectrum/`, reusable layouts to their established layout category, and route-local UI beside its route.
- Keep organization proportional. The primary `<ComponentName>.tsx` always remains; `.types.ts`, `.config.ts`, `.logic.ts`, child folders, and `index.ts` are created only when their complexity or reuse justifies them.
- This is a project-local, agent-neutral skill. Do not register, install, copy, or expose it as a global or Codex catalog skill.

### Explicit local skill: repository

- Use `skills/repository/SKILL.md` only when the user explicitly asks to commit or create a Git commit.
- Never invoke it automatically after ordinary implementation, documentation, analysis, or validation work.
- Build the commit title and short bullet description from entries in `logs/logs.md` added after the log snapshot in `HEAD`, then verify the summary against the staged diff.
- An explicit commit request authorizes a normal automatic push after the commit succeeds. Skip push only when the user explicitly says not to push.
- Never create a pull request, tag, merge, rebase, amend, force-push, or rewrite history without separate explicit authorization.
- Complete and validate the current task's work-log entry before staging so that the entry is included in the commit.

### Skill execution order

1. Read `skills/work-log/SKILL.md` and retrieve relevant history.
2. Read `docs/README.md` and the documentation segments relevant to the task.
3. Load any task-specific skill required by the instruction: use `skills/component-organizer/SKILL.md` only for explicit component-structure cleanup, `skills/react-aria/SKILL.md` for Aria work and the discovery gate for a genuinely new Universe component, and `skills/react-spectrum-s2/SKILL.md` for explicit Spectrum component work.
4. Read and follow `skills/documentation/SKILL.md` when the documentation-impact check is positive.
5. Perform implementation and validation, including documentation validation when applicable.
6. Write and verify the final work-log entry through `skills/work-log/scripts/add-log-entry.ps1`.
7. When commit was explicitly requested, read `skills/repository/SKILL.md`, summarize the new log range, stage the intended files, commit, automatically push the current branch unless explicitly disabled, and verify local/upstream parity.

### Cross-agent compatibility

- `skills/` is the canonical project-owned location for reusable workflows shared by any AI agent.
- `AGENTS.md` is the canonical instruction entry point for agents that support it.
- Agents that do not read `AGENTS.md` automatically must be configured through their own instruction file to read `AGENTS.md` and the required `skills/<name>/SKILL.md` files.
- Do not duplicate skill content into vendor-specific folders; vendor adapters should only point to the canonical files.

## Additional Instructions
