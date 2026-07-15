"use client";

import React, { useState, useRef, useEffect } from "react";
import { MaterialIcon } from "./material-icon";
import { CustomDatePicker } from "./custom-date-picker";
import FileUploadDropzone, { UploadedFile } from './file-upload-dropzone';
import { coreApi } from "@/core/api";
import { kvRetailApi } from "@/features/kv-retail/api";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UserOption {
  id: number;
  name: string;
}

export function TaskFormModal({ isOpen, onClose }: TaskFormModalProps) {
  const [taskGivenDate, setTaskGivenDate] = useState("");
  const [taskName, setTaskName] = useState("");
  const [picVendor, setPicVendor] = useState("");
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const vendorDropdownRef = useRef<HTMLDivElement>(null);
  
  // Multi-select state
  const [assignedTo, setAssignedTo] = useState<UserOption[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [usersList, setUsersList] = useState<UserOption[]>([]);
  
  const [supportFiles, setSupportFiles] = useState<UploadedFile[]>([]);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [draftFiles, setDraftFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch users and settings on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await kvRetailApi.assignees<UserOption[]>();
        setUsersList(res);
      } catch (err) {
        console.error("Gagal memuat daftar user", err);
      }

      try {
        const settings = await coreApi.settings.get<{ vendor_options?: string }>(['vendor_options']);
        if (settings && settings.vendor_options) {
          const vendors = settings.vendor_options.split(",").map((v: string) => v.trim()).filter(Boolean);
          setVendorOptions(vendors.length > 0 ? vendors : ["Mireco", "Fushion"]);
        } else {
          setVendorOptions(["Mireco", "Fushion"]);
        }
      } catch (err) {
        console.error("Gagal memuat vendor options", err);
        setVendorOptions(["Mireco", "Fushion"]);
      }
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(event.target as Node)) {
        setIsVendorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) &&
      !assignedTo.find(u => u.id === user.id)
  );

  const handleToggleUser = (user: UserOption) => {
    if (assignedTo.find(u => u.id === user.id)) {
      setAssignedTo(prev => prev.filter(u => u.id !== user.id));
    } else {
      setAssignedTo(prev => [...prev, user]);
      setSearchUser("");
    }
  };

  const removeUser = (e: React.MouseEvent, userId: number) => {
    e.stopPropagation();
    setAssignedTo(prev => prev.filter(u => u.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskGivenDate || !taskName || !picVendor || assignedTo.length === 0 || !deadlineDate) {
      alert("Harap lengkapi semua field yang diwajibkan.");
      return;
    }
    const isUploading = supportFiles.some(f => f.status === 'uploading') || draftFiles.some(f => f.status === 'uploading');
    if (isUploading) {
      alert("Harap tunggu hingga proses upload selesai.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("task_given_date", taskGivenDate);
      formData.append("task_name", taskName);
      formData.append("pic_vendor", picVendor);
      formData.append("deadline_date", deadlineDate);
      assignedTo.forEach(user => {
        formData.append("assigned_to[]", String(user.id));
      });
      
      // Append temporary paths
      supportFiles.forEach(f => {
        if (f.status === 'success' && f.tempPath) {
          formData.append("support_file[]", f.tempPath);
        }
      });
      draftFiles.forEach(f => {
        if (f.status === 'success' && f.tempPath) {
          formData.append("draft_file[]", f.tempPath);
        }
      });

      await kvRetailApi.tasks.create(formData);

      alert("Tugas berhasil disubmit!");
      // Reset form
      setTaskGivenDate("");
      setTaskName("");
      setPicVendor("");
      setAssignedTo([]);
      setSupportFiles([]);
      setDeadlineDate("");
      setDraftFiles([]);
      
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal submit tugas. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl bg-gray-50/50 border border-transparent px-4 py-3 text-base tracking-[0.32px] text-[#222] outline-none placeholder:text-[#aeb6b8] focus:bg-white focus:border-[#8474f9] focus:ring-4 focus:ring-[#8474f9]/10 transition-all hover:bg-gray-50 hover:border-gray-200";
  const labelClass = "mb-2 block text-sm font-medium text-[#4b5563]";

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-gray-900/40 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="relative flex min-h-dvh max-h-dvh w-full max-w-2xl flex-col overflow-hidden rounded-none bg-white p-0 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] sm:min-h-0 sm:max-h-[90vh] sm:rounded-3xl sm:p-4">
        <div 
          className="h-full w-full overflow-y-auto p-4 custom-scrollbar sm:rounded-2xl sm:p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#111827]">Tambah Tugas Baru</h2>
            <button
              onClick={onClose}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-800"
            >
              <MaterialIcon name="close" size="auto" className="text-[20px]" />
            </button>
          </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* 1. Tanggal tugas diberikan */}
          <div>
            <label className={labelClass}>Tanggal tugas diberikan <span className="text-[#ea4c89]">*</span></label>
            <CustomDatePicker
              value={taskGivenDate}
              onChange={setTaskGivenDate}
              placeholder="Pilih tanggal tugas..."
              required
            />
          </div>

          {/* 2. Nama Tugas */}
          <div>
            <label className={labelClass}>Nama Tugas <span className="text-[#ea4c89]">*</span></label>
            <input
              type="text"
              placeholder="Masukkan nama tugas..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* 3. Pic Vendor */}
          <div>
            <label className={labelClass}>PIC Vendor <span className="text-[#ea4c89]">*</span></label>
            <div className="relative" ref={vendorDropdownRef}>
              <div 
                className={`min-h-[52px] cursor-pointer flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 outline-none transition-all ${isVendorDropdownOpen ? "bg-white border-[#8474f9] ring-4 ring-[#8474f9]/10" : "bg-gray-50/50 border-transparent hover:bg-gray-50 hover:border-gray-200"}`}
                onClick={() => setIsVendorDropdownOpen(!isVendorDropdownOpen)}
              >
                <span className={`text-base tracking-[0.32px] ${picVendor ? "text-[#222]" : "text-[#aeb6b8]"}`}>
                  {picVendor || "Pilih vendor..."}
                </span>
                <MaterialIcon 
                  name={isVendorDropdownOpen ? "expand_less" : "expand_more"} 
                  size="auto" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aeb6b8] text-[24px] pointer-events-none transition-transform" 
                />
              </div>

              {/* Dropdown Menu */}
              {isVendorDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-48 overflow-y-auto rounded-xl border border-[#e5e7eb] bg-white shadow-lg custom-scrollbar">
                  {vendorOptions.map((vendor) => (
                    <div
                      key={vendor}
                      onClick={() => {
                        setPicVendor(vendor);
                        setIsVendorDropdownOpen(false);
                      }}
                      className="cursor-pointer px-4 py-3 text-base text-[#222] transition-colors hover:bg-[#f6faff]"
                    >
                      {vendor}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. Assigned to */}
          <div ref={dropdownRef} className="relative">
            <label className={labelClass}>Assigned to <span className="text-[#ea4c89]">*</span></label>
            <div 
              className={`min-h-[52px] cursor-text flex flex-wrap items-center gap-2 rounded-xl border px-4 py-2 outline-none transition-all ${isDropdownOpen ? "bg-white border-[#8474f9] ring-4 ring-[#8474f9]/10" : "bg-gray-50/50 border-transparent hover:bg-gray-50 hover:border-gray-200"}`}
              onClick={() => setIsDropdownOpen(true)}
            >
              {assignedTo.map(user => (
                <div key={user.id} className="flex items-center gap-1.5 rounded-lg bg-[#f0efff] px-3 py-1.5 text-sm font-medium text-[#8474f9]">
                  {user.name}
                  <button type="button" onClick={(e) => removeUser(e, user.id)} className="hover:text-red-500 transition-colors">
                    <MaterialIcon name="close" size="auto" className="text-[16px]" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder={assignedTo.length === 0 ? "Cari nama..." : ""}
                value={searchUser}
                onChange={(e) => {
                  setSearchUser(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-base placeholder:text-[#aeb6b8]"
              />
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="pr-2 flex items-center justify-center outline-none"
              >
                <MaterialIcon 
                  name={isDropdownOpen ? "expand_less" : "expand_more"} 
                  size="auto" 
                  className="text-[#aeb6b8] text-[24px] transition-transform" 
                />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-48 overflow-y-auto rounded-xl border border-[#e5e7eb] bg-white shadow-lg custom-scrollbar">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleToggleUser(user)}
                      className="cursor-pointer px-4 py-3 text-base text-[#222] transition-colors hover:bg-[#f6faff]"
                    >
                      {user.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-base text-gray-500">Tidak ada hasil ditemukan.</div>
                )}
              </div>
            )}
          </div>

          {/* 5. Upload File Pendukung */}
          <FileUploadDropzone 
            label="Upload File Pendukung"
            description="PDF, DOC, XLSX, JPG, PNG up to 10MB"
            maxFiles={3}
            onFilesChange={setSupportFiles}
          />

          {/* 6. Deadline Tugas diberikan */}
          <div>
            <label className={labelClass}>Deadline Tugas diberikan <span className="text-[#ea4c89]">*</span></label>
            <CustomDatePicker
              value={deadlineDate}
              onChange={setDeadlineDate}
              placeholder="Pilih tenggat waktu..."
              required
            />
          </div>

          {/* 7. Upload Draft */}
          <FileUploadDropzone 
            label="Upload Draft"
            description="Desain awal atau coretan draft up to 10MB"
            maxFiles={3}
            onFilesChange={setDraftFiles}
          />

          {/* Keterangan & Submit */}
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
            <span className="text-xs font-medium text-gray-400">Tanda <span className="text-[#ea4c89]">*</span> wajib diisi</span>
            <button
              type="submit"
              disabled={isSubmitting || supportFiles.some(f => f.status === 'uploading') || draftFiles.some(f => f.status === 'uploading')}
              className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#8474f9] px-4 text-base font-semibold text-white transition-all hover:bg-[#6c5bfa] focus:ring-4 focus:ring-[#8474f9]/20 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_8px_20px_-6px_rgba(132,116,249,0.5)]"
            >
              {isSubmitting ? (
                <>
                  <MaterialIcon name="sync" className="animate-spin text-[24px]" size="auto" />
                  Menyimpan...
                </>
              ) : (
                "Submit Tugas"
              )}
            </button>
          </div>

        </form>
        </div>
      </div>
    </div>
  );
}
