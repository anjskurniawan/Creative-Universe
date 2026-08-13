# React Spectrum S2 Skill

> Status: Current
> Last verified: 2026-08-13

Use skills/react-spectrum-s2/SKILL.md when a request mentions React Spectrum, Spectrum S2, or @react-spectrum/s2.

- The @react-spectrum/s2 dependency and webpack macro are available in the frontend.
- Use installed package APIs and direct subpath imports such as `@react-spectrum/s2/Button`. Do not introduce local wrapper components or invent APIs.
- Read the relevant component reference and guide before implementation.
- S2 has its own style macro and slot composition. Do not mix Tailwind or another design system into an S2 implementation.
- Run type checks, the webpack build, and runtime warning checks when possible.

See [Next.js static export](../frontend/nextjs-static-export.md) and [component system](../frontend/component-system.md).
