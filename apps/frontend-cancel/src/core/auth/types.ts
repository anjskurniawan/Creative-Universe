export type AccessibleApplication = { key: string; name: string; display_name: string; type: "core" | "sub_app"; status: string; frontend_path: string | null; sort_order: number };

export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  banner_url?: string | null;
  whatsapp_number?: string | null;
  division_id?: number | null;
  position_id?: number | null;
  settings?: Record<string, unknown> | null;
  card_image_url?: string | null;
  roles: string[];
  permissions: string[];
  applications: AccessibleApplication[];
  is_onboarded: boolean;
  emergency_maintenance?: boolean;
};

export type LoginCredentials = { username: string; password: string; remember?: boolean };
export type OnboardingPosition = { id: number; name: string; division_id: number };
export type OnboardingDivision = { id: number; name: string; positions: OnboardingPosition[] };
export type OnboardingInput = { name: string; division_id: number; whatsapp_number: string; position_id?: number; position_name?: string };
