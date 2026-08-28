---
name: component-organizer
description: Reorganize an existing CreativeUniverse frontend component into a proportional, searchable Next.js, TypeScript, and Tailwind CSS folder structure. Use only when the user explicitly asks to organize, tidy, split, restructure, or clean a component's files or invokes component-organizer. Preserve behavior, props, markup, styles, accessibility, and imports unless the user separately requests functional changes.
---

# Component Organizer

Reorganize only the explicitly named component. Keep the refactor structural: preserve behavior, public API, rendered UI, Tailwind classes, theme semantics, accessibility, and consumer contracts.

## Explicit-only boundary

- Run only after an explicit request to organize or tidy a component structure.
- Do not trigger for ordinary feature work, bug fixes, visual changes, new components, or unrelated refactors.
- Do not move shared components or rename public exports outside the explicit structural scope. Ownership changes must follow the canonical consumer thresholds and update all imports atomically.
- A component-organizer request does not authorize feature changes, package installation, commit, push, backend edits, or broad repository cleanup.

## Resolve the component owner

Inspect the current source tree and every consumer before writing. Use `docs/frontend/rebuild-architecture.md` and actual consumer evidence as authority.

- One-page UI: `apps/frontend/src/app/.../_components/<ComponentName>/`.
- Feature-specific UI used by at least two pages in one domain: `apps/frontend/src/features/<domain>/components/<ComponentName>/`.
- Domain-neutral UI used by at least three pages across at least two domains: `apps/frontend/src/components/ui/<ComponentName>/`.
- React Spectrum S2 adapters/compositions: `apps/frontend/src/components/spectrum/<ComponentName>/`.
- Reusable composed layouts: `apps/frontend/src/components/layout/<ComponentName>/`.
- Generic feedback surfaces: `apps/frontend/src/components/feedback/<ComponentName>/`.
- Parent-specific children: nest under the parent component folder.
- Cross-feature business components require explicit ownership review and must not be promoted to generic UI solely from consumer count.

## Organize proportionally

Read [references/component-structure-rules.md](references/component-structure-rules.md) completely before changing files.

Use one PascalCase folder per component and explicit filenames. Always keep `<ComponentName>.tsx`. Add files only when justified:

- `<ComponentName>.types.ts`: props/types exceed one or two trivial fields or are shared by multiple files.
- `<ComponentName>.config.ts`: repeated defaults, constants, or variant/theme mappings contain meaningful static configuration.
- `<ComponentName>.logic.ts`: state, effects, handlers, data fetching, or other behavior is complex enough to separate. Custom hooks belong here.
- `index.ts`: optional only for a component imported broadly across folders; never create `index.tsx`.

Do not split tiny helpers or simple conditional markup merely to make the main file short. Prefer three coherent files over six one-purpose files for a small component. Create a child subfolder only when it represents a meaningful nested UI component with its own identity or growth path.

## Workflow

1. Inventory the component folder, imports, exports, consumers, tests, stories, styles, and nested children.
2. State the current problems and propose the smallest proportional target tree.
3. Preserve the component family and exact path casing.
4. Move types first, then config, then complex logic; leave JSX and composition in `<ComponentName>.tsx`.
5. Place parent-specific child components in PascalCase subfolders with explicit filenames.
6. Update every affected import/export. Avoid `.js` suffixes and obsolete `index.tsx` paths unless the existing build contract requires them.
7. Remove only files made obsolete by this refactor after confirming no remaining references.
8. Run focused search, lint, TypeScript, static build, and browser validation in proportion to the changed component and current project health.
9. Report intentional structural changes, preserved contracts, validation evidence, and unrelated blockers.

## Safety and quality rules

- Preserve unrelated dirty-worktree changes.
- Never invent missing dependencies or placeholder components to force type-check success.
- Do not combine structural cleanup with color, copy, spacing, logic, API, or interaction changes unless explicitly requested.
- Keep exports consistent with nearby project components; preserve the existing public export style unless there is a documented reason to change it.
- Treat source and runtime evidence as authority when documentation differs, then update durable documentation through the documentation workflow.

## Completion checklist

- Target folder and file casing match the live project tree.
- The main `.tsx` remains readable and owns markup/composition.
- Types, config, and logic exist only when complexity justifies them.
- Nested child folders match nested UI ownership.
- All imports and exports point to existing paths.
- No stale file or reference remains.
- Behavior, props, styles, accessibility, and consumers are preserved.
- Validation results and unrelated blockers are reported accurately.

## Resources

- `references/component-structure-rules.md`: adapted CreativeApp rules, examples, and decision checklist.
