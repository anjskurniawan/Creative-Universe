"use client";

import { useEffect, useState } from "react";
import { getOddsSystemRules, updateOddsSystemRule, createOddsSystemRule } from "../api";
import type { OddsSystemRule } from "../api";
import { MaterialIcon } from "@/components/material-icon";

export function ScheduleConfig() {
  const [rules, setRules] = useState<OddsSystemRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [capacityId, setCapacityId] = useState<number | null>(null);
  const [capacity, setCapacity] = useState({
    monday: 420, tuesday: 420, wednesday: 420, thursday: 420, friday: 420, saturday: 420, sunday: 0
  });

  const [calendarId, setCalendarId] = useState<number | null>(null);
  const [holidays, setHolidays] = useState<string[]>([]);
  
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    try {
      const res = await getOddsSystemRules();
      setRules(res);
      
      const capRule = res.find(r => r.key === 'global_daily_capacity');
      if (capRule && capRule.value) {
        setCapacityId(capRule.id);
        setCapacity(capRule.value as typeof capacity);
      }
      
      const calRule = res.find(r => r.key === 'holiday_calendar');
      if (calRule && calRule.value && Array.isArray((calRule.value as any).dates)) {
        setCalendarId(calRule.id);
        setHolidays((calRule.value as any).dates);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveCapacity = async () => {
    setSaving(true);
    try {
      const payload = {
        key: 'global_daily_capacity',
        value: capacity,
        description: 'Kapasitas maksimal harian desainer (dalam menit).',
        is_active: true
      };
      
      if (capacityId) {
        await updateOddsSystemRule(capacityId, payload);
      } else {
        const res = await createOddsSystemRule(payload);
        setCapacityId(res.id);
      }
      alert("Jadwal kapasitas berhasil disimpan.");
    } catch (e) {
      alert("Gagal menyimpan kapasitas.");
    } finally {
      setSaving(false);
    }
  };

  const saveHolidays = async (newHolidays: string[]) => {
    try {
      const payload = {
        key: 'holiday_calendar',
        value: { dates: newHolidays },
        description: 'Daftar tanggal libur (YYYY-MM-DD).',
        is_active: true
      };
      
      if (calendarId) {
        await updateOddsSystemRule(calendarId, payload);
      } else {
        const res = await createOddsSystemRule(payload);
        setCalendarId(res.id);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan kalender libur.");
    }
  };

  const toggleHoliday = (dateStr: string) => {
    const newHolidays = holidays.includes(dateStr)
      ? holidays.filter(d => d !== dateStr)
      : [...holidays, dateStr];
    setHolidays(newHolidays);
    saveHolidays(newHolidays); // Auto-save for calendar clicks
  };

  const generateCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // adjust first day so Monday is 0
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    const grid = [];
    let currentDay = 1;
    
    for (let row = 0; row < 6; row++) {
      const week = [];
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < startOffset) {
          week.push(null);
        } else if (currentDay <= daysInMonth) {
          week.push(new Date(year, month, currentDay));
          currentDay++;
        } else {
          week.push(null);
        }
      }
      grid.push(week);
      if (currentDay > daysInMonth) break;
    }
    return grid;
  };

  const changeMonth = (offset: number) => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + offset);
    setCurrentMonth(next);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
      {/* Schedule Panel */}
      <div className="rounded-xl border border-cu-border bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="bg-slate-50 px-4 py-3 border-b border-cu-border flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-cu-border text-cu-info">
            <MaterialIcon name="schedule" size="sm" />
          </div>
          <h2 className="font-semibold text-cu-ink">Daily Schedule SLA</h2>
        </div>
        <div className="p-4 flex-1 space-y-4">
          <p className="text-sm text-slate-500">
            Tentukan batas kapasitas harian (SLA) dalam satuan menit. 
            Jika batas tercapai, sistem akan menandai desainer "Full Load Today".
          </p>
          <div className="space-y-2">
            {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(day => (
              <div key={day} className="flex items-center justify-between">
                <label className="text-sm font-medium capitalize w-24">{day}</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={capacity[day]} 
                    onChange={e => setCapacity({...capacity, [day]: Number(e.target.value)})}
                    className="w-24 rounded border border-cu-border px-2 py-1 text-sm outline-none focus:border-cu-info"
                  />
                  <span className="text-xs text-slate-400">mnt</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-cu-border bg-slate-50 p-4">
          <button 
            onClick={saveCapacity}
            disabled={saving}
            className="w-full rounded-md bg-cu-info px-4 py-2 text-sm font-medium text-white hover:bg-cu-info/90 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Jadwal"}
          </button>
        </div>
      </div>

      {/* Calendar Panel */}
      <div className="rounded-xl border border-cu-border bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="bg-slate-50 px-4 py-3 border-b border-cu-border flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-cu-border text-cu-info">
            <MaterialIcon name="event" size="sm" />
          </div>
          <h2 className="font-semibold text-cu-ink">Holiday Calendar</h2>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-1">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-md">
                <MaterialIcon name="chevron_left" />
              </button>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-md">
                <MaterialIcon name="chevron_right" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(d => (
              <div key={d} className="text-xs font-semibold text-slate-500 py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarGrid().map((week, i) => (
              week.map((date, j) => {
                if (!date) return <div key={`empty-${i}-${j}`} className="aspect-square" />;
                
                // Note: date.getMonth is 0-indexed.
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const isHoliday = holidays.includes(dateStr);
                const isSunday = date.getDay() === 0;
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => toggleHoliday(dateStr)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-md text-sm transition-colors ${
                      isHoliday
                        ? "bg-red-50 text-red-600 border border-red-200 font-bold"
                        : isSunday
                        ? "text-red-400 bg-slate-50 hover:bg-slate-100"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{date.getDate()}</span>
                    {isHoliday && <span className="text-[10px] uppercase mt-0.5 tracking-tighter">Libur</span>}
                  </button>
                );
              })
            ))}
          </div>
          <div className="mt-6 text-sm text-slate-500">
            * Klik tanggal untuk menandai atau menghapus hari libur. Hari Minggu secara default akan ditandai dengan angka merah, tetapi agar sistem menghitung estimasi libur, sebaiknya klik juga tanggal Minggunya jika memang tidak ada jam kerja (atau biarkan jika setelan kapasitas Minggu adalah 0).
            Perhitungan selesai akan otomatis melompati (skip) tanggal yang diberi kotak "Libur".
          </div>
        </div>
      </div>
    </div>
  );
}
