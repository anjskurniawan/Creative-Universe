"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/material-icon";
import { useAuth } from "@/providers/auth-provider";

const AGENT_OPTIONS = [
  { value: "storyboard",  label: "Storyboard Writer",  icon: "movie_edit" },
  { value: "thumbnail",   label: "Youtube Thumbnail",  icon: "image" },
  { value: "copywriting", label: "Copywriting",         icon: "edit_note" },
] as const;

type AgentType = (typeof AGENT_OPTIONS)[number]["value"];

export default function AIAgentPage() {
  const { user } = useAuth();
  const userName = user?.name || "Sobat CU";
  const newTypewriterText = `Hi, ${userName} what can i help u ?`;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textTargetRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [agentType, setAgentType] = useState<AgentType>("storyboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showNewText, setShowNewText] = useState(false);

  /* Mark client-side mounted (needed for portal) */
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  /* Toggle body class on focus to style navbar dark mode elements */
  useEffect(() => {
    if (isFocused) {
      document.body.classList.add("ai-agent-dark-active");
    } else {
      document.body.classList.remove("ai-agent-dark-active");
    }
    return () => {
      document.body.classList.remove("ai-agent-dark-active");
    };
  }, [isFocused]);

  /* Compute trigger position whenever dropdown opens */
  useEffect(() => {
    if (!dropdownOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.top + window.scrollY,   // above trigger: will subtract panel height via CSS
      right: window.innerWidth - rect.right,
    });
  }, [dropdownOpen]);

  const selectedAgent = AGENT_OPTIONS.find((o) => o.value === agentType)!;

  /* Close dropdown on outside click — portal panel is outside dropdownRef so check trigger too */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = triggerRef.current?.contains(target);
      const inDropdownWrapper = dropdownRef.current?.contains(target);
      if (!inTrigger && !inDropdownWrapper) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const typewriterText = "AI Agent akan segera hadir";

  // Trigger typewriter and background color updates on focus
  useEffect(() => {
    let active = true;

    if (isFocused) {
      const timer = setTimeout(() => {
        if (!active) return;
        
        // 1. Cinematic fade out the old title
        gsap.to(titleRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.95,
          filter: "blur(10px)",
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            if (!active) return;
            setShowNewText(true);
            
            // 2. Cinematic reset position and fade in
            gsap.set(titleRef.current, { y: 20, scale: 1.05, filter: "blur(10px)" });
            gsap.to(titleRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "power3.out",
            });

            // 3. Typewrite the new text
            const characters = Array.from(newTypewriterText);
            const progress = { count: 0 };
            
            if (textTargetRef.current) {
              textTargetRef.current.textContent = "";
              gsap.killTweensOf(textTargetRef.current);
            }
            if (cursorRef.current) {
              gsap.killTweensOf(cursorRef.current);
              gsap.set(cursorRef.current, { opacity: 1 });
              gsap.to(cursorRef.current, {
                opacity: 0.2,
                duration: 0.55,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
              });
            }

            gsap.to(progress, {
              count: characters.length,
              duration: Math.max(1.5, characters.length * 0.05),
              ease: "none",
              onUpdate: () => {
                if (textTargetRef.current) {
                  textTargetRef.current.textContent = characters.slice(0, Math.round(progress.count)).join("");
                }
              },
              onComplete: () => {
                if (textTargetRef.current) {
                  textTargetRef.current.textContent = newTypewriterText;
                }
                gsap.delayedCall(1.2, () => {
                  if (cursorRef.current) {
                    gsap.killTweensOf(cursorRef.current);
                    gsap.to(cursorRef.current, {
                      opacity: 0,
                      duration: 0.25,
                      ease: "power1.out",
                    });
                  }
                });
              }
            });
          }
        });
      }, 1000);

      return () => {
        active = false;
        clearTimeout(timer);
      };
    } else {
      if (!showNewText) return; // Only trigger if we were showing the new text
      
      // Cinematic fade out and return to the initial text
      gsap.to(titleRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        filter: "blur(10px)",
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          if (!active) return;
          setShowNewText(false);
          
          // Cinematic reset position and fade in
          gsap.set(titleRef.current, { y: 20, scale: 1.05, filter: "blur(10px)" });
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          });

          const characters = Array.from(typewriterText);
          const progress = { count: 0 };
          
          if (textTargetRef.current) {
            textTargetRef.current.textContent = "";
            gsap.killTweensOf(textTargetRef.current);
          }
          if (cursorRef.current) {
            gsap.killTweensOf(cursorRef.current);
            gsap.set(cursorRef.current, { opacity: 1 });
            gsap.to(cursorRef.current, {
              opacity: 0.2,
              duration: 0.55,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
            });
          }

          gsap.to(progress, {
            count: characters.length,
            duration: Math.max(1.5, characters.length * 0.05),
            ease: "none",
            onUpdate: () => {
              if (textTargetRef.current) {
                textTargetRef.current.textContent = characters.slice(0, Math.round(progress.count)).join("");
              }
            },
            onComplete: () => {
              if (textTargetRef.current) {
                textTargetRef.current.textContent = typewriterText;
              }
              gsap.delayedCall(1.2, () => {
                if (cursorRef.current) {
                  gsap.killTweensOf(cursorRef.current);
                  gsap.to(cursorRef.current, {
                    opacity: 0,
                    duration: 0.25,
                    ease: "power1.out",
                  });
                }
              });
            }
          });
        }
      });

      return () => {
        active = false;
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, newTypewriterText]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hero = canvas.closest("[data-interactive-hero]") as HTMLElement;
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      canvas.style.display = "none";
      if (textTargetRef.current) {
        textTargetRef.current.textContent = typewriterText;
      }
      return;
    }

    const textTarget = textTargetRef.current;
    const cursor = cursorRef.current;
    const chatbox = chatboxRef.current;

    const tweens = new Set<gsap.core.Tween | gsap.core.Timeline>();

    if (textTarget && cursor) {
      const splitCharacters = (text: string) => {
        if ("Segmenter" in Intl) {
          const segmenter = new Intl.Segmenter("id", { granularity: "grapheme" });
          return Array.from(segmenter.segment(text), ({ segment }) => segment);
        }
        return Array.from(text);
      };

      const characters = splitCharacters(typewriterText);
      const progress = { count: 0 };

      textTarget.textContent = "";
      gsap.set(cursor, { opacity: 1 });

      if (chatbox) {
        gsap.set(chatbox, {
          opacity: 0,
          filter: "blur(8px)",
          y: 20,
        });
      }

      const blink = gsap.to(cursor, {
        opacity: 0.2,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      tweens.add(blink);

      const typewriterTween = gsap.to(progress, {
        count: characters.length,
        duration: Math.max(2.0, characters.length * 0.08),
        ease: "none",
        onUpdate: () => {
          if (!isFocused && !showNewText) {
            textTarget.textContent = characters.slice(0, Math.round(progress.count)).join("");
          }
        },
        onComplete: () => {
          if (!isFocused && !showNewText) {
            textTarget.textContent = typewriterText;
          }

          if (chatbox) {
            const chatboxFade = gsap.to(chatbox, {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 1.2,
              ease: "power2.out",
            });
            tweens.add(chatboxFade);
          }

          const cursorFadeDelay = gsap.delayedCall(1.5, () => {
            blink.kill();
            gsap.to(cursor, {
              opacity: 0,
              duration: 0.25,
              ease: "power1.out",
            });
          });
          tweens.add(cursorFadeDelay);
        },
      });
      tweens.add(typewriterTween);
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      canvas.style.display = "none";
      return () => {
        tweens.forEach((t) => t.kill());
      };
    }

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    // Get 2D context
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    // Define colors from variables
    const getCssColor = (prop: string, fallback: string) => {
      if (typeof window === "undefined") return fallback;
      return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
    };

    const colorStart = getCssColor("--color-cu-gradient-start", "#d946ef");
    const colorMiddle = getCssColor("--color-cu-gradient-middle", "#3b82f6");
    const colorEnd = getCssColor("--color-cu-gradient-end", "#22d3ee");

    // Convert hex to rgba helper
    const hexToRgba = (hex: string, alpha: number) => {
      const cleanHex = hex.replace("#", "");
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Blobs setup
    const blobs = [
      {
        x: 0.15,
        y: 0.25,
        radius: isMobile ? 0.5 : 0.45,
        colorStart: hexToRgba(colorStart, 0.25),
        colorEnd: hexToRgba(colorStart, 0),
      },
      {
        x: 0.85,
        y: 0.35,
        radius: isMobile ? 0.6 : 0.55,
        colorStart: hexToRgba(colorEnd, 0.22),
        colorEnd: hexToRgba(colorEnd, 0),
      },
      {
        x: 0.5,
        y: 0.75,
        radius: isMobile ? 0.7 : 0.65,
        colorStart: hexToRgba(colorMiddle, 0.2),
        colorEnd: hexToRgba(colorMiddle, 0),
      },
      {
        x: 0.3,
        y: 0.65,
        radius: isMobile ? 0.45 : 0.4,
        colorStart: hexToRgba(colorStart, 0.18),
        colorEnd: hexToRgba(colorStart, 0),
      },
    ];

    // Interactive pointer blob
    const pointerBlob = {
      x: 0.5,
      y: 0.5,
      radius: isMobile ? 0.35 : 0.3,
      colorStart: hexToRgba(colorEnd, 0.25),
      colorEnd: hexToRgba(colorEnd, 0),
      active: 0,
    };

    // Resize handler
    let width = 0;
    let height = 0;
    const updateSize = () => {
      const bounds = hero.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width || window.innerWidth));
      height = Math.max(1, Math.round(bounds.height || window.innerHeight));
      canvas.width = width * Math.min(window.devicePixelRatio, 2);
      canvas.height = height * Math.min(window.devicePixelRatio, 2);
      ctx2d.resetTransform();
      ctx2d.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };

    updateSize();

    // GSAP animations for the floating blobs
    blobs.forEach((blob, idx) => {
      // Float x
      const tx = gsap.to(blob, {
        x: idx % 2 === 0 ? 0.85 : 0.15,
        duration: 15 + idx * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      tweens.add(tx);

      // Float y
      const ty = gsap.to(blob, {
        y: idx % 2 === 0 ? 0.15 : 0.85,
        duration: 18 + idx * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      tweens.add(ty);

      // Float radius
      const tr = gsap.to(blob, {
        radius: blob.radius * 1.35,
        duration: 12 + idx * 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      tweens.add(tr);
    });

    // Pointer move handlers
    const pointerX = gsap.quickTo(pointerBlob, "x", { duration: 1.2, ease: "power3.out" });
    const pointerY = gsap.quickTo(pointerBlob, "y", { duration: 1.2, ease: "power3.out" });
    const pointerActive = gsap.quickTo(pointerBlob, "active", { duration: 1.5, ease: "power2.out" });

    const handlePointerMove = (event: PointerEvent) => {
      if (!hasFinePointer) return;
      const bounds = hero.getBoundingClientRect();
      pointerX((event.clientX - bounds.left) / bounds.width);
      pointerY((event.clientY - bounds.top) / bounds.height);
      pointerActive(1);
    };

    const handlePointerLeave = () => {
      pointerActive(0);
    };

    // Render loop
    const renderAurora = () => {
      ctx2d.clearRect(0, 0, width, height);

      // We can set globalCompositeOperation to 'screen' or 'lighter' for beautiful blending
      ctx2d.globalCompositeOperation = "screen";

      // Draw all blobs
      const drawBlob = (b: typeof blobs[0] & { active?: number }) => {
        const px = b.x * width;
        const py = b.y * height;
        const pr = b.radius * Math.max(width, height);

        // Skip drawing if out of bounds or zero radius
        if (pr <= 0) return;

        const grad = ctx2d.createRadialGradient(px, py, 0, px, py, pr);
        
        // Handle transparency transition if active is defined
        let cStart = b.colorStart;
        if (b.active !== undefined) {
          cStart = hexToRgba(colorEnd, b.active * 0.25);
        }

        grad.addColorStop(0, cStart);
        grad.addColorStop(1, b.colorEnd);

        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, width, height);
      };

      blobs.forEach((b) => drawBlob(b));

      if (pointerBlob.active > 0.001) {
        drawBlob(pointerBlob);
      }
    };

    gsap.ticker.add(renderAurora);

    window.addEventListener("resize", updateSize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      tweens.forEach((t) => t.kill());
      gsap.ticker.remove(renderAurora);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newTypewriterText]);

  return (
    <div
      data-interactive-hero
      className="relative isolate flex flex-1 flex-col overflow-hidden w-full h-full min-h-screen transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: isFocused ? "#000000" : "#ffffff" }}
    >
      {/* Keyframe for custom dropdown animation and global navbar dark override styles */}
      <style>{`
        @keyframes cu-dropdown-in {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        /* Smooth transitions for navbar elements */
        nav, 
        nav a, 
        nav button,
        nav svg,
        nav .text-cu-ink,
        nav span {
          transition: color 1000ms ease-in-out, background-color 1000ms ease-in-out, border-color 1000ms ease-in-out, shadow 1000ms ease-in-out, box-shadow 1000ms ease-in-out !important;
        }
        .ai-agent-dark-active nav {
          color: #ffffff !important;
        }
        .ai-agent-dark-active nav a, 
        .ai-agent-dark-active nav button,
        .ai-agent-dark-active nav svg,
        .ai-agent-dark-active nav .text-cu-ink,
        .ai-agent-dark-active nav span {
          color: #ffffff !important;
        }
        .ai-agent-dark-active nav button:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
        }
        .ai-agent-dark-active nav .border-cu-line {
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>

      <canvas
        ref={canvasRef}
        data-particle-canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 size-full"
      />

      {/* White overlays (fade out when focused) */}
      <div 
        aria-hidden="true" 
        className="cu-landing-readability pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out" 
        style={{ opacity: isFocused ? 0 : 1 }}
      />
      <div 
        aria-hidden="true" 
        className="cu-landing-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 transition-opacity duration-1000 ease-in-out" 
        style={{ opacity: isFocused ? 0 : 1 }}
      />

      {/* Black overlays (fade in when focused) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out" 
        style={{ 
          opacity: isFocused ? 1 : 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)"
        }}
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 transition-opacity duration-1000 ease-in-out" 
        style={{ 
          opacity: isFocused ? 1 : 0,
          background: "linear-gradient(to top, #000000, transparent)"
        }}
      />

      <main className="relative z-20 flex flex-1 items-center justify-center px-6 py-10">
        <section
          aria-labelledby="subapp-title"
          className="mx-auto w-full max-w-2xl text-center flex flex-col items-center gap-8"
        >
          {/* Typewriter Title — ukuran diperkecil agar proporsional dengan chatbox */}
          <h1
            ref={titleRef}
            id="subapp-title"
            aria-label={showNewText ? newTypewriterText : typewriterText}
            data-typewriter={showNewText ? newTypewriterText : typewriterText}
            className="text-center text-xl sm:text-2xl md:text-3xl font-medium leading-snug tracking-tight w-full block break-words"
          >
            <span
              ref={textTargetRef}
              data-typewriter-text
              className={showNewText ? "bg-gradient-to-r from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end bg-clip-text text-transparent" : "text-cu-ink"}
            >
              {typewriterText}
            </span>
            <span
              ref={cursorRef}
              aria-hidden="true"
              data-typewriter-cursor
              className="ml-1.5 inline-block h-5 w-0.5 bg-gradient-to-b from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end align-middle opacity-0 sm:h-6 md:h-7"
            />
            <noscript>{showNewText ? newTypewriterText : typewriterText}</noscript>
          </h1>

          {/* Chatbox — Gemini-style */}
          <div
            ref={chatboxRef}
            className="w-full"
            style={{ opacity: 0, filter: "blur(8px)", transform: "translateY(20px)" }}
          >
            <div className={`relative w-full rounded-2xl border transition-all duration-1000 ease-in-out shadow-2xl bg-white ${
              isFocused ? "border-transparent" : "border-cu-line"
            }`}>
              {/* Input row */}
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-t-2xl">
                {/* Plus button */}
                <button
                  type="button"
                  aria-label="Lampirkan"
                  title="Segera hadir"
                  className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cu-ink/5 text-cu-ink/60 transition hover:bg-cu-ink/10 active:scale-95"
                >
                  <MaterialIcon name="add" size="sm" />
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Tanya AI Agent…"
                  className="flex-1 bg-transparent text-sm text-cu-ink placeholder:text-cu-ink/40 outline-none"
                  aria-label="Input pesan AI Agent"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                {/* Right controls */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {/* Agent type — custom dropdown */}
                  <div ref={dropdownRef} className="hidden sm:block relative">
                    {/* Trigger button */}
                    <button
                      ref={triggerRef}
                      type="button"
                      onClick={() => setDropdownOpen((v) => !v)}
                      aria-haspopup="listbox"
                      aria-expanded={dropdownOpen}
                      aria-label="Pilih tipe AI Agent"
                      className={`
                        flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium
                        transition-all duration-200
                        ${
                          dropdownOpen
                            ? "bg-cu-ink/15 text-cu-ink font-semibold"
                            : "bg-cu-ink/5 text-cu-ink/70 hover:bg-cu-ink/10 hover:text-cu-ink/90"
                        }
                      `}
                    >
                      <MaterialIcon name={selectedAgent.icon} size="xs" className="opacity-70" />
                      <span>{selectedAgent.label}</span>
                      <MaterialIcon
                        name="keyboard_arrow_down"
                        size="xs"
                        className={`opacity-60 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown panel — rendered via Portal to escape stacking context */}
                    {mounted && dropdownOpen && createPortal(
                      <div
                        role="listbox"
                        aria-label="Tipe AI Agent"
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                          position: "fixed",
                          top: dropdownPos.top - 8,
                          right: dropdownPos.right,
                          transform: "translateY(-100%)",
                          zIndex: 9999,
                          animation: "cu-dropdown-in 0.15s ease-out both",
                        }}
                        className="
                          w-48 rounded-xl overflow-hidden
                          border border-cu-line
                          bg-white
                          shadow-2xl
                        "
                      >
                        {AGENT_OPTIONS.map((opt) => {
                          const isActive = opt.value === agentType;
                          return (
                            <button
                              key={opt.value}
                              role="option"
                              aria-selected={isActive}
                              type="button"
                              onClick={() => {
                                setAgentType(opt.value);
                                setDropdownOpen(false);
                              }}
                              className={`
                                w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left
                                transition-colors duration-150
                                ${
                                  isActive
                                    ? "bg-cu-panel-soft text-cu-ink font-semibold"
                                    : "text-cu-ink/70 hover:bg-cu-panel-soft hover:text-cu-ink"
                                }
                              `}
                            >
                              <MaterialIcon
                                name={opt.icon}
                                size="xs"
                                className={isActive ? "opacity-90" : "opacity-50"}
                              />
                              {opt.label}
                              {isActive && (
                                <MaterialIcon
                                  name="check"
                                  size="xs"
                                  className="ml-auto opacity-80"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>,
                      document.body
                    )}
                  </div>

                  {/* Mic / send button */}
                  <button
                    type="button"
                    aria-label="Kirim pesan"
                    title="Segera hadir"
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cu-ink/5 text-cu-ink/60 transition hover:bg-cu-ink/10 active:scale-95"
                  >
                    <MaterialIcon name="mic" size="sm" />
                  </button>
                </div>
              </div>

              {/* Coming soon strip */}
              <div className="border-t border-cu-line transition-colors duration-1000 ease-in-out px-4 py-2 flex items-center justify-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cu-gradient-start animate-pulse" />
                <p className="text-[11px] text-cu-ink/40 select-none">
                  Fitur ini sedang dalam pengembangan
                </p>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cu-gradient-end animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
