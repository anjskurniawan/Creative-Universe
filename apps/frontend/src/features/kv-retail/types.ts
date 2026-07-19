export interface KvRetailTask {
  id: number;
  task_name?: string | null;
  pic_vendor?: string | null;
  task_given_date?: string | null;
  deadline_date?: string | null;
  status: string;
  task_timestamps?: Record<string, string> | null;
  created_at?: string | null;
  created_by?: number | null;
  users?: unknown[];
  support_file_path?: unknown;
  draft_file_path?: unknown;
  file_link?: string | null;
  delay_reasons?: Record<string, { reason?: string; recorded_at?: string }> | null;
  timing_evaluation?: {
    bottleneck?: boolean;
    late?: boolean;
    violations?: Record<string, { label?: string; late?: boolean }>;
  } | null;
}

export interface KvRetailTaskEvent { task?: KvRetailTask }
export interface KvRetailTaskDeletedEvent { task_id: number }

export interface KvRetailTemporaryUpload {
  path: string;
  original_name: string;
}
