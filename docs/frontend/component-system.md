# Frontend Component System

> Status: Current
> Last verified: 2026-08-13

Reusable components live under apps/frontend/src/components/. Component ownership follows implementation and domain, not only similar visual appearance.

## Current structure

- spectrum/: reserved for future project-owned collection components that compose multiple React Spectrum S2 exports. It is empty until such a collection is needed.
- universe/: project-owned components; use this for project primitives, composition, and components that are not exported by a dependency.
- `universe/SideBar/`: the shared desktop sidebar family, with `SideBar.tsx` as the composition entry and PascalCase child folders for its footer, item, and section components.
- `universe/Layouts/`: reusable layout family containing `Container`, `Content`, and `Workspace` component folders with PascalCase filenames. `Container`, `Content`, and `Workspace` keep their public props in `*.types.ts`; `Workspace` also keeps route/menu state in `Workspace.logic.ts`.
- The default `Container` gutter is `8px` on mobile and `24px` from the `lg` breakpoint; consumers that provide `className` explicitly own their outer gutter.
- `universe/Background/`: reusable decorative background family, including `ImageBackground` for full-page image loading states.
- `universe/AuthPortal/`: authenticated landing composition; `AuthPortal.tsx` owns markup while `AuthPortal.logic.ts` owns auth-derived state and media rotation.
- `universe/LandingText/`: landing heading composition; `LandingText.tsx` owns markup while `LandingText.logic.ts` owns greeting, animation visibility, and typing completion state.
- `universe/MediaAgent/`: media card renderer for image and video assets, with its public props in `MediaAgent.types.ts`.
- `universe/AppUniverse/`: animated application orbit; `AppUniverse.tsx` owns GSAP composition and its public props/config types live in `AppUniverse.types.ts`.
- ui/, primitives/, typography/: existing primitives and UI patterns.
- layout/, navigation/, panel/: reusable shells and composition.
- docs/: internal playground and documentation UI.
- src/app/: route-local pages, layouts, and metadata.
- src/features/: domain API, state, and composition for ODDS, KV Retail, Creative AI, Generator, and other domains.

## Ownership rules

- Import React Spectrum S2 components directly from their installed `@react-spectrum/s2/<Component>` subpath. Do not recreate local Spectrum wrappers.
- Use spectrum/ only for a project-owned collection component with meaningful composition; do not place individual dependency wrappers there.
- For an explicit Spectrum request, use the [React Spectrum S2 skill](../ai/react-spectrum-s2-skill.md).
- For React Aria, an existing Aria component, or a new reusable Universe component, use the [React Aria skill](../ai/react-aria-skill.md).
- Do not move a component family or restructure it without explicit instruction.
- Trace the active renderer and consumers before changing a reusable component.
- Route-local UI remains with its route until cross-domain reuse is established.

Spectrum components must follow the installed package API and webpack macro. Do not rely on component names from stale documentation.
