import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  MapPin,
  Music2,
  Volume2,
  VolumeX,
  Download,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ——— Calendar Utils ———————————————————————————————————————

const EVENT_DETAILS = {
  title: "Lễ Tốt Nghiệp - Vy Anh | FPT University HCMC",
  description: "Lễ kỷ niệm Niên khóa 2026 – Đại học FPT, TP. Hồ Chí Minh",
  location: "Đại học FPT, TP. Hồ Chí Minh",
  startUtc: "20261115T010000Z",
  endUtc:   "20261115T050000Z",
  startLocal: "20261115T080000",
  endLocal:   "20261115T120000",
};

function buildGoogleCalendarUrl(): string {
  const { title, description, location, startUtc, endUtc } = EVENT_DETAILS;
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${startUtc}/${endUtc}` +
    `&details=${encodeURIComponent(description)}` +
    `&location=${encodeURIComponent(location)}` +
    `&sf=true&output=xml`
  );
}

function generateIcsContent(): string {
  const { title, description, location, startLocal, endLocal } = EVENT_DETAILS;
  const uid = `graduation-se181832-${Date.now()}@fpt.edu.vn`;
  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0",
    "PRODID:-//Graduation Invite//SE181832//VI",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`, `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${startLocal}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${endLocal}`,
    `SUMMARY:${title}`, `DESCRIPTION:${description}`, `LOCATION:${location}`,
    "STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs() {
  const blob = new Blob([generateIcsContent()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "le-tot-nghiep-vy-anh-2026.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function detectPlatform(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as unknown as Record<string, unknown>).MSStream) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

// ——— Gold Confetti ————————————————————————————————————————

const GoldConfetti = ({ active }: { active: boolean }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        size: Math.random() * 7 + 4,
        duration: Math.random() * 3 + 3,
        rotation: Math.random() * 720,
        shape: Math.random() > 0.5 ? "round" : "rect",
      })),
    []
  );
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.shape === "round" ? p.size : p.size * 0.5,
            borderRadius: p.shape === "round" ? "50%" : "2px",
            background:
              p.id % 3 === 0
                ? "rgba(214,180,119,0.85)"
                : p.id % 3 === 1
                  ? "rgba(232,207,160,0.75)"
                  : "rgba(184,148,79,0.7)",
          }}
          initial={{ top: -20, rotate: 0, opacity: 1 }}
          animate={{ top: "110%", rotate: p.rotation, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
};

// ——— Gold Petal Effect ————————————————————————————————————

const PetalEffect = () => {
  const petals = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((_, i) => (
        <motion.div
          key={i}
          className="petal"
          initial={{
            top: -20,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 5}px`,
            height: `${Math.random() * 8 + 5}px`,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            top: "110%",
            left: `${Math.random() * 100 + (Math.random() * 20 - 10)}%`,
            rotate: 540,
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: Math.random() * 14 + 12,
            repeat: Infinity,
            delay: Math.random() * 25,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ——— Graduation Cap SVG ———————————————————————————————————

const GradCapIllustration = () => (
  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M60 14L108 36L60 58L12 36L60 14Z" fill="rgba(214,180,119,0.12)" stroke="rgba(214,180,119,0.6)" strokeWidth="0.8" />
    <rect x="53" y="7" width="14" height="14" rx="1" fill="rgba(214,180,119,0.20)" stroke="rgba(214,180,119,0.55)" strokeWidth="0.8" transform="rotate(45 60 14)" />
    <line x1="108" y1="36" x2="108" y2="60" stroke="rgba(214,180,119,0.5)" strokeWidth="0.8" />
    <circle cx="108" cy="65" r="4" fill="none" stroke="rgba(214,180,119,0.5)" strokeWidth="0.8" />
    <line x1="104" y1="65" x2="100" y2="74" stroke="rgba(214,180,119,0.4)" strokeWidth="0.7" />
    <line x1="108" y1="69" x2="108" y2="78" stroke="rgba(214,180,119,0.4)" strokeWidth="0.7" />
    <line x1="112" y1="65" x2="116" y2="74" stroke="rgba(214,180,119,0.4)" strokeWidth="0.7" />
    <line x1="60" y1="58" x2="60" y2="75" stroke="rgba(214,180,119,0.4)" strokeWidth="0.8" />
    <ellipse cx="60" cy="75" rx="14" ry="4" fill="none" stroke="rgba(214,180,119,0.35)" strokeWidth="0.8" />
    <line x1="12" y1="36" x2="12" y2="48" stroke="rgba(214,180,119,0.3)" strokeWidth="0.7" strokeDasharray="2 2" />
  </svg>
);

// ——— Academic Seal SVG ————————————————————————————————————

const AcademicSeal = ({ size = 64 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" stroke="#D6B477" strokeWidth="0.8" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="25" stroke="#D6B477" strokeWidth="0.5" opacity="0.6" />
    <text x="32" y="27" textAnchor="middle" fill="#D6B477" fontSize="7" fontFamily="serif" letterSpacing="1.5" opacity="0.9">FPT</text>
    <text x="32" y="37" textAnchor="middle" fill="#D6B477" fontSize="4.5" fontFamily="serif" letterSpacing="1" opacity="0.7">UNIVERSITY</text>
    <text x="32" y="46" textAnchor="middle" fill="#D6B477" fontSize="4" fontFamily="serif" letterSpacing="0.5" opacity="0.6">2026</text>
    <path d="M20 49 Q32 53 44 49" stroke="#D6B477" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);

// ——— Academic Emblem (ornate, for cover) ———————————————————

const AcademicEmblem = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="#D6B477" strokeWidth="0.8" strokeDasharray="4 3" />
    <circle cx="50" cy="50" r="38" stroke="#D6B477" strokeWidth="0.5" opacity="0.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 50 + 30 * Math.cos(rad);
      const y1 = 50 + 30 * Math.sin(rad);
      const x2 = 50 + 38 * Math.cos(rad);
      const y2 = 50 + 38 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D6B477" strokeWidth="0.6" opacity="0.5" />;
    })}
    <path d="M50 28 L68 38 L50 48 L32 38Z" fill="rgba(214,180,119,0.15)" stroke="#D6B477" strokeWidth="0.7" opacity="0.8" />
    <text x="50" y="60" textAnchor="middle" fill="#D6B477" fontSize="5.5" fontFamily="serif" letterSpacing="2" opacity="0.9">FPT</text>
    <text x="50" y="68" textAnchor="middle" fill="#D6B477" fontSize="3.5" fontFamily="serif" letterSpacing="1.2" opacity="0.65">UNIVERSITY</text>
    <line x1="68" y1="38" x2="68" y2="52" stroke="#D6B477" strokeWidth="0.6" opacity="0.5" />
    <circle cx="68" cy="55" r="2.5" fill="none" stroke="#D6B477" strokeWidth="0.6" opacity="0.5" />
  </svg>
);

// ——— Calendar Modal ———————————————————————————————————————

const CalendarModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    key="cal-modal"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-6"
    style={{ background: "rgba(13,26,43,0.7)", backdropFilter: "blur(8px)" }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.88, y: 24, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.88, y: 24, opacity: 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className="cal-modal-bg relative w-full max-w-sm p-8 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors" aria-label="Đóng">
        <X size={15} />
      </button>
      <div className="text-center mb-7">
        <AcademicSeal size={48} />
        <h2 className="mt-3 text-lg font-display italic" style={{ color: "var(--navy)" }}>Lưu vào lịch</h2>
        <p className="text-[11px] mt-1" style={{ color: "var(--slate)" }}>Chọn ứng dụng lịch bạn đang dùng</p>
      </div>
      <div className="space-y-2.5">
        <a href={buildGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="cal-option">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg viewBox="0 0 48 48" width="20" height="20">
              <path fill="#4285F4" d="M45.5 20H24v8h12.5C34.8 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20c11.05 0 20-8.95 20-20 0-1.34-.14-2.65-.5-4z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-medium" style={{ color: "var(--navy)" }}>Google Calendar</p>
            <p className="text-[11px]" style={{ color: "var(--slate)" }}>Mở trên trình duyệt</p>
          </div>
          <ExternalLink size={13} style={{ color: "var(--slate-light)" }} />
        </a>
        <button onClick={() => { downloadIcs(); onClose(); }} className="cal-option">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm flex-shrink-0">
            <Calendar size={16} style={{ color: "var(--slate)" }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-medium" style={{ color: "var(--navy)" }}>Outlook / Apple Calendar</p>
            <p className="text-[11px]" style={{ color: "var(--slate)" }}>Tải file .ics</p>
          </div>
          <Download size={13} style={{ color: "var(--slate-light)" }} />
        </button>
      </div>
      <p className="text-center text-[10px] mt-6 tracking-widest" style={{ color: "var(--slate-light)" }}>
        15 · 11 · 2026 &nbsp;·&nbsp; 08:00 ICT
      </p>
    </motion.div>
  </motion.div>
);

// ——— Page Components ——————————————————————————————————————

const CoverPage = ({ onClick }: { onClick: () => void }) => (
  <div
    className="booklet-page booklet-cover"
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label="Chạm để mở thiệp"
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    <div className="cover-border" />
    <div className="cover-ornament-top" />
    <div className="flex flex-col items-center mt-10 mb-2">
      <AcademicEmblem size={72} />
    </div>
    <div className="text-center px-8 mb-3">
      <p className="cover-eyebrow mb-3">LỄ TỐT NGHIỆP</p>
      <div className="cover-gold-rule mb-4" />
      <h1 className="cover-title">Vy Anh</h1>
      <div className="cover-gold-rule mt-4 mb-4" />
      <p className="cover-class">CLASS OF 2026</p>
    </div>
    <div className="cover-ornament-bottom" />
    <div className="cover-tap-hint">
      <span className="tap-hint-text">CHẠM ĐỂ MỞ THIỆP</span>
      <span className="tap-hint-arrow">›</span>
    </div>
    <div className="cover-sheen" />
  </div>
);

const InvitationPage = ({ displayName, revealed }: { displayName: string; revealed: boolean }) => (
  <div className="booklet-page page-ivory">
    <div className="page-top-line" />
    <div className="flex flex-col items-center h-full px-7 pt-8 pb-6">
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.55, delay: 0.08 }} className="w-full text-center">
        <div className="page-eyebrow mb-4">TRÂN TRỌNG KÍNH MỜI</div>
        <div className="page-gold-rule mb-5" />
      </motion.div>
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.55, delay: 0.22 }} className="w-full text-center mb-5">
        <h2 className="recipient-name">{displayName}</h2>
      </motion.div>
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.55, delay: 0.38 }} className="w-full text-center flex-1 flex flex-col justify-center">
        <div className="w-20 mx-auto mb-5">
          <GradCapIllustration />
        </div>
        <p className="invitation-body">
          Cảm ơn bạn đã là một phần trong hành trình của mình. Sự hiện diện của bạn sẽ khiến ngày đặc biệt này trở nên trọn vẹn hơn.
        </p>
      </motion.div>
      <motion.div initial={false} animate={revealed ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: 0.55 }} className="w-full">
        <div className="page-gold-rule mt-5" />
        <p className="page-number-label mt-3">01 / 03</p>
      </motion.div>
    </div>
  </div>
);

const EventDetailsPage = ({ revealed, onCalendarClick }: { revealed: boolean; onCalendarClick: () => void }) => (
  <div className="booklet-page page-ivory">
    <div className="page-top-line" />
    <div className="flex flex-col h-full px-7 pt-8 pb-6">
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ duration: 0.5, delay: 0.08 }}>
        <div className="page-eyebrow mb-3 text-center">THÔNG TIN SỰ KIỆN</div>
        <div className="page-gold-rule mb-6" />
      </motion.div>
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.5, delay: 0.18 }} className="detail-row mb-5">
        <div className="detail-icon-wrap">
          <Calendar size={13} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <p className="detail-label-sm">NGÀY</p>
          <p className="detail-date">15.11.2026</p>
          <p className="detail-sub">Chủ Nhật · 08:00 ICT</p>
        </div>
      </motion.div>
      <div className="thin-divider mb-5" />
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.5, delay: 0.28 }} className="detail-row mb-2">
        <div className="detail-icon-wrap">
          <MapPin size={13} style={{ color: "var(--gold)" }} />
        </div>
        <div className="flex-1">
          <p className="detail-label-sm">ĐỊA ĐIỂM</p>
          <p className="detail-venue">Đại học FPT</p>
          <p className="detail-sub">TP. Hồ Chí Minh</p>
        </div>
        <a href="https://www.google.com/maps/search/?api=1&query=FPT+University+HCMC" target="_blank" rel="noopener noreferrer" className="map-link self-end">BẢN ĐỒ ↗</a>
      </motion.div>
      <div className="thin-divider mb-5" />
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.5, delay: 0.38 }} className="flex-1 flex flex-col justify-end">
        <button id="btn-confirm-attendance" className="cta-btn w-full mb-2" onClick={onCalendarClick}>
          <Calendar size={14} style={{ opacity: 0.7 }} />
          Lưu lịch tham dự
        </button>
        <p className="page-number-label text-center mt-2">02 / 03</p>
      </motion.div>
    </div>
  </div>
);

const FinalPage = ({ revealed, onRestart }: { revealed: boolean; onRestart: () => void }) => (
  <div className="booklet-page page-navy final-page">
    <div className="page-top-line-gold" />
    <div className="flex flex-col items-center h-full px-8 pt-9 pb-7">
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ duration: 0.55, delay: 0.08 }} className="w-full text-center">
        <AcademicSeal size={44} />
        <div className="cover-gold-rule mt-4 mb-5" style={{ opacity: 0.4 }} />
      </motion.div>
      <motion.div initial={false} animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ duration: 0.55, delay: 0.22 }} className="flex-1 flex flex-col justify-center text-center">
        <p className="final-quote-vi">
          "Dù bạn đã đồng hành cùng mình ở chặng đường nào, mình luôn trân trọng sự hiện diện của bạn trong hành trình trưởng thành này."
        </p>
        <p className="final-quote-en mt-4">
          "Wherever our paths have crossed, you have been part of my journey."
        </p>
      </motion.div>
      <motion.div initial={false} animate={revealed ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="w-full text-center">
        <div className="cover-gold-rule mb-5" style={{ opacity: 0.35 }} />
        <p className="final-with-gratitude">WITH GRATITUDE</p>
        <p className="final-signature">Vy Anh</p>
        <p className="final-class">CLASS OF 2026</p>
        <p className="page-number-label-light mt-4">03 / 03</p>
        <button onClick={onRestart} className="restart-btn mt-5" aria-label="Xem lại từ đầu">↺ Xem lại</button>
      </motion.div>
    </div>
  </div>
);

// ——— Booklet Viewer ———————————————————————————————————————

type BookletPage = 0 | 1 | 2 | 3;
const TOTAL_SPREADS = 3;
const TRANSITION_MS = 900;

function useReducedMotion() {
  const mq = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const [reduced, setReduced] = useState(mq?.matches ?? false);
  useEffect(() => {
    if (!mq) return;
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mq]);
  return reduced;
}

const BookletViewer = ({ displayName, onCalendarClick }: { displayName: string; onCalendarClick: () => void }) => {
  const [page, setPage] = useState<BookletPage>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const reducedMotion = useReducedMotion();
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false]);

  const revealPage = useCallback((idx: number) => {
    setRevealed((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }, []);

  const navigateTo = useCallback((target: BookletPage) => {
    if (isAnimating || target === page) return;
    if (target < 0 || target > TOTAL_SPREADS) return;
    setIsAnimating(true);
    setPage(target);
    const delay = reducedMotion ? 0 : TRANSITION_MS;
    setTimeout(() => {
      setIsAnimating(false);
      revealPage(target);
      if (target === 3) {
        setTimeout(() => setShowConfetti(true), 400);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, delay);
  }, [isAnimating, page, reducedMotion, revealPage]);

  const goNext = useCallback(() => { if (page < TOTAL_SPREADS) navigateTo((page + 1) as BookletPage); }, [page, navigateTo]);
  const goPrev = useCallback(() => { if (page > 0) navigateTo((page - 1) as BookletPage); }, [page, navigateTo]);

  const handleRestart = useCallback(() => {
    setRevealed([false, false, false, false]);
    setShowConfetti(false);
    navigateTo(0);
  }, [navigateTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const dur = reducedMotion ? 0 : TRANSITION_MS / 1000;
  const pageStyle = (angle: number) => ({
    transform: `rotateY(${angle}deg)`,
    transition: reducedMotion ? "none" : `transform ${dur}s cubic-bezier(0.645, 0.045, 0.355, 1.000)`,
  });

  const coverAngle = page >= 1 ? -180 : 0;
  const p1Angle = page >= 2 ? -180 : 0;
  const p2Angle = page >= 3 ? -180 : 0;

  return (
    <div className="booklet-scene" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-label="Graduation invitation booklet">
      <div className="booklet-wrap">
        <div className="booklet-spine" />
        <div className="booklet-shadow" />

        {/* Leaf 3 — Final page (always behind) */}
        <div className="booklet-leaf booklet-leaf--back" style={{ zIndex: 1 }}>
          <div className="leaf-front">
            <FinalPage revealed={revealed[3]} onRestart={handleRestart} />
            <GoldConfetti active={showConfetti} />
          </div>
          <div className="leaf-back page-ivory-back" />
        </div>

        {/* Leaf 2 — Event details */}
        <div className="booklet-leaf" style={{ zIndex: 2, ...pageStyle(p2Angle) }}>
          <div className="leaf-front">
            <EventDetailsPage revealed={revealed[2]} onCalendarClick={onCalendarClick} />
          </div>
          <div className="leaf-back page-ivory-back">
            <div className="leaf-back-paper-edge" />
          </div>
        </div>

        {/* Leaf 1 — Invitation */}
        <div className="booklet-leaf" style={{ zIndex: 3, ...pageStyle(p1Angle) }}>
          <div className="leaf-front">
            <InvitationPage displayName={displayName} revealed={revealed[1]} />
          </div>
          <div className="leaf-back page-ivory-back">
            <div className="leaf-back-paper-edge" />
          </div>
        </div>

        {/* Leaf 0 — Cover */}
        <div className="booklet-leaf booklet-leaf--cover" style={{ zIndex: 4, ...pageStyle(coverAngle) }}>
          <div className="leaf-front">
            <CoverPage onClick={() => page === 0 && !isAnimating && goNext()} />
          </div>
          <div className="leaf-back page-ivory-back inside-cover">
            <div className="inside-cover-content" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="booklet-nav" role="navigation" aria-label="Điều hướng thiệp">
        <button
          className={`nav-btn nav-btn--prev ${page === 0 ? "nav-btn--hidden" : ""}`}
          onClick={goPrev}
          disabled={isAnimating || page === 0}
          aria-label="Trang trước"
        >
          <ChevronLeft size={16} />
          <span className="nav-label">TRANG TRƯỚC</span>
        </button>

        <div className="page-indicator" aria-live="polite">
          <span className="page-ind-text">
            {page === 0 ? "BÌA" : `${String(page).padStart(2, "0")} / ${String(TOTAL_SPREADS).padStart(2, "0")}`}
          </span>
          <div className="page-dots">
            {([0, 1, 2, 3] as BookletPage[]).map((i) => (
              <button
                key={i}
                className={`page-dot ${page === i ? "page-dot--active" : ""}`}
                onClick={() => !isAnimating && navigateTo(i)}
                aria-label={`Trang ${i === 0 ? "bìa" : i}`}
              />
            ))}
          </div>
        </div>

        <button
          className={`nav-btn nav-btn--next ${page === TOTAL_SPREADS ? "nav-btn--hidden" : ""}`}
          onClick={goNext}
          disabled={isAnimating || page === TOTAL_SPREADS}
          aria-label="Trang tiếp"
        >
          <span className="nav-label">TRANG TIẾP</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ——— Main App —————————————————————————————————————————————

export default function App() {
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const userName = (() => {
    try {
      const p = new URLSearchParams(window.location.search).get("to");
      return p ? decodeURIComponent(p).trim() : "";
    } catch {
      return "";
    }
  })();

  const displayName = userName || "Bạn thân mến";

  const INVITATION_VIDEO_ID = "b0A0d_Q8I40";
  const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${INVITATION_VIDEO_ID}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${INVITATION_VIDEO_ID}&rel=0&modestbranding=1&iv_load_policy=3`;
  const SONG_TITLE = "#14 Happy Journey";
  const SONG_ARTIST = "Genshin Impact OST";

  const [isAudioOn, setIsAudioOn] = useState(true);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);

  const postYouTubeCommand = useCallback(
    (func: string, args: unknown[] = []) => {
      const pw = youtubePlayerRef.current?.contentWindow;
      if (!pw) return;
      pw.postMessage(JSON.stringify({ event: "command", func, args }), "*");
    },
    []
  );

  useEffect(() => {
    postYouTubeCommand(isAudioOn ? "unMute" : "mute");
    if (isAudioOn) postYouTubeCommand("playVideo");
  }, [isAudioOn, postYouTubeCommand]);

  const handleCalendarClick = useCallback(() => {
    const platform = detectPlatform();
    if (platform === "ios") {
      downloadIcs();
    } else if (platform === "android") {
      const gcalUrl = buildGoogleCalendarUrl();
      const intentUrl =
        `intent://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(EVENT_DETAILS.title)}` +
        `&dates=${EVENT_DETAILS.startUtc}/${EVENT_DETAILS.endUtc}` +
        `&details=${encodeURIComponent(EVENT_DETAILS.description)}` +
        `&location=${encodeURIComponent(EVENT_DETAILS.location)}` +
        `#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url=${encodeURIComponent(gcalUrl)};end`;
      window.location.href = intentUrl;
    } else {
      setShowCalendarModal(true);
    }
  }, []);

  return (
    <div className="min-h-screen w-full page-bg relative" style={{ color: "var(--ink)" }}>
      <PetalEffect />

      {/* —— Hidden YouTube audio player —— */}
      <iframe
        ref={youtubePlayerRef}
        title="Background music"
        src={YOUTUBE_EMBED_URL}
        className="fixed w-px h-px opacity-0 pointer-events-none"
        style={{ left: -9999, top: -9999 }}
        allow="autoplay; encrypted-media"
        onLoad={() => {
          postYouTubeCommand(isAudioOn ? "unMute" : "mute");
          postYouTubeCommand("playVideo");
        }}
      />

      {/* —— Music widget —— */}
      <div className="fixed top-5 right-5 z-50 music-widget overflow-hidden">
        <div className="flex items-center">
          <div className="px-4 py-2.5 flex items-center gap-3">
            <Music2 size={13} style={{ color: "var(--gold)" }} />
            <div className="leading-tight">
              <p className="text-[9px] font-medium tracking-[0.25em] uppercase" style={{ color: "rgba(214,180,119,0.6)" }}>Now Playing</p>
              <p className="text-[11px] font-medium max-w-[150px] truncate" style={{ color: "rgba(250,248,243,0.9)" }}>{SONG_TITLE}</p>
              <p className="text-[9px]" style={{ color: "rgba(250,248,243,0.45)" }}>{SONG_ARTIST}</p>
            </div>
          </div>
          <div className="w-px h-9" style={{ background: "rgba(214,180,119,0.18)" }} />
          <button
            onClick={() => setIsAudioOn((p) => !p)}
            className="px-3.5 py-2.5 flex flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
            aria-label={isAudioOn ? "Tắt nhạc" : "Bật nhạc"}
          >
            {isAudioOn
              ? <Volume2 size={14} style={{ color: "var(--gold)" }} />
              : <VolumeX size={14} style={{ color: "rgba(250,248,243,0.4)" }} />}
            <span className="text-[8px] tracking-widest font-medium" style={{ color: "rgba(250,248,243,0.5)" }}>
              {isAudioOn ? "TẮT" : "BẬT"}
            </span>
          </button>
        </div>
      </div>

      {/* —— Booklet —— */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <BookletViewer displayName={displayName} onCalendarClick={handleCalendarClick} />
      </div>

      {/* —— Calendar Modal —— */}
      <AnimatePresence>
        {showCalendarModal && (
          <CalendarModal onClose={() => setShowCalendarModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
