import React, { useState, useRef, useEffect } from "react";
import { MaterialIcon } from "./material-icon";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS_IN_WEEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Helper to get days in month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get first day of month (0 = Sunday, 1 = Monday...)
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Helper to format YYYY-MM-DD to DD/MM/YYYY
function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  className = "",
  required = false
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view date based on value or current date
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDate = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Calculate grid cells
  const gridCells = [];
  // Empty cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    gridCells.push(<div key={`empty-${i}`} className="size-8" />);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected =
      value &&
      new Date(value).getFullYear() === viewYear &&
      new Date(value).getMonth() === viewMonth &&
      new Date(value).getDate() === d;
      
    const isToday =
      new Date().getFullYear() === viewYear &&
      new Date().getMonth() === viewMonth &&
      new Date().getDate() === d;

    gridCells.push(
      <button
        key={`day-${d}`}
        type="button"
        onClick={(e) => { e.stopPropagation(); selectDate(d); }}
        className={`size-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
          isSelected
            ? "bg-[#8474f9] text-white shadow-md"
            : isToday
            ? "bg-[#f0efff] text-[#8474f9] hover:bg-[#e4e1ff]"
            : "text-[#222] hover:bg-gray-100"
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className={`min-h-[52px] cursor-pointer flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 outline-none transition-all ${
          isOpen
            ? "bg-white border-[#8474f9] ring-4 ring-[#8474f9]/10"
            : "bg-gray-50/50 border-transparent hover:bg-gray-50 hover:border-gray-200"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-base tracking-[0.32px] ${value ? "text-[#222]" : "text-[#aeb6b8]"}`}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        
        {/* Hidden native input for required validation */}
        {required && (
           <input type="text" value={value} readOnly className="absolute opacity-0 w-1 h-1 -z-10" required />
        )}
        
        <MaterialIcon
          name="calendar_today"
          size="auto"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aeb6b8] text-[20px] pointer-events-none"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 w-[280px] p-4 rounded-2xl border border-[#e5e7eb] bg-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="size-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <MaterialIcon name="chevron_left" size="auto" className="text-[20px]" />
            </button>
            <div className="font-semibold text-[#111827]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="size-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <MaterialIcon name="chevron_right" size="auto" className="text-[20px]" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {DAYS_IN_WEEK.map((day) => (
              <div key={day} className="text-xs font-semibold text-gray-400 w-8">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {gridCells}
          </div>
        </div>
      )}
    </div>
  );
}
