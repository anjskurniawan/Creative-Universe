import { SystemStatusGrid } from "@/components/panel/maintenance/system-status-grid";
import { PreviewWrapper } from "../preview-wrapper";
export function SystemStatusGridPreview() { return <PreviewWrapper width="full"><SystemStatusGrid isLoading={false} status={{ app_env: "local", cache_driver: "file", queue_connection: "database", failed_jobs_count: 0, disk_free_space: "48 GB", log_file_size: "12 MB" }} /></PreviewWrapper>; }
