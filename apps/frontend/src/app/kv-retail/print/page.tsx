"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toBlob } from "html-to-image";
import { MaterialIcon } from "@/components/material-icon";
import { kvRetailApi, type KvRetailTask } from "@/features/kv-retail/api";
import { TaskPrintPreview } from "@/features/kv-retail/components/task-print-preview";

export default function KvRetailPrintPage() {
  const searchParams = useSearchParams();
  const [task, setTask] = useState<KvRetailTask | null>(null);
  const [creativeAgentContent, setCreativeAgentContent] = useState<string | null>(null);
  const [isCreativeAgentGenerating, setIsCreativeAgentGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const taskId = searchParams.get("task");

  useEffect(() => {
    if (!taskId) return;
    void kvRetailApi.tasks.list().then((tasks) => {
      const found = tasks.find((item) => String(item.id) === taskId);
      if (!found) setError("Task tidak ditemukan.");
      else setTask(found);
    }).catch(() => setError("Preview task tidak dapat dimuat."));
  }, [taskId]);

  useEffect(() => {
    if (!task?.id) return;

    void kvRetailApi.tasks.creativeAgentSuggestion(task.id)
      .then((suggestion) => {
        setCreativeAgentContent(suggestion.generated ? suggestion.content : null);
      })
      .catch(() => undefined);
  }, [task?.id]);

  const message = !taskId ? "Task tidak ditemukan." : error;
  const downloadPreview = async () => {
    if (!previewRef.current || !task || isDownloading) return;
    setIsDownloading(true);
    try {
      const image = await toBlob(previewRef.current, { backgroundColor: "#ffffff", cacheBust: true, pixelRatio: 2, skipFonts: true, width: 403, height: 632 });
      if (!image) throw new Error("Gambar preview tidak tersedia.");
      const name = (task.task_name || "task-kv-retail").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(image);
      link.download = `${name || "task-kv-retail"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (downloadError) {
      console.error("Gagal mengunduh preview task:", downloadError);
      alert("Gambar preview belum dapat dibuat.");
    } finally {
      setIsDownloading(false);
    }
  };

  const generateCreativeAgent = async () => {
    if (!task || isCreativeAgentGenerating) return;
    setIsCreativeAgentGenerating(true);
    try {
      const suggestion = await kvRetailApi.tasks.generateCreativeAgentSuggestion(task.id);
      setCreativeAgentContent(suggestion.content);
    } catch (generateError) {
      console.error("Gagal membuat saran Creative Agent:", generateError);
      alert("Creative Agent belum dapat membuat saran.");
    } finally {
      setIsCreativeAgentGenerating(false);
    }
  };

  return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#202020] p-8">{message ? <p className="rounded-lg bg-white px-4 py-3 text-sm text-[#b91c1c]">{message}</p> : task ? <><div ref={previewRef}><TaskPrintPreview task={task} creativeAgentContent={creativeAgentContent} isCreativeAgentGenerating={isCreativeAgentGenerating} /></div><div className="flex items-center gap-2"><button type="button" onClick={() => void downloadPreview()} disabled={isDownloading || isCreativeAgentGenerating} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#2f2f2f] disabled:opacity-60"><MaterialIcon name={isDownloading ? "progress_activity" : "download"} size="auto" className={isDownloading ? "animate-spin text-lg" : "text-lg"} />{isDownloading ? "Menyiapkan gambar…" : "Unduh PNG"}</button><button type="button" onClick={() => void generateCreativeAgent()} disabled={isCreativeAgentGenerating} className="inline-flex items-center gap-2 rounded-lg bg-[#6931f1] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><MaterialIcon name={isCreativeAgentGenerating ? "progress_activity" : "auto_awesome"} size="auto" className={isCreativeAgentGenerating ? "animate-spin text-lg" : "text-lg"} />{isCreativeAgentGenerating ? "Generating…" : "Generate Agent"}</button></div></> : <p className="text-sm text-white">Memuat preview task…</p>}</main>;
}
