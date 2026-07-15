export interface PermissionCatalogItem {
  key: string;
  display_name: string;
  group_key: string;
  description: string | null;
  application_key: string;
  application_name: string;
  sort_order: number;
}
