export interface ActivityItem {
  id: number;
  log_name: string | null;
  description: string;
  causer_name: string;
  created_at: string | null;
}

export interface RootMetrics {
  total_sessions: number;
  suspended_users: number;
  pending_jobs: number;
  failed_jobs: number;
  database_driver: string;
  database_size: string;
  laravel_version: string;
  php_version: string;
  git_branch: string;
  git_commit: string;
  latest_activities: ActivityItem[];
}

export interface DashboardStats {
  active_users: number;
  pending_users: number | null;
  roles: string[];
  is_root: boolean;
  root_metrics: RootMetrics | null;
}
