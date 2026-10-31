import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Music2,
  Volume2,
  VolumeX,
  Download,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { CinematicIntro } from "./components/CinematicIntro";
import { BookletViewer, type BookletViewerHandle } from "./components/BookletViewer";
import { RSVPModal } from "./components/RSVPModal";
import { NameEntryModal } from "./components/NameEntryModal";
import { WelcomeNameScreen } from "./components/WelcomeNameScreen";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { trackInvitationVisit } from "./lib/tracking";

const STORAGE_KEY_PUBLIC_NAME = "graduation_public_visitor_name";

/**
 * Safely extracts, decodes, and validates the recipient name from URL query parameter "to".
 * Returns null if the parameter is absent, empty, or invalid (triggering fallback to Mode 1).
 */
export function parseRecipientFromUrl(
  search: string = typeof window !== "undefined" ? window.location.search : ""
): string | null {
  try {
    const params = new URLSearchParams(search);
    const raw = params.get("to");
    if (!raw) return null;
    const decoded = decodeURIComponent(raw).trim();
    if (decoded.length === 0 || decoded.length > 60) return null;
    // Sanitize: strip any potential control characters or tags while preserving Vietnamese unicode
    const sanitized = decoded.replace(/[<>]/g, "").trim();
    return sanitized.length > 0 ? sanitized : null;
  } catch {
    return null;
  }
}

