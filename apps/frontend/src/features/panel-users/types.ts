import type { AccessibleApplication } from "@/core/applications";

export interface UserFormState {
  name: string;
  email: string;
  whatsapp_number: string;
  password: string;
  password_confirmation: string;
  roles: string[];
  permissions: string[];
  applications: string[];
}

export interface ManagedUser {
  id: number;
  name: string;
  username: string;
  email: string;
  whatsapp_number: string | null;
  avatar_url: string | null;
  created_at: string | null;
  roles: string[];
  permissions: string[];
  all_permissions: string[];
  applications: AccessibleApplication[];
}

export interface UserManagementOptions {
  roles: string[];
  permissions: string[];
  all_permissions: string[];
  manager_whitelist: string[];
  is_root: boolean;
  permission_aliases: Record<string, string>;
  applications: Array<Pick<AccessibleApplication, "key" | "display_name" | "status" | "frontend_path">>;
}

export interface ManagedSession {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: string;
}

export interface ManagedActivity {
  id: number;
  log_name: string | null;
  description: string;
  event: string | null;
  created_at: string | null;
}

export interface ManagedUserDetail {
  user: ManagedUser;
  sessions: ManagedSession[];
  activities: ManagedActivity[];
  can_view_audit: boolean;
}
