import type { AccessibleApplication } from "@/core/applications";

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  whatsapp_number: string | null;
  avatar_url: string | null;
  is_onboarded: boolean;
  division_id: number | null;
  position_id: number | null;
  roles: string[];
  permissions: string[];
  applications: AccessibleApplication[];
  settings: Record<string, unknown> | null;
  emergency_maintenance?: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface OnboardingPosition {
  id: number;
  name: string;
  division_id: number;
}

export interface OnboardingDivision {
  id: number;
  name: string;
  positions: OnboardingPosition[];
}

export interface OnboardingInput {
  name: string;
  division_id: number;
  whatsapp_number: string;
  position_id?: number;
  position_name?: string;
}
