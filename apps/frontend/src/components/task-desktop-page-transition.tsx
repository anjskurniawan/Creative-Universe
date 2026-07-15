"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

type TaskDesktopPageTransitionProps = {
  children: ReactNode;
  className?: string;
};

export function TaskDesktopPageTransition({ children, className = "" }: TaskDesktopPageTransitionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const overlay = document.querySelector<HTMLElement>("[data-task-route-overlay]");
    if (overlay) {
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.48,
        ease: "power1.out",
        onComplete: () => overlay.remove(),
      });
    }
  }, [pathname]);

  useEffect(() => {
    const onTaskLinkClick = (event: MouseEvent) => {
      if (window.innerWidth < 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="/kv-retail"]');
      const href = anchor?.getAttribute("href");
      if (!anchor || anchor.target === "_blank" || !href || href === pathname || document.querySelector("[data-task-route-overlay]")) return;

      const contentRect = containerRef.current?.getBoundingClientRect();
      if (!contentRect) return;

      event.preventDefault();
      const overlay = document.createElement("div");
      overlay.dataset.taskRouteOverlay = "true";
      Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        right: "0",
        bottom: "0",
        left: `${contentRect.left}px`,
        zIndex: "9999",
        background: "#f6faff",
        opacity: "0",
        pointerEvents: "all",
      });
      document.body.appendChild(overlay);
      gsap.to(overlay, {
        opacity: 0.16,
        duration: 0.34,
        ease: "power1.inOut",
        onComplete: () => router.push(href),
      });
    };

    document.addEventListener("click", onTaskLinkClick, true);
    return () => document.removeEventListener("click", onTaskLinkClick, true);
  }, [pathname, router]);

  return <main ref={containerRef} className={className}>{children}</main>;
}
