"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOddsTickets, OddsTicket } from "@/lib/odds";
import { MaterialIcon } from "@/components/material-icon";

export default function ODDSDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<OddsTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getOddsTickets();
        setTickets(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data tiket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cu-ink">ODDS Dashboard</h1>
          <p className="text-cu-ink-light mt-1">One Dashboard Design System</p>
        </div>
        <Link href="/odds/new" className="bg-cu-info text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
          <MaterialIcon name="add" size="sm" />
          Buat Request
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-cu-info border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-cu-danger/10 text-cu-danger p-4 rounded-lg">
          {error}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-20 bg-white border border-cu-border rounded-xl shadow-sm">
          <MaterialIcon name="inbox" size="xl" className="text-cu-ink-light mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-cu-ink">Belum ada request desain</h3>
          <p className="text-cu-ink-light mt-2">Buat tiket baru untuk mulai proses desain.</p>
        </div>
      ) : (
        <div className="bg-white border border-cu-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cu-surface border-b border-cu-border">
                  <th className="p-4 font-medium text-cu-ink">No. Tiket</th>
                  <th className="p-4 font-medium text-cu-ink">Tujuan Desain</th>
                  <th className="p-4 font-medium text-cu-ink">Kategori</th>
                  <th className="p-4 font-medium text-cu-ink">Requester</th>
                  <th className="p-4 font-medium text-cu-ink">Designer</th>
                  <th className="p-4 font-medium text-cu-ink">Status</th>
                  <th className="p-4 font-medium text-cu-ink">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cu-border">
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="hover:bg-cu-surface/50 transition cursor-pointer"
                    onClick={() => router.push(`/odds/detail?id=${ticket.id}`)}
                  >
                    <td className="p-4 font-medium">{ticket.ticket_number}</td>
                    <td className="p-4 text-cu-ink-light">{ticket.design_purpose}</td>
                    <td className="p-4">
                      <span className="bg-cu-surface px-2 py-1 rounded text-sm text-cu-ink-light border border-cu-border">
                        {ticket.category?.name || '-'}
                      </span>
                    </td>
                    <td className="p-4 text-cu-ink-light">{ticket.requester?.name}</td>
                    <td className="p-4 text-cu-ink-light">{ticket.assignedDesigner?.name || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-cu-surface border border-cu-border`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-cu-ink-light">
                      {new Date(ticket.deadline).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
