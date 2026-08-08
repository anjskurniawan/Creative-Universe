"use client";

import FileUploadDropzone from "@/components/ui/file-upload-dropzone";
import { PreviewWrapper } from "../preview-wrapper";

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
