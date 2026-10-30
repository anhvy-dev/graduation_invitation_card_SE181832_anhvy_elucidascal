import confetti from "canvas-confetti";

const CHAMPAGNE   = ["#D6B477", "#E8CFA0", "#B8944F", "#FAF8F3", "#C9A86C"];
const GOLD_ACCENT = ["#D6B477", "#E8CFA0", "#F5E6C0"];

const base = {
  colors: CHAMPAGNE,
  disableForReducedMotion: true,
} as const;

export function resetGraduationConfetti(): void {
  confetti.reset();
}

/**
 * Fires a multi-burst champagne-gold confetti celebration
 * synchronized with the final page reveal.
 */
export function fireGraduationConfetti(): void {
  /* ── Burst 1: Central upward cascade (immediate) ── */
  confetti({
    ...base,
    particleCount: 36,
    spread: 48,
    startVelocity: 22,
    scalar: 0.68,
    ticks: 260,
    gravity: 0.76,
    decay: 0.92,
    origin: { x: 0.5, y: 0.36 },
  });

  /* ── Burst 2: Left-right flanks after 280ms ── */
  window.setTimeout(() => {
    confetti({
      ...base,
      colors: GOLD_ACCENT,
      particleCount: 18,
      angle: 60,
      spread: 36,
      startVelocity: 18,
      scalar: 0.52,
      ticks: 220,
      gravity: 0.68,
      decay: 0.91,
      origin: { x: 0.18, y: 0.52 },
    });
    confetti({
      ...base,
      colors: GOLD_ACCENT,
      particleCount: 18,
      angle: 120,
      spread: 36,
      startVelocity: 18,
      scalar: 0.52,
      ticks: 220,
      gravity: 0.68,
      decay: 0.91,
      origin: { x: 0.82, y: 0.52 },
    });
  }, 280);

  /* ── Burst 3: Final gentle drift (830ms) ── */
  window.setTimeout(() => {
    confetti({
      ...base,
      particleCount: 22,
      spread: 60,
      startVelocity: 12,
      scalar: 0.44,
      ticks: 200,
      gravity: 0.58,
      decay: 0.94,
      origin: { x: 0.5, y: 0.42 },
    });
  }, 830);
}
