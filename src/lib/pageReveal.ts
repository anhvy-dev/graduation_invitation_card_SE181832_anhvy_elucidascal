import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

/* Luxury deceleration cubic-bezier — matches the motion/react ease used elsewhere */
const REVEAL_EASE = CustomEase.create("revealEase", "M0,0 C0.22,1 0.36,1 1,1");

export type RevealDirection = 1 | -1;

const running    = new Map<number, gsap.core.Timeline>();
const glowTimers = new Map<number, number>();

function stopPage(pageIndex: number): void {
  const tl = running.get(pageIndex);
  if (tl) {
    tl.kill();
    running.delete(pageIndex);
  }
  const glowTimer = glowTimers.get(pageIndex);
  if (glowTimer) {
    window.clearTimeout(glowTimer);
    glowTimers.delete(pageIndex);
  }
}

export function resetPageReveals(root: ParentNode): void {
  running.forEach((_, index) => stopPage(index));
  running.clear();

  root.querySelectorAll("[data-flip-index]").forEach((page) => {
    page.removeAttribute("data-revealed");
    page.querySelector(".signature-glow")?.classList.remove("is-on");
    page.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.clipPath = "";
      el.style.filter = "";
    });
    page.querySelectorAll<HTMLElement>("[data-reveal='photo'] img").forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
    });
  });
}

export function showPageImmediately(page: Element): void {
  page.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.clipPath = "none";
  });
  page.querySelectorAll<HTMLElement>("[data-reveal='photo'] img").forEach((el) => {
    el.style.transform = "none";
    el.style.opacity = "1";
  });
  page.querySelector(".signature-glow")?.classList.add("is-on");
}

/**
 * Plays a cinematic page reveal using GSAP.
 * Coordinated with StPageFlip changeState="read" events.
 */
export function playPageReveal(
  root: ParentNode,
  pageIndex: number,
  reducedMotion: boolean,
  direction: RevealDirection = 1
): void {
  const page = root.querySelector(`[data-flip-index="${pageIndex}"]`);
  if (!page || page.getAttribute("data-revealed") === "1") return;
  page.setAttribute("data-revealed", "1");
  stopPage(pageIndex);

  if (reducedMotion) {
    showPageImmediately(page);
    return;
  }

  const masks     = page.querySelectorAll<HTMLElement>('[data-reveal="mask"]');
  const lines     = page.querySelectorAll<HTMLElement>('[data-reveal="line"]');
  const photos    = page.querySelectorAll<HTMLElement>('[data-reveal="photo"]');
  const frames    = page.querySelectorAll<HTMLElement>('[data-reveal="frame"]');
  const photoImgs = page.querySelectorAll<HTMLElement>('[data-reveal="photo"] img');

  const drift     = direction >= 0 ? 14 : -14;
  const photoFrom = direction >= 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

  const tl = gsap.timeline();

  /* Photo frames: fade + lift */
  if (frames.length) {
    gsap.set(frames, { opacity: 0, y: 10, scale: 0.982 });
    tl.to(frames, { opacity: 1, y: 0, scale: 1, duration: 0.62, delay: 0.06, ease: "power3.out" }, 0);
  }

  /* Clip-path wipe (matches page-turn direction) */
  if (photos.length) {
    gsap.set(photos, { clipPath: photoFrom, opacity: 0.8 });
    tl.to(photos, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.15, delay: 0.12, ease: "power2.inOut" }, 0);
  }

  /* Image: subtle scale + fade in */
  if (photoImgs.length) {
    gsap.set(photoImgs, { scale: 1.04, opacity: 0.85 });
    tl.to(photoImgs, { scale: 1, opacity: 1, duration: 1.25, delay: 0.14, ease: "power3.out" }, 0);
  }

  /* Heading mask reveals — elegant upward slide */
  if (masks.length) {
    gsap.set(masks, { y: "112%", opacity: 0.1 });
    tl.to(masks, { y: "0%", opacity: 1, duration: 0.82, stagger: 0.10, delay: 0.08, ease: REVEAL_EASE }, 0);
  }

  /* Line items: drift + fade staggered */
  if (lines.length) {
    gsap.set(lines, { opacity: 0, y: 16, x: drift });
    tl.to(lines, { opacity: 1, y: 0, x: 0, duration: 0.72, stagger: 0.09, delay: 0.12, ease: REVEAL_EASE }, 0);
  }

  running.set(pageIndex, tl);

  /* Signature glow activates after the reveal settles */
  const glowTimer = window.setTimeout(() => {
    if (page.getAttribute("data-revealed") === "1") {
      page.querySelector(".signature-glow")?.classList.add("is-on");
    }
    glowTimers.delete(pageIndex);
  }, 780);
  glowTimers.set(pageIndex, glowTimer);
}
