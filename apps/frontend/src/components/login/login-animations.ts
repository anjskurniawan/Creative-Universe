import { gsap } from "gsap";

/**
 * Animasi transisi layar menjadi putih perlahan ketika berhasil masuk ke Universe
 */
export function playUniverseTransition(whiteOverlay: HTMLDivElement, onComplete: () => void) {
  if (typeof document !== "undefined") {
    document.body.classList.add("transitioning-universe");
  }

  gsap.killTweensOf(whiteOverlay);
  gsap.set(whiteOverlay, { opacity: 0 });

  const tl = gsap.timeline({
    onComplete: () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("transitioning-universe");
      }
      onComplete();
    },
  });

  tl.to(whiteOverlay, {
    opacity: 1,
    duration: 1.2,
    ease: "power2.inOut",
  });
}

/**
 * Animasi entrance slide up + fade + blur untuk kartu login
 */
export function playCardEntrance(card: HTMLDivElement) {
  return gsap.fromTo(
    card,
    {
      y: 140,
      opacity: 0,
      filter: "blur(12px)",
    },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.9,
      ease: "power2.out",
    }
  );
}
