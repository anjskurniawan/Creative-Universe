"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOddsTicket, getOddsCategories } from "@/lib/odds";
import { MaterialIcon } from "@/components/material-icon";

export default function CreateTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    design_purpose: "",
    category_id: "",
    deadline: "",
    brand: "",
    channel: "",
    important_matrix: "Quadrant 2",
    target_audience: "",
    key_message: "",
    description: "",
    required_outputs: [] as string[],
    references: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getOddsCategories();
        setCategories(data);
      } catch (err) {
        console.error("Gagal memuat kategori", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOutputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const outputsArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData((prev) => ({ ...prev, required_outputs: outputsArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createOddsTicket(formData);
      router.push("/odds");
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const errMsgs = Object.values(err.errors).flat().join(", ");
        setError(errMsgs);
      } else {
        setError(err.message || "Gagal membuat tiket.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/odds" className="w-10 h-10 rounded-full flex items-center justify-center bg-cu-surface hover:bg-cu-surface-hover transition border border-cu-border">
          <MaterialIcon name="arrow_back" size="sm" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-cu-ink">Buat Request Desain</h1>
          <p className="text-cu-ink-light mt-1">Isi detail kebutuhan desain Anda</p>
        </div>
      </div>

      <div className="bg-white border border-cu-border rounded-xl shadow-sm p-6 md:p-8">
        {error && (
          <div className="mb-6 bg-cu-danger/10 text-cu-danger p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Tujuan Desain (Nama Request)*</label>
              <input
                required
                type="text"
                name="design_purpose"
                value={formData.design_purpose}
                onChange={handleChange}
                placeholder="Cth: Feed Instagram Promo Merdeka"
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Kategori Desain*</label>
              <select
                required
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info bg-white"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Deadline (opsional)</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Brand*</label>
              <input
                required
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Cth: JETE"
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Channel/Platform*</label>
              <input
                required
                type="text"
                name="channel"
                value={formData.channel}
                onChange={handleChange}
                placeholder="Cth: Instagram, Website"
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Matriks Prioritas*</label>
              <select
                required
                name="important_matrix"
                value={formData.important_matrix}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info bg-white"
              >
                <option value="Quadrant 1">Q1 (Penting & Mendesak)</option>
                <option value="Quadrant 2">Q2 (Penting & Tidak Mendesak)</option>
                <option value="Quadrant 3">Q3 (Tidak Penting & Mendesak)</option>
                <option value="Quadrant 4">Q4 (Tidak Penting & Tidak Mendesak)</option>
              </select>
            </div>
          </div>

          <hr className="border-cu-border my-6" />
          <h3 className="text-lg font-semibold text-cu-ink mb-4">Detail Brief</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Target Audiens*</label>
              <input
                required
                type="text"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                placeholder="Cth: Milenial, Gamers, Wanita 18-25 tahun"
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Pesan Utama (Key Message)*</label>
              <input
                required
                type="text"
                name="key_message"
                value={formData.key_message}
                onChange={handleChange}
                placeholder="Cth: Promo diskon hingga 50% untuk produk TWS"
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Deskripsi Detail*</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Ceritakan secara detail bagaimana visual yang Anda harapkan..."
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Output yang Dibutuhkan* (pisahkan koma)</label>
              <input
                required
                type="text"
                onChange={handleOutputsChange}
                placeholder="Cth: 1 Feed IG, 1 Story IG, 1 Banner Website"
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-cu-ink text-sm">Referensi Visual (Link opsional)</label>
              <input
                type="url"
                name="references"
                value={formData.references}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-cu-border rounded-lg focus:outline-none focus:border-cu-info"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-cu-info text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <MaterialIcon name="send" size="sm" />
                  Kirim Request & Analisis Brief AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
