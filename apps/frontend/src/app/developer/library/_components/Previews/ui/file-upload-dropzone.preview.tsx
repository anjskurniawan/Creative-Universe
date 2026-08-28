"use client";

import FileUploadDropzone from "@/features/kv-retail/components/TaskFormModal/FileUploadDropzone/FileUploadDropzone";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

interface FileUploadDropzonePreviewProps {
  label?: string;
  description?: string;
  maxFiles?: number;
}

export function FileUploadDropzonePreview({
  label = "Lampiran file",
  description = "PDF, JPG, PNG hingga 10 MB",
  maxFiles = 3,
}: FileUploadDropzonePreviewProps) {
  return (
    <PreviewWrapper width="md">
      <FileUploadDropzone
        label={label}
        description={description}
        maxFiles={maxFiles}
        onFilesChange={() => undefined}
      />
    </PreviewWrapper>
  );
}
