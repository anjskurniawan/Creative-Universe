"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/material-icon";
import { useAuth } from "@/providers/auth-provider";
import { apiFetch } from "@/lib/api";

const AGENT_OPTIONS = [
  { value: "storyboard",  label: "Storyboard Writer",  icon: "movie_edit" },
  { value: "thumbnail",   label: "Youtube Thumbnail",  icon: "image" },
  { value: "copywriting", label: "Copywriting",         icon: "edit_note" },
] as const;

type AgentType = (typeof AGENT_OPTIONS)[number]["value"];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentType?: AgentType;
  timestamp: string;
}

// Suggested prompts removed in favor of dropdown selection

export default function AIAgentPage() {
  const { user } = useAuth();
  const userName = user?.name || "Sobat CU";
  const newTypewriterText = `Hi, ${userName} what can i help u ?`;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textTargetRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [agentType, setAgentType] = useState<AgentType>("storyboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showNewText, setShowNewText] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messageCounterRef = useRef(0);

  /* Mark client-side mounted (needed for portal) */
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  /* Scroll to bottom when messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* Toggle body class on focus to style navbar dark mode elements */
  useEffect(() => {
    if (isFocused || messages.length > 0) {
      document.body.classList.add("ai-agent-dark-active");
    } else {
      document.body.classList.remove("ai-agent-dark-active");
    }
    return () => {
      document.body.classList.remove("ai-agent-dark-active");
    };
  }, [isFocused, messages.length]);

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

  /* Close dropdown on outside click */
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

  const typewriterText = "AI Agent siap membantu Anda";

  // Trigger typewriter and background color updates on focus
  useEffect(() => {
    let active = true;

    // If chat has started, we don't run typewriter animations
    if (messages.length > 0) return;

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
  }, [isFocused, newTypewriterText, messages.length]);

  // Initial particles and aurora drawing
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

    // Initial setup (only if no messages exist yet)
    if (messages.length === 0 && textTarget && cursor) {
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
    } else if (messages.length > 0 && chatbox) {
      // Immediate load chatbox if chat started
      gsap.set(chatbox, { opacity: 1, filter: "blur(0px)", y: 0 });
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

      // screen composite operation for blending
      ctx2d.globalCompositeOperation = "screen";

      // Draw all blobs
      const drawBlob = (b: typeof blobs[0] & { active?: number }) => {
        const px = b.x * width;
        const py = b.y * height;
        const pr = b.radius * Math.max(width, height);

        if (pr <= 0) return;

        const grad = ctx2d.createRadialGradient(px, py, 0, px, py, pr);
        
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
  }, [newTypewriterText, messages.length]);

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend !== undefined ? textToSend : inputValue;
    if (!messageText.trim()) return;

    // Add user message
    messageCounterRef.current += 1;
    const userMsg: Message = {
      id: `msg-${messageCounterRef.current}-user`,
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    const currentHistory = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsFocused(false);
    setIsTyping(true);

    // Call backend Google Gemini API integration
    apiFetch<{ content: string }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message: messageText.trim(),
        agent_type: agentType,
        history: currentHistory.slice(0, -1).map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    })
      .then((data) => {
        messageCounterRef.current += 1;
        const assistantMsg: Message = {
          id: `msg-${messageCounterRef.current}-assistant`,
          role: "assistant",
          content: data.content,
          agentType: agentType,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      })
      .catch((error) => {
        setIsTyping(false);
        messageCounterRef.current += 1;
        const errorMsg: Message = {
          id: `msg-${messageCounterRef.current}-assistant`,
          role: "assistant",
          content: `### ❌ Gagal Menghubungi Asisten AI\n\nTerjadi kesalahan saat memproses permintaan Anda: **${error?.message || "Kesalahan jaringan"}**.\n\nSilakan coba lagi beberapa saat lagi.`,
          agentType: agentType,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, errorMsg]);
      });
  };

  const handleResetChat = () => {
    if (window.confirm("Apakah Anda ingin menghapus seluruh riwayat percakapan?")) {
      setMessages([]);
    }
  };

  return (
    <div
      data-interactive-hero
      className="relative isolate flex flex-col overflow-hidden w-full h-screen max-h-screen transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: isFocused || messages.length > 0 ? "#09090b" : "#ffffff" }}
    >
      {/* CSS overrides for global elements and scrollbar styling */}
      <style>{`
        @keyframes cu-dropdown-in {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* Custom scrollbar for Chat history window */
        .chat-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 99px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.35);
        }
      `}</style>

      <canvas
        ref={canvasRef}
        data-particle-canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 size-full"
      />

      {/* Light overlays (fade out when focused or active chat) */}
      <div 
        aria-hidden="true" 
        className="cu-landing-readability pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out" 
        style={{ opacity: isFocused || messages.length > 0 ? 0 : 1 }}
      />
      <div 
        aria-hidden="true" 
        className="cu-landing-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 transition-opacity duration-1000 ease-in-out" 
        style={{ opacity: isFocused || messages.length > 0 ? 0 : 1 }}
      />

      {/* Dark overlays (fade in when focused or active chat) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out" 
        style={{ 
          opacity: isFocused || messages.length > 0 ? 1 : 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)"
        }}
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 transition-opacity duration-1000 ease-in-out" 
        style={{ 
          opacity: isFocused || messages.length > 0 ? 1 : 0,
          background: "linear-gradient(to top, #09090b, transparent)"
        }}
      />

      <main className={`relative z-20 flex transition-all duration-700 ease-in-out ${
        messages.length > 0
          ? "flex-1 flex-col w-full h-full max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 min-h-0"
          : "flex-1 items-center justify-center px-4 sm:px-6 py-6 md:py-10"
      }`}>
        
        {/* Central Content Column */}
        <div 
          className={`w-full flex flex-col transition-all duration-700 ease-in-out ${
            messages.length > 0 ? "flex-1 min-h-0" : "mx-auto w-full max-w-2xl text-center flex flex-col items-center gap-8"
          }`}
        >
          
          {/* Animated Title */}
          <div
            style={{
              transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), margin 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: messages.length > 0 ? 0 : 1,
              maxHeight: messages.length > 0 ? "0px" : "120px",
              marginBottom: messages.length > 0 ? "0px" : "1.5rem",
              overflow: "hidden",
              pointerEvents: messages.length > 0 ? "none" : "auto",
            }}
            className="w-full text-center flex flex-col items-center"
          >
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
            </h1>
          </div>

          {/* Chat History Area: Shows when chat started */}
          {messages.length > 0 && (
            <section className="flex-1 flex flex-col min-h-0 w-full overflow-hidden mt-20 mb-6">
              {/* Messages Scrollbox */}
              <div className="flex-1 overflow-y-auto chat-scrollbar pr-2 space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  const agent = msg.agentType ? AGENT_OPTIONS.find((o) => o.value === msg.agentType) : null;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 max-w-[85%] ${
                        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {/* Avatar Bubble */}
                      <div
                        className={`flex items-center justify-center size-8 rounded-full flex-shrink-0 text-white font-bold text-xs ${
                          isUser
                            ? "bg-cu-danger"
                            : "bg-white/10 border border-white/10"
                        }`}
                      >
                        {isUser ? (
                          userName.slice(0, 2).toUpperCase()
                        ) : (
                          <MaterialIcon name={agent?.icon || "smart_toy"} size="xs" className="text-white" />
                        )}
                      </div>

                      {/* Message Card */}
                      <div className="flex flex-col gap-1">
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isUser
                              ? "bg-white text-black rounded-tr-none"
                              : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none whitespace-pre-line"
                          }`}
                        >
                          {/* Format Markdown Simulation (bold lines / lists) */}
                          {isUser ? (
                            msg.content
                          ) : (
                            <SimpleMarkdown content={msg.content} />
                          )}
                        </div>
                        <span
                          className={`text-[9px] text-white/40 ${
                            isUser ? "text-right" : "text-left"
                          }`}
                        >
                          {isUser ? "Anda" : agent?.label || "AI Agent"} · {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3 max-w-[80%] mr-auto">
                    <div className="flex items-center justify-center size-8 rounded-full bg-white/10 border border-white/10 text-white flex-shrink-0">
                      <MaterialIcon name={selectedAgent.icon} size="xs" className="animate-spin" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-white/50 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </section>
          )}

          {/* Input Box Area */}
          <section
            ref={chatboxRef}
            className="w-full flex flex-col gap-4"
            style={messages.length === 0 ? { opacity: 0, filter: "blur(8px)", transform: "translateY(20px)" } : {}}
          >
            {/* Gemini-Style Chatbox */}
            <div className={`relative w-full rounded-2xl border transition-all duration-300 shadow-xl bg-white ${
              isFocused || messages.length > 0 ? "border-white/15" : "border-cu-line"
            }`}>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-t-2xl">
                {/* Reset / Paperclip icon (Functional Reset for UI) */}
                <button
                  type="button"
                  onClick={handleResetChat}
                  disabled={messages.length === 0}
                  aria-label="Kosongkan obrolan"
                  title="Mulai obrolan baru"
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-95 ${
                    messages.length > 0
                      ? "bg-cu-danger/10 text-cu-danger hover:bg-cu-danger/25"
                      : "bg-cu-ink/5 text-cu-ink/30 cursor-not-allowed"
                  }`}
                >
                  <MaterialIcon name="refresh" size="sm" />
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Tanya ${selectedAgent.label}…`}
                  className="flex-1 bg-transparent text-sm text-cu-ink placeholder:text-cu-ink/40 outline-none"
                  aria-label="Input pesan AI Agent"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                {/* Right controls */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {/* Agent type — custom dropdown (hidden per request) */}
                  <div ref={dropdownRef} className="hidden relative">
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
                      <span className="hidden sm:inline">{selectedAgent.label}</span>
                      <MaterialIcon
                        name="keyboard_arrow_down"
                        size="xs"
                        className={`opacity-60 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown panel panel — rendered via Portal */}
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

                  {/* Send button */}
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    aria-label="Kirim pesan"
                    className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-95 ${
                      inputValue.trim()
                        ? "bg-gradient-to-tr from-cu-gradient-start via-cu-gradient-middle to-cu-gradient-end text-white hover:shadow-lg"
                        : "bg-cu-ink/5 text-cu-ink/40 hover:bg-cu-ink/10"
                    }`}
                  >
                    <MaterialIcon name="send" size="sm" />
                  </button>
                </div>
              </div>

              {/* Coming soon strip */}
              <div
                style={{
                  transition: "opacity 0.5s ease-out, max-height 0.5s ease-out, border-color 0.5s ease-out",
                  opacity: messages.length > 0 ? 0 : 1,
                  maxHeight: messages.length > 0 ? "0px" : "50px",
                  overflow: "hidden",
                }}
                className={`border-t transition-colors duration-1000 ease-in-out px-4 py-2 flex items-center justify-center gap-2 ${
                  messages.length > 0 ? "border-transparent" : "border-cu-line"
                }`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cu-gradient-start animate-pulse" />
                <p className="text-[11px] text-cu-ink/40 select-none">
                  Fitur ini sedang dalam pengembangan
                </p>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cu-gradient-end animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function parseInlineCode(text: string, keyPrefix: string): React.ReactNode[] {
  const codeParts = text.split(/(`.*?`)/g);
  return codeParts.map((part, cIdx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-code-${cIdx}`}
          className="px-1.5 py-0.5 rounded bg-black/40 text-xs font-mono text-cu-danger/90 border border-white/5 mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.flatMap((part, bIdx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return parseInlineCode(boldText, `bold-${bIdx}`);
    }
    return parseInlineCode(part, `text-${bIdx}`);
  });
}

