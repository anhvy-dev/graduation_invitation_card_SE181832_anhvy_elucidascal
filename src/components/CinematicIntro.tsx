import { useEffect, useRef, useState, type ReactElement, type Key } from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";

type CinematicIntroProps = {
  key?: Key;
  bookStage: HTMLElement | null;
  reducedMotion: boolean;
  replay?: boolean;
  onReady?: () => void;
  onOpen: () => void;
  onDismiss: () => void;
};

const maskEase = [0.22, 1, 0.36, 1] as const;

export function CinematicIntro({
  bookStage,
  reducedMotion,
  replay = false,
  onReady,
  onOpen,
  onDismiss,
}: CinematicIntroProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const openedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const onOpenRef = useRef(onOpen);
  const onDismissRef = useRef(onDismiss);
  onReadyRef.current = onReady;
  onOpenRef.current = onOpen;
  onDismissRef.current = onDismiss;

  const [phase, setPhase] = useState(0);
  const [hintOn, setHintOn] = useState(false);

  useEffect(() => {
    const markReady = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      onReadyRef.current?.();
      setHintOn(true);
    };

    if (reducedMotion) {
      markReady();
      onDismissRef.current();
      return;
    }

    const root = rootRef.current;
    if (!root || !bookStage) return;
    let alive = true;

    const ctx = gsap.context(() => {
      const veil      = root.querySelector(".intro-veil");
      const grain     = root.querySelector(".intro-grain");
      const light     = root.querySelector(".intro-light");
      const barTop    = root.querySelector(".intro-bar--top");
      const barBot    = root.querySelector(".intro-bar--bottom");
      const particles = root.querySelectorAll(".intro-dust");
      const beam      = bookStage.querySelector(".cover-sweep-beam");

      gsap.set(grain,     { opacity: 0 });
      gsap.set(light,     { opacity: 0, scale: 0.12 });
      gsap.set(barTop,    { yPercent: -100 });
      gsap.set(barBot,    { yPercent: 100 });
      gsap.set(particles, { opacity: 0, scale: 0 });
      gsap.set(bookStage, {
        scale: 1.18,
        y: 22,
        filter: "blur(14px)",
        opacity: 0.08,
        transformOrigin: "center center",
      });
      if (beam) gsap.set(beam, { xPercent: -110, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to([barTop, barBot], { yPercent: 0, duration: 0.52, ease: "power3.out" }, 0)
        .to(grain, { opacity: 0.6, duration: 0.7 }, 0.08)
        .to(light, { opacity: 1, scale: 1, duration: 1.35, ease: "power3.out" }, 0.18)
        .to(particles, { opacity: 0.65, scale: 1, duration: 0.9, stagger: 0.06, ease: "power2.out" }, 0.45)
        .add(() => { if (alive) setPhase(1); }, 0.88)
        .add(() => { if (alive) setPhase(2); }, 1.46)
        .add(() => { if (alive) setPhase(3); }, 2.28)
        .to(light, { scale: 1.10, duration: 1.9, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.5)
        .add(() => { if (alive) setPhase(4); }, 3.25)
        .to(veil, { opacity: 0, duration: 1.1, ease: "power2.inOut" }, 3.3)
        .to(barTop, { yPercent: -100, duration: 0.85, ease: "power2.in" }, 3.25)
        .to(barBot, { yPercent: 100, duration: 0.85, ease: "power2.in" }, 3.25)
        .to(bookStage, {
          scale: 1, y: 0, filter: "blur(0px)", opacity: 1,
          duration: 1.35, ease: "power3.out",
        }, 3.22)
        .add(() => { gsap.set(bookStage, { clearProps: "filter" }); }, 4.55)
        .to(grain, { opacity: 0.18, duration: 0.7 }, 4.88);

      if (beam) {
        tl.to(beam, { xPercent: 220, opacity: 1, duration: 1.1, ease: "power2.inOut" }, 4.4)
          .to(beam, { opacity: 0, duration: 0.3, ease: "power1.out" }, 5.25);
      }

      tl.add(() => { if (alive) markReady(); }, 5.12);
    }, root);

    return () => {
      alive = false;
      ctx.revert();
      if (bookStage) gsap.set(bookStage, { clearProps: "all" });
    };
  }, [bookStage, reducedMotion]);

  const handleOpen = () => {
    if (openedRef.current) return;
    openedRef.current = true;
    onOpenRef.current();
  };

  const showCopy = phase >= 1 && phase < 4;
  const copyOut  = phase >= 4;

  return (
    <motion.div
      ref={rootRef}
      className="cinematic-intro"
      role="dialog"
      aria-label="Opening sequence"
      aria-live="polite"
      initial={replay ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } }}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      tabIndex={0}
    >
      <div className="intro-veil" />
      <div className="intro-grain" aria-hidden="true" />

      {/* Cinematic letterbox bars */}
      <div className="intro-bar intro-bar--top" aria-hidden="true" />
      <div className="intro-bar intro-bar--bottom" aria-hidden="true" />

      {/* Ambient dust particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 15 + ((i * 73) % 70);
        const y = 20 + ((i * 41) % 60);
        const size = 1.5 + (i % 3) * 0.9;
        const delay = (i * 0.38) % 4;
        return (
          <span
            key={i}
            className="intro-dust"
            aria-hidden="true"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${3.8 + (i % 5) * 0.7}s`,
            }}
          />
        );
      })}

      <div className="intro-light" aria-hidden="true" />

      <div className="intro-copy">
        <div className="intro-mask">
          <motion.p
            className="intro-moment"
            initial={{ y: "110%", opacity: 0, letterSpacing: "0.58em" }}
            animate={
              showCopy
                ? { y: "0%", opacity: 1, letterSpacing: "0.42em" }
                : copyOut
                  ? { y: "0%", opacity: 0 }
                  : { y: "110%", opacity: 0 }
            }
            transition={{ duration: 0.76, ease: maskEase }}
          >
            A SPECIAL MOMENT
          </motion.p>
        </div>

        <div className="intro-mask intro-mask--name">
          <h1 className="intro-name">
            <motion.span
              className="intro-name-line"
              initial={{ y: "110%", opacity: 0 }}
              animate={
                phase >= 2 && phase < 4
                  ? { y: "0%", opacity: 1 }
                  : copyOut
                    ? { y: "0%", opacity: 0 }
                    : { y: "110%", opacity: 0 }
              }
              transition={{ duration: 0.95, ease: maskEase }}
            >
              VY ANH
            </motion.span>
          </h1>
        </div>

        <motion.div
          className="intro-rule"
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            phase >= 3 && phase < 4
              ? { scaleX: 1, opacity: 0.75 }
              : copyOut
                ? { scaleX: 1, opacity: 0 }
                : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.58, ease: maskEase }}
        />

        <div className="intro-mask">
          <motion.p
            className="intro-class"
            initial={{ y: "110%", opacity: 0 }}
            animate={
              phase >= 3 && phase < 4
                ? { y: "0%", opacity: 1 }
                : copyOut
                  ? { y: "0%", opacity: 0 }
                  : { y: "110%", opacity: 0 }
            }
            transition={{ duration: 0.7, ease: maskEase }}
          >
            CLASS OF 2026
          </motion.p>
        </div>
      </div>

      <AnimatePresence>
        {hintOn && (
          <motion.div
            className="intro-hint-wrap"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.62, ease: maskEase }}
          >
            <motion.span
              className="intro-hint-dot"
              aria-hidden="true"
              animate={{ scale: [1, 1.4, 1], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.p
              className="intro-hint"
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              CHẠM ĐỂ MỞ THIỆP
            </motion.p>
            <motion.span
              className="intro-hint-arrow"
              aria-hidden="true"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              ›
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
