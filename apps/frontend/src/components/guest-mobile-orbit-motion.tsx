"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const MOTION_ASSET_PATH = "/images/landing/motion";
const ORBIT_DURATION = 16;

const ORBIT_ICONS = [
  { name: "Folder", file: "folder.png", left: 21, top: 13, size: 22 },
  { name: "Freeform", file: "freeform.png", left: 75, top: 20, size: 18 },
  { name: "Photos", file: "photos.png", left: 80, top: 36, size: 28 },
  { name: "Messages", file: "messages.png", left: 72, top: 82, size: 28 },
  { name: "Notes", file: "notes.png", left: 36, top: 81, size: 18 },
  { name: "Reminders", file: "reminders.png", left: 22, top: 74, size: 12 },
  { name: "Calendar", file: "calendar.png", left: 15, top: 48, size: 30 },
] as const;

export function GuestMobileOrbitMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const orbit = orbitRef.current;
    const logo = logoRef.current;
    const section = root?.parentElement;
    const copy = section?.querySelector<HTMLElement>("[data-guest-landing-copy]");
    const cta = section?.querySelector<HTMLElement>("[data-guest-landing-cta]");

    if (!root || !frame || !orbit || !logo || !section || !copy || !cta) {
      return;
    }

    const iconShells = Array.from(root.querySelectorAll<HTMLElement>("[data-orbit-icon]"));
    const radiationRings = Array.from(root.querySelectorAll<HTMLElement>("[data-logo-radiation]"));
    const media = gsap.matchMedia();
    let resizeFrame = 0;

    const updateLayout = () => {
      const sectionRect = section.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      const regionTop = Math.max(0, copyRect.bottom - sectionRect.top + 12);
      const regionBottom = Math.max(0, sectionRect.bottom - ctaRect.top + 12);
      const availableHeight = Math.max(0, sectionRect.height - regionTop - regionBottom);
      const frameSize = Math.min(sectionRect.width * 0.86, availableHeight, 360);

      root.style.top = `${regionTop}px`;
      root.style.bottom = `${regionBottom}px`;
      frame.style.width = `${frameSize}px`;
    };

    const requestLayoutUpdate = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(updateLayout);
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(requestLayoutUpdate);
    resizeObserver.observe(section);
    resizeObserver.observe(copy);
    resizeObserver.observe(cta);
    window.addEventListener("resize", requestLayoutUpdate);

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        allowMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const reduceMotion = context.conditions?.reduceMotion ?? false;

        gsap.set(orbit, {
          rotation: 0,
          transformOrigin: "50% 46%",
        });
        gsap.set(logo, {
          autoAlpha: reduceMotion ? 1 : 0,
          scale: reduceMotion ? 1 : 0.24,
          transformOrigin: "50% 50%",
        });
        gsap.set(iconShells, {
          autoAlpha: reduceMotion ? 1 : 0,
          rotation: 0,
          transformOrigin: "50% 50%",
        });
        gsap.set(radiationRings, {
          autoAlpha: 0,
          scale: 0.88,
          transformOrigin: "50% 50%",
        });

        if (reduceMotion) {
          return;
        }

        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
        });

        timeline
          .addLabel("logoIntro", 0)
          .to(
            logo,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.7)",
            },
            "logoIntro",
          )
          .addLabel("orbit", 0.8)
          .to(
            iconShells,
            {
              autoAlpha: 1,
              duration: 0.34,
              stagger: 0.16,
            },
            "orbit",
          )
          .to(
            orbit,
            {
              rotation: 360,
              duration: ORBIT_DURATION,
              ease: "none",
              repeat: -1,
            },
            "orbit",
          )
          .to(
            iconShells,
            {
              rotation: -360,
              duration: ORBIT_DURATION,
              ease: "none",
              repeat: -1,
            },
            "orbit",
          )
          .to(
            logo,
            {
              scale: 1.06,
              duration: 1.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
            "orbit+=0.2",
          );

        radiationRings.forEach((ring, index) => {
          timeline.fromTo(
            ring,
            {
              autoAlpha: 0.72,
              scale: 0.88,
            },
            {
              autoAlpha: 0,
              scale: 1.72,
              duration: 1.8,
              ease: "power2.out",
              repeat: -1,
            },
            `orbit+=${0.2 + index * 0.6}`,
          );
        });
      },
      root,
    );

    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", requestLayoutUpdate);
      resizeObserver.disconnect();
      media.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-guest-orbit-region
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[210px] bottom-[190px] z-10 flex items-center justify-center select-none"
    >
      <div
        ref={frameRef}
        data-guest-orbit-motion
        className="relative aspect-square w-[min(86vw,40dvh,360px)] shrink-0"
      >
        {[0, 1, 2].map((ring) => (
          <div
            key={ring}
            className="absolute left-1/2 top-[46%] z-0 aspect-square w-[47%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              data-logo-radiation
              className="size-full rounded-full border border-white/55 bg-white/[0.08]"
              style={{
                opacity: 0,
                visibility: "hidden",
                willChange: "transform, opacity",
                boxShadow: "0 0 34px rgba(255,255,255,0.42), inset 0 0 24px rgba(255,255,255,0.18)",
              }}
            />
          </div>
        ))}

        <div
          ref={orbitRef}
          data-orbit-layer
          className="absolute inset-0 z-10"
          style={{ willChange: "transform" }}
        >
          {ORBIT_ICONS.map((icon) => (
            <div
              key={icon.name}
              className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${icon.left}%`,
                top: `${icon.top}%`,
                width: `${icon.size}%`,
              }}
            >
              <div
                data-orbit-icon={icon.name}
                className="relative size-full overflow-hidden rounded-full border border-white/70 bg-white/35 backdrop-blur-lg"
                style={{
                  opacity: 0,
                  visibility: "hidden",
                  willChange: "transform, opacity",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(255,255,255,0.18), 0 8px 24px rgba(25,0,45,0.28)",
                }}
              >
                <Image
                  src={`${MOTION_ASSET_PATH}/${icon.file}`}
                  alt=""
                  width={128}
                  height={128}
                  sizes="112px"
                  className="size-full object-cover"
                  style={{
                    filter: "grayscale(1) saturate(0) brightness(3) contrast(0.1)",
                    mixBlendMode: "screen",
                    opacity: 0.32,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          ref={logoRef}
          data-orbit-center-logo
          className="absolute left-1/2 top-[46%] z-20 aspect-square w-[47%] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: 0,
            visibility: "hidden",
            willChange: "transform, opacity",
          }}
        >
          <Image
            src={`${MOTION_ASSET_PATH}/center-logo.png`}
            alt=""
            width={175}
            height={175}
            sizes="170px"
            className="size-full object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
