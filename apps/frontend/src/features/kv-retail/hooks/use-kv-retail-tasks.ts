"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { kvRetailApi } from "../api";
import type { KvRetailTask } from "../types";

type TaskUpdater = (task: KvRetailTask) => KvRetailTask;

export function useKvRetailTasks() {
  const [tasks, setTasks] = useState<KvRetailTask[]>([]);
  const requestSequence = useRef(0);
  const stateEpoch = useRef(0);
  const versions = useRef(new Map<number, number>());
  const pending = useRef(new Map<number, symbol>());

  const refresh = useCallback(async () => {
    const sequence = ++requestSequence.current;
    const epoch = stateEpoch.current;
    const data = await kvRetailApi.tasks.list();
    if (sequence !== requestSequence.current || epoch !== stateEpoch.current) return;
    stateEpoch.current += 1;
    setTasks(data);
    data.forEach((task) => versions.current.set(task.id, (versions.current.get(task.id) ?? 0) + 1));
  }, []);

  const merge = useCallback((incoming: KvRetailTask) => {
    stateEpoch.current += 1;
    versions.current.set(incoming.id, (versions.current.get(incoming.id) ?? 0) + 1);
    setTasks((current) => {
      const exists = current.some((task) => task.id === incoming.id);
      return exists
        ? current.map((task) => task.id === incoming.id ? incoming : task)
        : [...current, incoming];
    });
  }, []);

  const mutate = useCallback(async (
    taskId: number,
    optimistic: TaskUpdater,
    request: () => Promise<KvRetailTask>,
  ): Promise<KvRetailTask | null> => {
    if (pending.current.has(taskId)) return null;
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return null;

    const token = Symbol(String(taskId));
    pending.current.set(taskId, token);
    const optimisticVersion = (versions.current.get(taskId) ?? 0) + 1;
    stateEpoch.current += 1;
    versions.current.set(taskId, optimisticVersion);
    setTasks((current) => current.map((item) => item.id === taskId ? optimistic(item) : item));

    try {
      const saved = await request();
      if (pending.current.get(taskId) === token) merge(saved);
      return saved;
    } catch (error) {
      // Jangan menimpa event realtime atau mutation lebih baru dengan snapshot lama.
      if (pending.current.get(taskId) === token && versions.current.get(taskId) === optimisticVersion) {
        versions.current.set(taskId, optimisticVersion + 1);
        stateEpoch.current += 1;
        setTasks((current) => current.map((item) => item.id === taskId ? task : item));
      }
      throw error;
    } finally {
      if (pending.current.get(taskId) === token) pending.current.delete(taskId);
    }
  }, [merge, tasks]);

  const remove = useCallback((taskId: number) => {
    stateEpoch.current += 1;
    versions.current.delete(taskId);
    pending.current.delete(taskId);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }, []);

  useEffect(() => {
    void refresh().catch((error) => console.error("Gagal memuat tugas KV Retail:", error));
  }, [refresh]);

  return { tasks, refresh, merge, mutate, remove };
}
