export interface SystemStatus {
  app_env: string;
  cache_driver: string;
  queue_connection: string;
  failed_jobs_count: number;
  disk_free_space: string;
  log_file_size: string;
}
