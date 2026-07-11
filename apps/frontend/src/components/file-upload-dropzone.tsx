"use client";

import React, { useRef, useState } from 'react';
import { MaterialIcon } from './material-icon';
import { getCookie, refreshCsrfCookie } from '@/lib/api';

export interface UploadedFile {
  originalFile: File;
  tempPath?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface FileUploadDropzoneProps {
  label: string;
  description: string;
  maxFiles?: number;
  onFilesChange: (files: UploadedFile[]) => void;
}

export default function FileUploadDropzone({
  label,
  description,
  maxFiles = 3,
  onFilesChange
}: FileUploadDropzoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = (fileToUpload: File, fileIndex: number, isRetry = false) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', fileToUpload);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[fileIndex].progress = percentCompleted;
          return newFiles;
        });
      }
    });

    xhr.addEventListener('load', async () => {
      if (xhr.status === 419 && !isRetry) {
        // CSRF Token mismatch, refresh cookie and retry
        try {
          await refreshCsrfCookie();
          triggerUpload(fileToUpload, fileIndex, true);
        } catch (e) {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[fileIndex].status = 'error';
            newFiles[fileIndex].errorMessage = 'Sesi kedaluwarsa';
            onFilesChange(newFiles);
            return newFiles;
          });
        }
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[fileIndex].status = 'success';
          newFiles[fileIndex].progress = 100;
          newFiles[fileIndex].tempPath = response.path;
          onFilesChange(newFiles);
          return newFiles;
        });
      } else {
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[fileIndex].status = 'error';
          newFiles[fileIndex].errorMessage = 'Upload gagal';
          onFilesChange(newFiles);
          return newFiles;
        });
      }
    });

    xhr.addEventListener('error', () => {
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[fileIndex].status = 'error';
        newFiles[fileIndex].errorMessage = 'Terjadi kesalahan jaringan';
        onFilesChange(newFiles);
        return newFiles;
      });
    });

    const API_HOST = process.env.NEXT_PUBLIC_API_URL || "";
    xhr.open('POST', `${API_HOST}/api/v1/temp-upload`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');

    // Get CSRF Token
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      xhr.setRequestHeader('X-XSRF-TOKEN', csrfToken);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(formData);
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFilesArray = Array.from(selectedFiles);
    
    setFiles(prev => {
      // Check total files
      if (prev.length + newFilesArray.length > maxFiles) {
        alert(`Maksimal ${maxFiles} file yang diizinkan.`);
        return prev;
      }

      const startIndex = prev.length;
      const initialNewFiles = newFilesArray.map(f => ({
        originalFile: f,
        progress: 0,
        status: 'uploading' as const
      }));
      
      const combined = [...prev, ...initialNewFiles];
      
      // Start upload for new files
      newFilesArray.forEach((f, idx) => {
        triggerUpload(f, startIndex + idx);
      });
      
      onFilesChange(combined);
      return combined;
    });
    
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newArr = prev.filter((_, i) => i !== index);
      onFilesChange(newArr);
      return newArr;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">Max {maxFiles} files (Optional)</span>
      </div>
      
      {files.length < maxFiles && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            isDragging 
              ? 'border-[#8474f9] bg-[#8474f9]/10' 
              : 'border-[#e5e7eb] bg-[#f9fafb] hover:border-[#8474f9] hover:bg-[#8474f9]/5'
          }`}
        >
          <MaterialIcon name="upload_file" size="auto" className="mb-3 text-[32px] text-[#8474f9]" />
          <span className="mb-2 font-medium text-gray-700">Klik atau seret file ke sini</span>
          <span className="text-xs text-gray-400">{description}</span>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#8474f9]/10 text-[#8474f9]">
                <MaterialIcon name="description" size="auto" className="text-[24px]" />
              </div>
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-gray-800" title={file.originalFile.name}>
                    {file.originalFile.name}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => removeFile(idx)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <MaterialIcon name="close" size="auto" className="text-[16px]" />
                  </button>
                </div>
                {file.status === 'uploading' && (
                  <div className="flex flex-col gap-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div 
                        className="h-full bg-[#8474f9] transition-all duration-300" 
                        style={{ width: `${file.progress}%` }} 
                      />
                    </div>
                    <span className="text-xs text-gray-500">Mengunggah... {file.progress}%</span>
                  </div>
                )}
                {file.status === 'success' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <MaterialIcon name="check_circle" size="auto" className="text-[14px]" />
                    Selesai
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="text-xs text-red-500">{file.errorMessage}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
