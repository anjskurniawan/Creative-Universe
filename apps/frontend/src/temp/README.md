# Temporary Components

This directory stores retired implementation snapshots during the Atomic Design migration.

- Files here are excluded from TypeScript compilation.
- Active code must never import from this directory.
- A snapshot may be deleted only after the replacement has passed visual, functional, and documentation acceptance.
- `navbar-legacy/navbar.tsx` is the pre-atomic navbar snapshot.
- `landing-page-legacy/page.tsx` is the previous particle, wheel, and separate-mobile landing snapshot.
- `guest-landing-draft` contains the first route-specific Title and CTA atoms superseded by reusable atoms.
- The same draft folder also preserves the superseded `DisplayTitle` and `PrimaryCtaLink` naming iteration.