function SimpleMarkdown({ content }: { content: string }) {
  const parts = content.split("```");
  return (
    <div className="space-y-2 text-sm text-white/90 leading-relaxed">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          // Code block
          const lines = part.split("\n");
          const firstLine = lines[0].trim();
          const hasLanguage = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const language = hasLanguage ? firstLine : "";
          const code = hasLanguage ? lines.slice(1).join("\n") : part;
          return (
            <pre
              key={index}
              className="my-3 p-4 rounded-xl bg-black/50 border border-white/10 overflow-x-auto text-xs font-mono text-white/90"
            >
              {language && (
                <div className="text-[10px] text-white/40 uppercase mb-2 font-bold select-none">
                  {language}
                </div>
              )}
              <code className="whitespace-pre">{code.trim()}</code>
            </pre>
          );
        } else {
          // Regular text
          return (
            <div key={index} className="space-y-1">
              {part.split("\n").map((line, lIdx) => {
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={lIdx} className="text-base font-bold text-white mt-4 mb-2">
                      {parseInlineMarkdown(line.substring(4))}
                    </h3>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={lIdx} className="text-lg font-bold text-white mt-5 mb-2">
                      {parseInlineMarkdown(line.substring(3))}
                    </h2>
                  );
                }
                if (line.startsWith("# ")) {
                  return (
                    <h1 key={lIdx} className="text-xl font-bold text-white mt-6 mb-3">
                      {parseInlineMarkdown(line.substring(2))}
                    </h1>
                  );
                }
                if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                  const cleanLine = line.trim().substring(2);
                  return (
                    <li key={lIdx} className="ml-4 list-disc text-sm text-white/90 my-1">
                      {parseInlineMarkdown(cleanLine)}
                    </li>
                  );
                }
                if (!line.trim()) {
                  return <div key={lIdx} className="h-2" />;
                }
                return (
                  <p key={lIdx} className="my-1">
                    {parseInlineMarkdown(line)}
                  </p>
                );
              })}
            </div>
          );
        }
      })}
    </div>
  );
}

