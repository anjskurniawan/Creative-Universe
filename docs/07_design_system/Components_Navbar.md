# Navbar Component

**Level:** Organism  
**Application owner:** Core  
**Status:** active  
**Documentation URL:** `/docs?section=components/navbar`  
**Legacy snapshot:** `apps/frontend/src/temp/navbar-legacy/navbar.tsx`

## Purpose

Navbar is the global navigation organism for Creative Universe. The atomic rewrite preserves the approved legacy design and behavior while separating reusable visual primitives from authentication and interaction state.

## Atomic composition

| Level | Component | Responsibility |
|---|---|---|
| Atom | `CreativeUniverseLogo` | Brand mark without navigation behavior. |
| Atom | `NavbarAction` | Icon action rendered as link or button. |
| Atom | `NavbarAvatar` | User avatar, fallback initials, and account trigger semantics. |
| Molecule | `NavbarMenuItem` | Reusable application/profile menu row and optional badge. |
| Molecule | `NavbarUserSummary` | Name, primary role, and avatar summary. |
| Organism | `Navbar` | Authentication, application registry, dropdown state, notifications, messages, and logout. |
| Template | `NavbarDocumentation` | Interactive component control and visualization. |

## Variants

Navbar has three production axes:

1. Visual: `light`, `dark`, or `transparent-dark`.
2. Position: `sticky=true` or `sticky=false` (relative).
3. Session: guest or authenticated, normally resolved from `AuthProvider`.

This produces **12 behavioral combinations**. `transparent-dark` keeps every dark foreground, popup, focus, and avatar treatment while making only the navbar surface transparent. Desktop and mobile are responsive views of the same organism, not duplicated components.

## Public API

```tsx
<Navbar variant="light" sticky />
<Navbar variant="dark" sticky={false} />
<Navbar variant="transparent-dark" sticky={false} />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `light \| dark \| transparent-dark` | `light` | Controls navbar surface and popup tone. |
| `sticky` | `boolean` | `true` | Uses sticky top positioning when enabled. |
| `session` | `connected \| guest \| preview-authenticated` | `connected` | Guest/preview values are documentation and isolated-preview controls. |
| `previewUser` | `AuthUser` | built-in fixture | Only consumed by preview-authenticated mode. |
| `interactive` | `boolean` | `true` | Allows dropdown interaction in controlled previews. |

## Preserved functionality

- Root-only Developer Panel.
- Notification and message realtime consumers.
- Application list from the authenticated user's registry assignment.
- Experimental application badge.
- Profile, Dashboard, Settings, Help Center, and Sign Out.
- Outside-click and Escape dismissal.
- Mobile popup positioning and desktop anchored popup.
- Mobile horizontal padding is `16px`; desktop padding from `md` is `64px`.

## Governance

- Production code must import from `@/components/navbar` or the organism path; it must never import from `src/temp`.
- Visual changes require updating the live documentation page and this contract in the same change.
- A new variant must be added to the documented matrix before it is used by a product page.
- The legacy snapshot remains temporary and may be deleted only after visual and functional acceptance.
