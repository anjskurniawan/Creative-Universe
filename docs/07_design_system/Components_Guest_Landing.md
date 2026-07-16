# Guest Landing Components

**Status:** active, accepted  
**Route:** `/`
**Component documentation:** `/docs?section=components/hero-heading` and `/docs?section=components/primary-action-link`

Both atoms are registered in `src/design-system/documentation/component-registry.ts`. The documentation menu is generated from this registry; an unregistered component is not considered complete.

Component documentation is separated from architecture documents under the top-level `Design System` menu and grouped by application ownership. All current Guest Landing components belong to `Core`.

## Composition

The guest landing page is intentionally limited to three visible components:

1. `Navbar` organism in `transparent-dark` and `guest` mode.
2. Reusable `HeroHeading` typography atom.
3. Reusable `PrimaryActionLink` action atom.

Authenticated users do not consume this page and are redirected to `/dashboard` after the Core authentication state resolves.
The universe background is an independent layer and fades from transparent to visible through GSAP over 0.72 seconds. Typing starts after this entrance has completed. Reduced-motion users receive the background immediately.
During authentication resolution, the page renders the same universe background without an entrance animation, preventing a white loading flash.
The PrimaryActionLink is rendered 400ms after HeroHeading emits `onTypingComplete`. Its 1.2-second entrance preserves the legacy motion character: opacity 0, 14px downward offset, and 8px blur transition smoothly to the final state without scaling. Reduced-motion users receive the action without entrance motion.

The page background asset is stored at `public/images/landing/creative-universe-background.jpg`. The original workspace filename `Background_Universe_2.jpg` was renamed and moved so page-level assets follow the public landing asset convention.
The hero content follows the Navbar horizontal gutter exactly: 16px on mobile and 64px from the desktop breakpoint, without an additional heading max-width.

## HeroHeading

- Purpose: the single primary heading of the guest landing page.
- Content: `This is Where Creative Begins`.
- Alignment: configurable through `left` or `center`.
- Scale: responsive at 48px mobile, 72px tablet, and 96px desktop.
- The page owns spacing; the title atom owns only typography.
- Accepts reusable content and an optional `className`; it is not tied to the `/` route.
- Optional `typing` and `typingSpeed` props provide a reusable grapheme-safe typing animation and gradient cursor.

## PrimaryActionLink

- Purpose: the primary navigation action for entering authentication.
- Label: `Masuk ke Universe`.
- Target: `/login` through the canonical route catalog.
- Uses a semantic link because the action navigates rather than submits data.
- Includes hover and keyboard focus states.
- Responsively adapts from 48px height, 24px horizontal padding, and 16px text to the desktop reference of 56px, 32px, and 18px.
- Accepts reusable content, target, and an optional `className`; it is not tied to the landing page.

## Legacy snapshot

The previous particle, Three.js, spinning wheel, motivational quote, separate mobile landing, and transition implementation is preserved at:

`apps/frontend/src/temp/landing-page-legacy/page.tsx`

The first landing-specific atom draft is preserved at `apps/frontend/src/temp/guest-landing-draft`.

Active code must not import this snapshot.
