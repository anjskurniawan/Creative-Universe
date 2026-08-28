import { useState } from "react";
import { apiFetch } from "@/core/api/client";

export function useConsole(onSuccess?: () => void) {
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState("[SYS] Konsol siap menerima output perintah.");
  const [active, setActive] = useState<string | null>(null);

  const run = async (commandKey: string, label: string) => {
    if (executing) return;
    setExecuting(true);
    setActive(commandKey);
    setOutput(`[SYS] Menjalankan perintah: ${label}...\n[SYS] Silakan tunggu...`);

    try {
      const res = await apiFetch<{ command: string; output: string }>("/maintenance/commands", {
        method: "POST",
        body: JSON.stringify({ command: commandKey }),
      });

      setOutput(res.output || `[SYS] Perintah '${commandKey}' berhasil diselesaikan tanpa output.`);
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: `Perintah '${label}' berhasil dieksekusi.`,
          },
        })
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Gagal mengeksekusi perintah.";
      setOutput(`[ERR] Gagal mengeksekusi perintah:\n${errMsg}`);
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: errMsg,
          },
        })
      );
    } finally {
      setExecuting(false);
      setActive(null);
    }
  };

  const clear = () => setOutput("Console dibersihkan.");

  return { executing, output, active, run, clear };
}
