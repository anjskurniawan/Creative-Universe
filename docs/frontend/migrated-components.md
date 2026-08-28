# Cancelled Clean-Rebuild Component Inventory

> Status: Deprecated historical snapshot  
> Last verified: 2026-08-24  
> Scope: cancelled source preserved at `apps/frontend-cancel/`

The component QA registry created for the clean-rebuild program is retired. Its `Belum di QA`, `Proses QA`, and `Final` statuses do not apply to the active in-place restructuring program and must not be used by `QA`, `QA List`, or `QA Pending` commands.

The clean rebuild was permanently cancelled on 2026-08-24. Its files were moved from the former `apps/frontend/` location to the strictly read-only `apps/frontend-cancel/` snapshot. Do not update components or QA state there, do not import from it, and do not use it as the implementation authority for the active frontend.

Current structural progress is tracked in [Frontend In-Place Restructuring Registry](migration-inventory.md). Component placement and consumer decisions follow [Frontend In-Place Restructuring Architecture](rebuild-architecture.md) and [Component Tree — In-Place Restructuring Conventions](component-tree-migration.md).

Historical component-level QA decisions remain preserved in the immutable `logs/logs.md` history. They describe the cancelled rebuild only and do not prove current active-frontend QA or parity.
