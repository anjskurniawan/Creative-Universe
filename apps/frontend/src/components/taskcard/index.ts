export * from "./date";
export { default as TaskCardDate } from "./date";

export * from "./next-button";
export { default as TaskCardNextButton } from "./next-button";

export * from "./title-task";
export { default as TaskCardTitleTask } from "./title-task";

export * from "./loading-bar";
export { default as TaskCardLoadingBar } from "./loading-bar";

export * from "./detail-status";
export { default as TaskCardDetailStatus } from "./detail-status";

export * from "./detail";
export { default as TaskCardDetail } from "./detail";

export * from "./button-status";
export { default as TaskCardButtonStatus } from "./button-status";

export * from "./delete-overlay";
export { default as TaskCardDeleteOverlay } from "./delete-overlay";

export * from "./submit-link-overlay";
export { default as TaskCardSubmitLinkOverlay } from "./submit-link-overlay";

export * from "./view-link-overlay";
export { default as TaskCardViewLinkOverlay } from "./view-link-overlay";

export * from "./upload-overlay";
export { default as TaskCardUploadOverlay } from "./upload-overlay";

export { default as TaskCard } from "./task-card";
export type { TaskCardState, TaskCardProps } from "./task-card";

export type TaskCardConfig = {
  vendor_options?: string;
  // Overlays
  delete_overlay_title?: string;
  delete_overlay_cancel?: string;
  delete_overlay_confirm?: string;
  
  upload_overlay_title_support?: string;
  upload_overlay_title_draft?: string;
  upload_overlay_cancel?: string;
  upload_overlay_submit?: string;
  upload_overlay_saving?: string;
  
  submit_link_title?: string;
  submit_link_desc?: string;
  submit_link_placeholder?: string;
  submit_link_cancel?: string;
  submit_link_submit?: string;
  
  view_link_title?: string;
  view_link_desc?: string;
  view_link_cancel?: string;
  view_link_copy?: string;

  // Status & Details
  btn_status_draft?: string;
  btn_status_progress?: string;
  btn_status_approve?: string;
  btn_status_email?: string;
  
  detail_status_1?: string; // 3D Gambar Kerja
  detail_status_2?: string; // Draft Final
  detail_dropdown_file?: string;
  detail_dropdown_upload?: string;
  
  detail_link_file?: string;
  task_empty_state?: string;

  // Colors & Icons
  color_done_bg?: string;
  color_done_text?: string;
  color_progress_bg?: string;
  color_progress_text?: string;
  color_delete_bg?: string;
  color_delete_text?: string;
  
  icon_file_empty?: string;
  icon_file_filled?: string;
};
