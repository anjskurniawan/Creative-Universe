"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { ToastContainer, ToastQueue } from "@react-spectrum/s2/Toast";

export type TaskFeedbackToastStatus = "loading" | "success" | "error";

export type TaskFeedbackToastState = {
  status: TaskFeedbackToastStatus;
  message: string;
} | null;

const TASK_FEEDBACK_EVENT = "odds:task-feedback";

export function publishTaskFeedbackToast(toast: Exclude<TaskFeedbackToastState, null>): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<TaskFeedbackToastState>(TASK_FEEDBACK_EVENT, { detail: toast }));
}

export function TaskFeedbackToast({ toast, onClose }: { toast: TaskFeedbackToastState; onClose: () => void }) {
  const status = toast?.status;
  const message = toast?.message;
  const notifyClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!status || !message) return;

    let active = true;
    const options = {
      timeout: status === "loading" ? undefined : 5000,
      onClose: () => { if (active) notifyClose(); },
    };
    const close = status === "success"
      ? ToastQueue.positive(message, options)
      : status === "error"
        ? ToastQueue.negative(message, options)
        : ToastQueue.info(message, options);

    return () => {
      // Replacing a toast must not clear the newer feedback in its owner.
      active = false;
      close();
    };
  }, [status, message]);

  return null;
}

export function TaskFeedbackToastHost() {
  const [toast, setToast] = useState<TaskFeedbackToastState>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      setToast((event as CustomEvent<TaskFeedbackToastState>).detail);
    };
    window.addEventListener(TASK_FEEDBACK_EVENT, handleToast);
    return () => window.removeEventListener(TASK_FEEDBACK_EVENT, handleToast);
  }, []);

  return <>
    <ToastContainer placement="bottom end" />
    <TaskFeedbackToast toast={toast} onClose={() => setToast(null)} />
  </>;
}
