"use client";

import React, { useState, useRef, useEffect } from "react";
import { MaterialIcon } from "./material-icon";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { apiFetch } from "@/lib/api";

interface UserOption {
  id: number;
  name: string;
}

export function TaskFormModal({ isOpen, onClose }: TaskFormModalProps) {
  const [taskGivenDate, setTaskGivenDate] = useState("");
  const [taskName, setTaskName] = useState("");
  const [picVendor, setPicVendor] = useState<"Mireco" | "Fushion" | "">("");
  
  // Multi-select state
  const [assignedTo, setAssignedTo] = useState<UserOption[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [usersList, setUsersList] = useState<UserOption[]>([]);
  
  const [supportFile, setSupportFile] = useState<File | null>(null);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [draftFile, setDraftFile] = useState<File | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch users on mount
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await apiFetch<any>('/users?per_page=50');
        if (Array.isArray(res)) setUsersList(res);
        else if (res && Array.isArray(res.data)) setUsersList(res.data);
      } catch (err) {
        console.error("Gagal memuat daftar user", err);
      }
    }
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    } else {
      setter(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskGivenDate || !taskName || !picVendor || assignedTo.length === 0 || !deadlineDate) {
      alert("Harap lengkapi semua field yang diwajibkan.");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("task_given_date", taskGivenDate);
      formData.append("task_name", taskName);
      formData.append("pic_vendor", picVendor);
      formData.append("deadline_date", deadlineDate);
      assignedTo.forEach(user => {
        formData.append("assigned_to[]", String(user.id));
      });
      if (supportFile) formData.append("support_file", supportFile);
      if (draftFile) formData.append("draft_file", draftFile);

      await apiFetch('/homework-tasks', {
        method: 'POST',
        body: formData,
      });

      alert("Tugas berhasil disubmit!");
      // Reset form
      setTaskGivenDate("");
      setTaskName("");
      setPicVendor("");
      setAssignedTo([]);
      setSupportFile(null);
      setDeadlineDate("");
      setDraftFile(null);
      
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal submit tugas. Silakan coba lagi.");
    }
  };

  const inputClass = "w-full rounded-xl border border-[#d7dcdd] bg-white px-4 py-3 text-base tracking-[0.32px] text-[#222] outline-none placeholder:text-[#aeb6b8] focus:border-[#8474f9] focus:ring-2 focus:ring-[#8474f9]/15 transition-all";
  const labelClass = "mb-2 block text-sm font-semibold text-[#525e61]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl custom-scrollbar"
        style={{ scrollbarWidth: "thin" }}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
        >
          <MaterialIcon name="close" size="auto" className="text-[24px]" />
        </button>

        <h2 className="mb-8 text-2xl font-bold tracking-tight text-[#222]">Tambah Tugas Baru</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* 1. Tanggal tugas diberikan */}
          <div>
            <label className={labelClass}>Tanggal tugas diberikan</label>
            <div className="relative">
              <input
                type="date"
                value={taskGivenDate}
                onChange={(e) => setTaskGivenDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* 2. Nama Tugas */}
          <div>
            <label className={labelClass}>Nama Tugas</label>
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
            <label className={labelClass}>PIC Vendor</label>
            <div className="flex gap-4">
              {(["Mireco", "Fushion"] as const).map((vendor) => (
                <button
                  key={vendor}
                  type="button"
                  onClick={() => setPicVendor(vendor)}
                  className={`flex-1 rounded-xl border py-3 text-base font-semibold transition-all ${
                    picVendor === vendor
                      ? "border-[#8474f9] bg-[#8474f9] text-white shadow-md"
                      : "border-[#d7dcdd] bg-white text-[#525e61] hover:border-[#8474f9] hover:bg-gray-50"
                  }`}
                >
                  {vendor}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Assigned to */}
          <div ref={dropdownRef} className="relative">
            <label className={labelClass}>Assigned to</label>
            <div 
              className={`min-h-[52px] cursor-text flex flex-wrap items-center gap-2 rounded-xl border border-[#d7dcdd] bg-white p-2 outline-none transition-all ${isDropdownOpen ? "border-[#8474f9] ring-2 ring-[#8474f9]/15" : ""}`}
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
          <div>
            <label className={labelClass}>Upload File Pendukung</label>
            <div className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-[#d7dcdd] bg-gray-50 px-6 py-8 transition-colors hover:border-[#8474f9] hover:bg-[#f6faff]">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setSupportFile)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                <MaterialIcon name="upload_file" size="auto" className="text-[32px] text-[#8474f9]" />
                <p className="text-base font-medium text-[#525e61]">
                  {supportFile ? supportFile.name : "Klik atau seret file ke sini"}
                </p>
                {!supportFile && <p className="text-sm text-gray-400">PDF, DOC, XLSX, JPG, PNG up to 10MB</p>}
              </div>
            </div>
          </div>

          {/* 6. Deadline Tugas diberikan */}
          <div>
            <label className={labelClass}>Deadline Tugas diberikan</label>
            <input
              type="date"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* 7. Upload Draft */}
          <div>
            <label className={labelClass}>Upload Draft</label>
            <div className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-[#d7dcdd] bg-gray-50 px-6 py-8 transition-colors hover:border-[#8474f9] hover:bg-[#f6faff]">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setDraftFile)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                <MaterialIcon name="upload_file" size="auto" className="text-[32px] text-[#8474f9]" />
                <p className="text-base font-medium text-[#525e61]">
                  {draftFile ? draftFile.name : "Klik atau seret file ke sini"}
                </p>
                {!draftFile && <p className="text-sm text-gray-400">Desain awal atau coretan draft</p>}
              </div>
            </div>
          </div>

          {/* Keterangan & Submit */}
          <div className="mt-4 border-t border-[#e5e7eb] pt-6">
            <p className="mb-4 text-center text-sm font-medium text-amber-600 bg-amber-50 py-2 rounded-lg">
              <MaterialIcon name="info" size="auto" className="inline-block mr-1 text-[16px] align-text-bottom" />
              Pastikan semua informasi sudah benar sebelum submit
            </p>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#ec4899] py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-[#db2777] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#ec4899]/30"
            >
              Submit Tugas
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
