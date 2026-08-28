import { gsap } from "gsap";

/**
 * Animasi transisi zoom putih saat sukses login menuju dashboard Universe
 */
export function playUniverseTransition(whiteOverlay: HTMLElement, onComplete: () => void) {
  gsap.killTweensOf(whiteOverlay);
  return gsap.to(whiteOverlay, {
    opacity: 1,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete,
  });
}

/**
 * Animasi masuk kartu autentikasi (slide up + fade in)
 */
export function playCardEntrance(card: HTMLElement) {
  gsap.killTweensOf(card);
  return gsap.fromTo(
    card,
    { opacity: 0, y: 32, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
  );
}
