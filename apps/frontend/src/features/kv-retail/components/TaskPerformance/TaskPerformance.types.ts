export type TaskPerformanceTask = {
  id: number;
  task_name?: string | null;
  status: string;
  task_given_date?: string | null;
  deadline_date?: string | null;
  task_timestamps?: Record<string, string> | null;
  timing_evaluation?: {
    bottleneck?: boolean;
    late?: boolean;
    violations?: Record<string, { late?: boolean }>;
  } | null;
};
