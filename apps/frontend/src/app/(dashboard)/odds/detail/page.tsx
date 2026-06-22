"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOddsTicket, OddsTicket } from "@/lib/odds";
import { MaterialIcon } from "@/components/material-icon";

function TicketDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [ticket, setTicket] = useState<OddsTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!id) throw new Error("ID Tiket tidak ditemukan.");
        const data = await getOddsTicket(id);
        setTicket(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat detail tiket.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
    else setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-cu-info border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="bg-cu-danger/10 text-cu-danger p-4 rounded-lg flex items-center gap-2">
          <MaterialIcon name="error" size="sm" />
          {error || "Tiket tidak ditemukan."}
        </div>
        <Link href="/odds" className="mt-4 inline-block text-cu-info hover:underline">
          &larr; Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/odds" className="w-10 h-10 rounded-full flex items-center justify-center bg-cu-surface hover:bg-cu-surface-hover transition border border-cu-border">
          <MaterialIcon name="arrow_back" size="sm" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-cu-ink flex items-center gap-3">
            {ticket.design_purpose}
            <span className="px-3 py-1 bg-cu-info/10 text-cu-info text-sm rounded-full font-medium">
              {ticket.ticket_number}
            </span>
          </h1>
          <p className="text-cu-ink-light mt-1 flex gap-2 items-center">
            <MaterialIcon name="person" size="xs" /> {ticket.requester?.name} &bull; 
            <span className="text-cu-warning font-medium">{ticket.status}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-cu-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-cu-ink mb-4 border-b border-cu-border pb-2">Creative Brief</h3>
            
            {ticket.brief ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-cu-ink-light uppercase tracking-wider">Target Audiens</h4>
                  <p className="mt-1 text-cu-ink">{ticket.brief.target_audience}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-cu-ink-light uppercase tracking-wider">Pesan Utama</h4>
                  <p className="mt-1 text-cu-ink">{ticket.brief.key_message}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-cu-ink-light uppercase tracking-wider">Deskripsi Detail</h4>
                  <p className="mt-1 text-cu-ink whitespace-pre-wrap">{ticket.brief.description}</p>
                </div>
                {ticket.brief.references && (
                  <div>
                    <h4 className="text-sm font-medium text-cu-ink-light uppercase tracking-wider">Referensi</h4>
                    <a href={ticket.brief.references} target="_blank" rel="noreferrer" className="mt-1 text-cu-info hover:underline break-all">
                      {ticket.brief.references}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-cu-ink-light italic">Brief tidak tersedia.</p>
            )}
          </div>

          {/* AI Analysis Result */}
          {ticket.brief?.ai_summary && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 text-purple-700">
                <MaterialIcon name="auto_awesome" size="sm" />
                <h3 className="text-lg font-semibold">AI Creative Analysis</h3>
              </div>
              <div className="prose prose-sm max-w-none text-cu-ink">
                {ticket.brief.ai_summary.split('\n').map((line: string, i: number) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-cu-border rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-cu-ink mb-4 border-b border-cu-border pb-2">Informasi Tiket</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-cu-ink-light">Kategori</span>
                <span className="font-medium text-right">{ticket.category?.name || '-'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-cu-ink-light">Deadline</span>
                <span className="font-medium text-right">
                  {ticket.deadline ? new Date(ticket.deadline).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-cu-ink-light">Prioritas</span>
                <span className="font-medium text-right uppercase">{ticket.important_matrix}</span>
              </div>
              <div className="flex justify-between items-start pt-3 border-t border-cu-border border-dashed">
                <span className="text-cu-ink-light">Desainer</span>
                <span className="font-medium text-right">{ticket.assignedDesigner?.name || 'Belum Ditugaskan'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketDetailPage() {
  return (
    <Suspense fallback={<div className="p-10">Memuat detail tiket...</div>}>
      <TicketDetailContent />
    </Suspense>
  );
}
