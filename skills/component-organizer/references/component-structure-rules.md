# CreativeApp Component Structure Rules

Use these rules for Next.js, TypeScript, and Tailwind CSS components in CreativeApp.

## Core rules

1. One component has one PascalCase folder.
2. Use explicit filenames, never `index.tsx`.
3. Nested folders follow nested UI ownership.
4. Create files because complexity requires them, not as a mandatory template.
5. Keep dependency direction: `types -> config -> logic -> component.tsx`.
6. Preserve the owning family and live path casing.

## CreativeApp path mapping

```text
frontend/src/components/
|-- universe/    # Default project-owned and React Aria-backed components
|-- spectrum/    # Explicit React Spectrum S2 components
`-- layouts/     # Reusable composed layouts when this category is already used
```

Some existing project areas may use an established path with different casing, such as `Layout/`. Preserve the live path during a scoped organizer task unless the user explicitly requests a category migration.

Route-specific components may remain under `frontend/src/app/<route>/`. Do not promote them automatically.

## File decision table

| File | Requirement | Create when | Skip when |
| --- | --- | --- | --- |
| `ComponentName.tsx` | Required | Always | Never |
| `ComponentName.types.ts` | Usually | Props exceed 1-2 trivial fields or types are shared | Props are genuinely tiny and local |
| `ComponentName.config.ts` | Conditional | Repeated defaults/constants or meaningful variant/theme mappings exist | One or two values are used once |
| `ComponentName.logic.ts` | Conditional | State, effects, handlers, fetching, or behavior is complex | Component is presentational or logic is trivial |
| `index.ts` | Optional | A stable public barrel improves many cross-folder imports | Component is internal/local |

## Proportional examples

### Simple presentational component

```text
AppIcon/
`-- AppIcon.tsx
```

### Component with meaningful variants

```text
AppIcon/
|-- AppIcon.types.ts
|-- AppIcon.config.ts
|-- AppIcon.tsx
`-- AppIconLogo/
    `-- AppIconLogo.tsx
```

Create `AppIconLogo/` only when it is a meaningful child component. If it is merely a few static SVG paths with no independent identity, keeping it in `AppIcon.tsx` may be more proportional.

### Medium component

```text
Avatar/
|-- Avatar.types.ts
|-- Avatar.config.ts
`-- Avatar.tsx
```

Do not automatically create `AvatarImage.tsx`, `AvatarFallback.tsx`, or `Avatar.utils.ts` for small markup branches or a tiny initials helper.

### Complex stateful component

```text
DropdownMenu/
|-- DropdownMenu.types.ts
|-- DropdownMenu.config.ts
|-- DropdownMenu.logic.ts
|-- DropdownMenu.tsx
|-- DropdownItem/
|   `-- DropdownItem.tsx
|-- DropdownDivider/
|   `-- DropdownDivider.tsx
`-- DropdownHeader/
    `-- DropdownHeader.tsx
```

## Nested child rules

- Keep a child used only by one parent inside the parent folder.
- Give a meaningful child its own PascalCase subfolder.
- Apply the same proportional file rules inside a child folder.
- Promote a child only after verifying it is reused across parents or features.
- Do not leave child component files loose beside the parent when they have independent UI identity.

## Playground rules

If the project has a component playground, place route demos under `frontend/src/app/playground/<component-name>/page.tsx`. Each interactive variant owns isolated state so one demo cannot affect another. Do not create playground routes unless explicitly requested.

## Organizer checklist

- [ ] Inspect the component, children, consumers, and current exports.
- [ ] Confirm the owning path: Universe, Spectrum, layout, or route-local.
- [ ] Keep `<ComponentName>.tsx`.
- [ ] Add `.types.ts` only when justified.
- [ ] Add `.config.ts` only for meaningful static configuration.
- [ ] Add `.logic.ts` only for complex behavior.
- [ ] Nest meaningful parent-owned children in PascalCase folders.
- [ ] Preserve UI, behavior, props, styles, accessibility, and data contracts.
- [ ] Update every affected import/export using exact path casing.
- [ ] Remove obsolete files only after confirming zero references.
- [ ] Validate proportionally and report unrelated blockers separately.
