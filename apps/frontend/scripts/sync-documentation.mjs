import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDirectory, "..");
const repositoryRoot = path.resolve(frontendRoot, "../..");

const documents = [
  {
    source: "docs/00_architecture/Application_Catalog.md",
    target: "public/docs/core/application-catalog.md",
  },
  {
    source: "docs/00_architecture/Modular_SubApp_Architecture.md",
    target: "public/docs/core/modular-sub-app-architecture.md",
  },
  {
    source: "docs/05_migration/Backend_Modularization_Migration_Map.md",
    target: "public/docs/core/backend-modularization-migration-map.md",
  },
  {
    source: "docs/05_migration/Frontend_Refactor_Baseline.md",
    target: "public/docs/core/frontend-refactor-baseline.md",
  },
  {
    source: "docs/05_migration/Frontend_Audit_Report.md",
    target: "public/docs/core/frontend-audit-report.md",
  },
  {
    source: "docs/05_migration/Frontend_Backend_Contract_Matrix.md",
    target: "public/docs/core/frontend-backend-contract-matrix.md",
  },
  {
    source: "docs/05_migration/Frontend_Module_Boundaries.md",
    target: "public/docs/core/frontend-module-boundaries.md",
  },
  {
    source: "docs/05_migration/Frontend_Route_And_Layout_Migration.md",
    target: "public/docs/core/frontend-route-layout-migration.md",
  },
  {
    source: "docs/05_migration/Frontend_Canonical_URLs.md",
    target: "public/docs/core/frontend-canonical-urls.md",
  },
  {
    source: "docs/05_migration/Frontend_Legacy_Route_Cleanup.md",
    target: "public/docs/core/frontend-legacy-route-cleanup.md",
  },
  {
    source: "docs/05_migration/Frontend_API_Client_Foundation.md",
    target: "public/docs/core/frontend-api-client-foundation.md",
  },
  {
    source: "docs/05_migration/Frontend_Domain_API_Modules.md",
    target: "public/docs/core/frontend-domain-api-modules.md",
  },
  {
    source: "docs/05_migration/Frontend_Authentication_Synchronization.md",
    target: "public/docs/core/frontend-authentication-synchronization.md",
  },
  { source: "docs/05_migration/Frontend_Application_Access.md", target: "public/docs/core/frontend-application-access.md" },
  { source: "docs/05_migration/Frontend_Permission_Aliases.md", target: "public/docs/core/frontend-permission-aliases.md" },
  { source: "docs/05_migration/Frontend_Core_Module_Alignment.md", target: "public/docs/core/frontend-core-module-alignment.md" },
  { source: "docs/05_migration/Frontend_Pusher_Configuration.md", target: "public/docs/core/frontend-pusher-configuration.md" },
  { source: "docs/05_migration/Frontend_KV_Retail_Integration.md", target: "public/docs/core/frontend-kv-retail-integration.md" },
  { source: "docs/05_migration/Frontend_KV_Retail_State_Stability.md", target: "public/docs/core/frontend-kv-retail-state-stability.md" },
  { source: "docs/05_migration/Frontend_Creative_Report_Integration.md", target: "public/docs/core/frontend-creative-report-integration.md" },
  { source: "docs/05_migration/Frontend_ODDS_Integration.md", target: "public/docs/core/frontend-odds-integration.md" },
  { source: "docs/05_migration/Frontend_Core_Chat_Integration.md", target: "public/docs/core/frontend-core-chat-integration.md" },
  { source: "docs/05_migration/Frontend_Finalization_F19_F32.md", target: "public/docs/core/frontend-finalization-f19-f32.md" },
  {
    source: "docs/03_backend_api/Core_Public_Contracts.md",
    target: "public/docs/core/public-contracts.md",
  },
  {
    source: "docs/03_backend_api/API_Route_Map.md",
    target: "public/docs/core/api-route-map.md",
  },
  {
    source: "docs/05_database/Database_ERD_Verification.md",
    target: "public/docs/core/database-erd-map.md",
  },
  {
    source: "docs/08_operations/CPanel_Deployment_Runbook.md",
    target: "public/docs/core/cpanel-deployment-runbook.md",
  },
  {
    source: "docs/08_operations/Emergency_Maintenance.md",
    target: "public/docs/core/emergency-maintenance.md",
  },
  {
    source: "docs/07_design_system/kv_retail_theme_tokens.md",
    target: "public/docs/core/kv-retail-theme-tokens.md",
  },
];

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, "");
}

for (const document of documents) {
  const source = path.join(repositoryRoot, document.source);
  const target = path.join(frontendRoot, document.target);

  await mkdir(path.dirname(target), { recursive: true });

  const content = await readFile(source, "utf8");
  await writeFile(target, stripFrontmatter(content), "utf8");
}

console.log(`Synchronized ${documents.length} documentation pages.`);
