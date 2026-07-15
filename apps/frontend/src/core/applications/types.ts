export type ApplicationKey = "core" | "kv-retail" | "creative-report" | "odds" | "generator" | "cai" | "design-assets";

export interface AccessibleApplication {
  key: ApplicationKey;
  name: string;
  display_name: string;
  type: "core" | "sub_app";
  status: "active" | "experimental" | string;
  frontend_path: string | null;
  sort_order: number;
}
