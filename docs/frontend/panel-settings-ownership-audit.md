# Panel and Settings Ownership Audit

> Status: Active restructuring reference  
> Last verified: 2026-08-24

This document records PANEL-001 ownership, consumer evidence, and preserved frontend contracts. It describes structural placement only; UI, API payloads, permissions, state transitions, copy, validation, responsive behavior, and accessibility remain unchanged.

## Route ownership

Settings routes remain under `src/app/(core)/settings/`: account profile, appearance, notifications, privacy, applications; security authentication, session, activity log; administration system configuration, workflow, generator preferences, and access control. Redirect-only index routes remain routing concerns.

Panel routes remain under `src/app/(core)/panel/`: dashboard/detail, users, roles, profile, and maintenance. `/panel/detail` reuses the dashboard page and must preserve that route alias.

All routes are statically exported shells whose authenticated data and mutations require the live Laravel API in the browser.

## Completed settings shell slice

| Owner | Evidence and preserved contract |
|---|---|
| `features/settings/components/SettingLayout/` | Shared by the complete Settings subtree; retains Spectrum Provider/router bridge, aside context, mobile detail state, route-derived titles, and responsive grid |
| `SettingLayout/SettingMenu/` | Parent-owned SideNav plus exact `manage-settings` filtering, selected route, expansion, href/query matching, labels, and navigation config |
| `SettingLayout/SettingsProfileHeader/` | Parent-owned auth profile summary with existing division/position fallbacks |
| `SettingLayout/SettingTitle/` | Parent-owned responsive title/back action and Spectrum typography macro |
| `app/(core)/settings/_components/BackgroundSky/` | One settings route-layout consumer; retains the exact full-viewport gradient wrapper |

Every implementation, logic, config, type, route import, profile-page aside hook, and developer registry path moved atomically. The historical Universe/layout paths have no remaining source consumers.

## Completed route-local settings slice

- Privacy settings has one product consumer and now lives below `account/privacy/_components/AccountPrivacySettings/`. It preserves `PATCH /profile`, `profile_show_applications`, auth refresh, Spectrum controls, validation errors, and toast/alert feedback.
- Security activity log has one product consumer and now lives below `security/activity-log/_components/ActivityLog/`. It preserves `GET /profile/activities`, Indonesian labels/time formatting, IP display, and loading/empty/error states.

## Completed dashboard slice

The seven dashboard components and shared `Dashboard.types.ts` are owned by `/panel/dashboard` under its `_components/` directory. Developer previews remain metadata/test consumers and do not promote product ownership.

Preserved contracts include `coreApi.dashboard`, root/non-root stats branches, `manage-users`, `manage-roles`, and `run-artisan` quick-action visibility; health probes; emergency maintenance GET/PATCH; maintenance commands; global `show-toast` events; loading state; and the `/panel/detail` route alias.

## Completed Panel Users slice

`features/panel-users/` now owns `hooks/useUsers.ts`, shared `UserFormState`, and the UserFilters, UserTable, UserMobileGrid, UserDetailModal, and UserWhitelistModal component folders. The `/panel/users` page remains routing/composition only.

The move preserves paginated list/search/role filtering; options and permission aliases; detail loading; account fields, roles, direct permissions, and applications; update/delete; session revocation; Root-only manager whitelist; protected Root rows for non-Root managers; responsive table/mobile cards; confirmation and modal errors; and every global `show-toast` event. The `manage-users` load gate and `hasRole("Root")` calculation are unchanged.

The former component-to-route type import is closed: `UserFormState` now lives in the feature, and the exact ESLint boundary exception was removed.

## Completed Panel Roles slice

`features/panel-roles/` now owns `hooks/useRoles.ts`, RoleTable, and RoleEditorModal. The route page retains only composition, access-denied rendering, and ConfirmModal wiring.

The move preserves the `manage-roles` gate, parallel role/permission-catalog load, protected-role display, active/total user counts, permission selection/reset, create/update/delete payloads, delete confirmation, loading/empty states, and all success/error `show-toast` messages. A second `components/settings/roles/roles-page.tsx` implementation differed only in formatting and had no runtime consumer; it was deleted after its developer metadata was repointed to the canonical `/panel/roles` page.

## Completed Panel Maintenance slice

`features/panel-maintenance/` now owns the four Maintenance component folders, `hooks/useMaintenance.ts`, the three focused state/API hooks, and the shared `SystemStatus` response type. The `/panel/maintenance` page remains routing and composition only; its developer preview and registry point directly to the feature-owned implementation.

The move preserves the Root route gate, `run-artisan` status-load guard, status and emergency endpoints, emergency confirmation and feedback copy, allowed command keys and confirmations, console lifecycle, success-triggered silent status refresh, and every global `show-toast` event. Moving `SystemStatus` out of the UI implementation also removes the former hook-to-component type dependency without changing its fields.

## Completed Panel Profile and admin-contract slice

`/panel/profile` is the only product page consuming its ProfileCard and ProfileApps implementations, so both now live below `app/(core)/panel/profile/_components/` in proportional PascalCase folders. The route retains auth-state composition, the null-user branch, exact grid and timeline placeholder, profile-edit/contact links, role/application presentation, and all responsive classes.

The former mixed `core/admin/index.ts` has been removed after every symbol was assigned to its actual owner. User management contracts and unchanged format/error/initials helpers now live in `features/panel-users`; role contracts and unchanged error mapping live in `features/panel-roles`; the pure cross-domain pagination contract lives in `types/pagination.ts` for Panel Users and Generator. This closes domain UI contracts inside `core/` without introducing feature-to-feature imports.

## Completed residual Settings audit

The remaining account and administration routes keep their existing cohesive state/API logic inline, as required; no superficial route wrappers were introduced. Consumer search proved `components/settings/profile-settings-tabs.tsx`, `security-settings.tsx`, and `role-setting-page.tsx` had no runtime imports. The first had no registry entry, while the latter two had metadata and placeholder-only previews that did not render the implementations. All three unreachable implementations and the two false library entries were removed. The valid SettingsNavigationConfig registry entry now resolves to the canonical SettingMenu config.

## Authorization and behavior invariants

- Users remains gated by `manage-users`; Root-only manager-whitelist behavior and role checks remain unchanged.
- Roles remains gated by `manage-roles`; protected roles, permission catalog, create/update/delete behavior, and confirmation flow remain unchanged.
- Maintenance retains the Root role gate, polling/refresh behavior, emergency mode, allowed commands, console output, and global maintenance event behavior.
- Administration SideNav retains its `manage-settings` visibility gate. Page-level permissions such as `run-artisan`, `approve-users`, and `access-pricetag` remain source-authoritative.
- Suspected defects or duplicate historical components are not fixed as part of structural movement.

## Validation contract

Each ownership slice requires stale-path search, boundary/focused lint, type-aware production build, scoped diff check, registry synchronization, and documentation validation. Authenticated desktop/mobile route smoke remains pending while the local API/session is unavailable; build success does not prove UI parity.

Related references: [architecture contract](rebuild-architecture.md), [phase registry](migration-inventory.md), and [shell audit](shell-ownership-audit.md).
