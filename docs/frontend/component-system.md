# Frontend Component System

> Status: Current transitional structure
> Last verified: 2026-08-24

The components described here live in the active `apps/frontend/src/components/` and `apps/frontend/src/features/` trees. Historical placement remains evidence while the application is restructured in place. Every move follows [Frontend in-place restructuring architecture](rebuild-architecture.md), preserves behavior, and updates all consumers atomically.

## Current structure

- spectrum/: reserved for future project-owned collection components that compose multiple React Spectrum S2 exports. It is empty until such a collection is needed.
- universe/: project-owned components; use this for project primitives, composition, and components that are not exported by a dependency.
- `layout/`: reusable application-frame ownership. `Container`, `Workspace`, `Content`, `NavBar`, and `SideBar` keep their complete component families here; `Workspace/MenuOverlay` is nested because it has no consumer outside Workspace.
- `universe/Layouts/SettingLayout/`: transitional settings-domain layout retained until PANEL-001; it is not part of the generic layout family.
- The default `Container` gutter is `0` on mobile and `24px` from the `lg` breakpoint; consumers that provide `className` explicitly own their outer gutter.
- `features/auth/components/ParallaxBackground/`: auth/landing ambient background family used by login, onboarding, and guest portal.
- `app/_components/LoadingBackground/`: root-page-only loading background; it is not a reusable global feedback component.
- `features/auth/components/`: authentication and landing ownership:
  - `AuthCard/`, `Login/`, and `Onboarding/` own the authentication form/card flows.
  - `Portal/Auth/` and `Portal/Guest/` own the authenticated and public landing compositions.
  - `LandingText/`, `MediaAgent/`, and `AppUniverse/` are landing-auth component siblings; their markup, logic, types, and animation contracts were moved intact.
- `feedback/UniversalErrorView/`, `feedback/ErrorTetrisGame/`, and `feedback/Toast/`: generic runtime error/session/maintenance and transient status feedback organized as PascalCase component folders.
- ui/, primitives/, typography/: existing primitives and UI patterns.
- `layout/`: reusable shell composition; `navigation/` is transitional domain debt whose SideMenu, messages, and notifications assignments are recorded in the shell ownership audit; `panel/` remains domain debt for PANEL-001.
- docs/: internal playground and documentation UI.
- src/app/: route-local pages, layouts, and metadata.
- src/features/: domain API, state, and composition for Auth, ODDS, KV Retail, Creative AI, Generator, and other domains.

Developer library metadata may provide `sourcePath` when the canonical owner is outside `src/components/`. Auth, Login, Onboarding, and Landing entries now resolve to 20 verified `features/auth/components` source files while their menu/category identifiers remain stable.

## Ownership rules

- Import React Spectrum S2 components directly from their installed `@react-spectrum/s2/<Component>` subpath. Do not recreate local Spectrum wrappers.
- Use spectrum/ only for a project-owned collection component with meaningful composition; do not place individual dependency wrappers there.
- For an explicit Spectrum request, use the [React Spectrum S2 skill](../ai/react-spectrum-s2-skill.md).
- For React Aria, an existing Aria component, or a new reusable Universe component, use the [React Aria skill](../ai/react-aria-skill.md).
- Do not move a component family or restructure it without explicit instruction.
- Trace the active renderer and consumers before changing a reusable component.
- Route-local UI remains with its route until cross-domain reuse is established.

Spectrum components must follow the installed package API and webpack macro. Do not rely on component names from stale documentation.
