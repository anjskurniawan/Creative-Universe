export interface ComponentDocumentationEntry {
  name: string;
  label: string;
  slug: `components/${string}`;
  level: "atom" | "molecule" | "organism" | "template";
  status: "draft" | "review" | "stable";
  application: "core" | "kv-retail" | "creative-report" | "odds" | "generator" | "cai" | "design-assets";
}

export const COMPONENT_DOCUMENTATION = [
  { name: "Navbar", label: "Navbar", slug: "components/navbar", level: "organism", status: "stable", application: "core" },
  { name: "HeroHeading", label: "Hero Heading", slug: "components/hero-heading", level: "atom", status: "stable", application: "core" },
  { name: "PrimaryActionLink", label: "Primary Action Link", slug: "components/primary-action-link", level: "atom", status: "review", application: "core" },
  { name: "ErrorTetrisGame", label: "Error Tetris Game", slug: "components/error-tetris-game", level: "organism", status: "review", application: "core" },
  { name: "UniversalErrorView", label: "Universal Error View", slug: "components/universal-error-view", level: "template", status: "review", application: "core" },
] as const satisfies readonly ComponentDocumentationEntry[];

const APPLICATION_LABELS: Record<ComponentDocumentationEntry["application"], string> = {
  core: "Core",
  "kv-retail": "KV Retail Task",
  "creative-report": "Creative Report",
  odds: "ODDS",
  generator: "Generator",
  cai: "Creative AI",
  "design-assets": "Design Assets",
};

export const COMPONENT_DOCS_MENU_GROUPS = Object.keys(APPLICATION_LABELS).flatMap((application) => {
  const entries = COMPONENT_DOCUMENTATION.filter((entry) => entry.application === application);
  return entries.length ? [{
    label: APPLICATION_LABELS[application as ComponentDocumentationEntry["application"]],
    children: entries.map(({ label, slug }) => ({ label, slug })),
  }] : [];
});