const EVENT_DETAILS = {
  title: "Lễ Tốt Nghiệp - Vy Anh | FPT University HCMC",
  description: "Lễ kỷ niệm Niên khóa 2026 – Đại học FPT, TP. Hồ Chí Minh",
  location: "FPT University, Ho Chi Minh City, Vietnam",
  startUtc: "20261107T093000Z",
  endUtc: "20261107T133000Z",
  startLocal: "20261107T163000",
  endLocal: "20261107T203000",
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
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Graduation Invite//SE181832//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${startLocal}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${endLocal}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
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

const PetalEffect = ({ reducedMotion }: { reducedMotion: boolean }) => {
  if (reducedMotion) return null;
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
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        aria-label="Đóng"
      >
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
        <button
          onClick={() => {
            downloadIcs();
            onClose();
          }}
          className="cal-option"
        >
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
        07 · 11 · 2026 &nbsp;·&nbsp; 16:30 ICT
      </p>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);

  const reducedMotion = useReducedMotion();
  const [introKey, setIntroKey] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const showIntro = introVisible && !reducedMotion;
  const bookletRef = useRef<BookletViewerHandle>(null);
  const [bookStage, setBookStage] = useState<HTMLDivElement | null>(null);
  const bookStageRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setBookStage(node);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // INVITATION MODE RESOLUTION
  // Mode 2 (Personalized): ?to=Name in URL takes strict precedence.
  // Mode 1 (Public): No URL name. Reads/saves in localStorage.
  // ─────────────────────────────────────────────────────────────────
  const [urlRecipient] = useState<string | null>(() => parseRecipientFromUrl());
  const isPersonalizedMode = urlRecipient !== null;
  const mode: "public" | "personalized" = isPersonalizedMode ? "personalized" : "public";

  // Saved name in localStorage (used exclusively for Mode 1 - never overwritten by Mode 2)
  const [savedPublicName, setSavedPublicName] = useState<string>(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY_PUBLIC_NAME);
      return val ? val.trim() : "";
    } catch {
      return "";
    }
  });

  const handleSavePublicName = useCallback((name: string) => {
    const clean = name.trim();
    setSavedPublicName(clean);
    try {
      localStorage.setItem(STORAGE_KEY_PUBLIC_NAME, clean);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleClearPublicName = useCallback(() => {
    setSavedPublicName("");
    try {
      localStorage.removeItem(STORAGE_KEY_PUBLIC_NAME);
    } catch {
      // Ignore
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // UPFRONT NAME ENTRY (Before intro, so name is ready on Page 1)
  // ─────────────────────────────────────────────────────────────────
  const [hasCompletedUpfront, setHasCompletedUpfront] = useState(() => {
    try {
      // If personalized mode, or visiting with ?guest=true, or already completed in this session
      return (
        isPersonalizedMode ||
        new URLSearchParams(window.location.search).get("guest") === "true" ||
        sessionStorage.getItem("graduation_upfront_done") === "1"
      );
    } catch {
      return isPersonalizedMode;
    }
  });

  // Compute final display name
  // Mode 2: URL recipient strictly takes precedence!
  // Mode 1: Saved public name -> default generic "Bạn thân mến"
  const displayName = isPersonalizedMode
    ? urlRecipient!
    : savedPublicName || "Bạn thân mến";

  // Track visit (deduplicated, distinguishing public from personalized link labels)
  useEffect(() => {
    trackInvitationVisit(mode, isPersonalizedMode ? urlRecipient! : undefined);
  }, [mode, isPersonalizedMode, urlRecipient]);

  // ─────────────────────────────────────────────────────────────────
  // AUDIO CONTROLS
  // ─────────────────────────────────────────────────────────────────
  const INVITATION_VIDEO_ID = "5be9O0qskqU";
  const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${INVITATION_VIDEO_ID}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${INVITATION_VIDEO_ID}&rel=0&modestbranding=1&iv_load_policy=3`;
  const SONG_TITLE = "When the Flowers";
  const SONG_ARTIST = "TeamMusicCreative";

  const [isAudioOn, setIsAudioOn] = useState(true);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);

  const postYouTubeCommand = useCallback((func: string, args: unknown[] = []) => {
    const pw = youtubePlayerRef.current?.contentWindow;
    if (!pw) return;
    pw.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  }, []);

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

  const dismissIntro = useCallback(() => {
    setIntroVisible(false);
  }, []);

  const handleOpenBook = useCallback(() => {
    setIntroVisible(false);
    bookletRef.current?.openCover();
    if (isAudioOn) {
      postYouTubeCommand("unMute");
      postYouTubeCommand("playVideo");
    }
  }, [isAudioOn, postYouTubeCommand]);

  const handleRestartExperience = useCallback(() => {
    bookletRef.current?.goToStart();
    setIntroVisible(true);
    setIntroKey((k) => k + 1);
  }, []);

  // If in public mode and haven't completed upfront name entry, show the welcoming name card first!
  if (!hasCompletedUpfront) {
    return (
      <WelcomeNameScreen
        initialName={savedPublicName}
        onContinue={(name) => {
          handleSavePublicName(name);
          try {
            sessionStorage.setItem("graduation_upfront_done", "1");
          } catch {
            // Ignore
          }
          setHasCompletedUpfront(true);
        }}
        onSkip={() => {
          try {
            sessionStorage.setItem("graduation_upfront_done", "1");
          } catch {
            // Ignore
          }
          setHasCompletedUpfront(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full page-bg relative" style={{ color: "var(--ink)" }}>
      <div className="film-grain" aria-hidden="true" />
      <PetalEffect reducedMotion={reducedMotion} />

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

      {/* Music Widget */}
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
            className="px-3.5 py-2.5 flex flex-col items-center gap-0.5 transition-opacity hover:opacity-80 cursor-pointer"
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

      {/* Booklet Stage */}
      <div
        ref={bookStageRef}
        className={`book-stage relative z-10 flex items-center justify-center min-h-screen px-4 py-20${showIntro ? " is-intro" : ""}`}
      >
        <BookletViewer
          ref={bookletRef}
          displayName={displayName}
          onCalendarClick={handleCalendarClick}
          onRsvpClick={() => setShowRsvpModal(true)}
          onRestartExperience={handleRestartExperience}
          interactive={!showIntro}
          onOpenNameModal={!isPersonalizedMode ? () => setShowNameModal(true) : undefined}
          hasCustomName={!isPersonalizedMode && Boolean(savedPublicName)}
        />
      </div>

      {/* Cinematic Intro */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            key={introKey}
            bookStage={bookStage}
            reducedMotion={reducedMotion}
            replay={introKey > 0}
            onOpen={handleOpenBook}
            onDismiss={dismissIntro}
          />
        )}
      </AnimatePresence>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <CalendarModal onClose={() => setShowCalendarModal(false)} />
        )}
      </AnimatePresence>

      {/* RSVP Modal */}
      <AnimatePresence>
        {showRsvpModal && (
          <RSVPModal
            isOpen={showRsvpModal}
            onClose={() => setShowRsvpModal(false)}
            recipientName={displayName}
            prefillVisitorName={isPersonalizedMode ? urlRecipient! : savedPublicName}
            invitationMode={mode}
          />
        )}
      </AnimatePresence>

      {/* Mode 1: Name Entry Modal (For editing name anytime later) */}
      <AnimatePresence>
        {showNameModal && (
          <NameEntryModal
            isOpen={showNameModal}
            onClose={() => setShowNameModal(false)}
            currentName={savedPublicName}
            onSaveName={handleSavePublicName}
            onClearName={handleClearPublicName}
          />
        )}
      </AnimatePresence>

      {/* Mode 1: Floating Action Button "Tên bạn: [Tên]" (Allows editing/clearing name during viewing) */}
      {!isPersonalizedMode && !showIntro && (
        <aside
          aria-label="Cá nhân hóa thiệp mời"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-2xl transition-all"
          style={{
            background: "rgba(20, 36, 58, 0.90)",
            border: "1px solid rgba(214, 180, 119, 0.35)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            type="button"
            onClick={() => setShowNameModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-[#FAF8F3] hover:text-[#D6B477] transition-all cursor-pointer"
          >
            <Sparkles size={12} style={{ color: "var(--gold)" }} />
            <span>
              {savedPublicName ? `Tên bạn: ${savedPublicName} (Chỉnh sửa)` : "Ghi tên của bạn ✨"}
            </span>
          </button>
        </aside>
      )}
    </div>
  );
}
