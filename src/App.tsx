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
} from "lucide-react";
import { CinematicIntro } from "./components/CinematicIntro";
import { BookletViewer, type BookletViewerHandle } from "./components/BookletViewer";
import { RSVPModal } from "./components/RSVPModal";
import { useReducedMotion } from "./hooks/useReducedMotion";
import {
  loginWithFacebook,
  verifyFacebookTokenOnServer,
  redirectToFacebookOAuth,
  handleOAuthRedirectCallback,
} from "./lib/facebookSdk";
import type { FacebookUserProfile } from "./types/facebook";

const FacebookIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

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
        07 · 11 · 2026 &nbsp;·&nbsp; 16:30 ICT
      </p>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
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

  // Upfront Facebook User state (persisted in localStorage)
  const [fbUser, setFbUser] = useState<FacebookUserProfile | null>(() => {
    try {
      const cached = localStorage.getItem("graduation_fb_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoggingInFb, setIsLoggingInFb] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [skipRedirect, setSkipRedirect] = useState(() => {
    try {
      return (
        sessionStorage.getItem("fb_skip_auth") === "1" ||
        new URLSearchParams(window.location.search).get("guest") === "true"
      );
    } catch {
      return false;
    }
  });

  // Handle upfront auto-redirect to Facebook OAuth or OAuth callback
  useEffect(() => {
    let alive = true;

    async function checkAuthFlow() {
      // 1. Check if returning from Facebook OAuth redirect with access_token
      const result = await handleOAuthRedirectCallback();
      if (result.handled) {
        if (result.user && alive) {
          setFbUser(result.user);
        } else if (result.error && alive) {
          setSkipRedirect(true);
        }
        if (alive) setIsCheckingAuth(false);
        return;
      }

      // 2. If already logged in from previous visit
      if (fbUser) {
        if (alive) setIsCheckingAuth(false);
        return;
      }

      // 3. If user clicked skip or has guest mode param
      if (skipRedirect) {
        if (alive) setIsCheckingAuth(false);
        return;
      }

      // 4. Directly redirect to Facebook OAuth dialog!
      redirectToFacebookOAuth();
    }

    checkAuthFlow();

    return () => {
      alive = false;
    };
  }, [fbUser, skipRedirect]);

  const handleSkipAuth = () => {
    sessionStorage.setItem("fb_skip_auth", "1");
    setSkipRedirect(true);
    setIsCheckingAuth(false);
  };

  const userName = (() => {
    try {
      const p = new URLSearchParams(window.location.search).get("to");
      return p ? decodeURIComponent(p).trim() : "";
    } catch {
      return "";
    }
  })();

  // Priority: Facebook logged-in name -> URL query param (?to=...) -> "Bạn thân mến"
  const displayName = fbUser?.name || userName || "Bạn thân mến";

  const handleFacebookLogin = useCallback(async () => {
    setIsLoggingInFb(true);
    try {
      const res = await loginWithFacebook();
      if (res.success && res.user) {
        setFbUser(res.user);
        try {
          localStorage.setItem("graduation_fb_user", JSON.stringify(res.user));
        } catch {
          // Ignore
        }

        // Smoothly open cover to Page 1 so visitor immediately sees their personalized name
        setTimeout(() => {
          bookletRef.current?.openCover();
        }, 350);

        if (res.accessToken) {
          verifyFacebookTokenOnServer(res.accessToken, res.user.id).catch(console.warn);
        }
      }
    } catch (err) {
      console.error("[FB Login Error]", err);
    } finally {
      setIsLoggingInFb(false);
    }
  }, []);

  const INVITATION_VIDEO_ID = "5be9O0qskqU";
  const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${INVITATION_VIDEO_ID}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${INVITATION_VIDEO_ID}&rel=0&modestbranding=1&iv_load_policy=3`;
  const SONG_TITLE = "When the Flowers";
  const SONG_ARTIST = "TeamMusicCreative";

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

  const isReturningFromOAuth =
    typeof window !== "undefined" && window.location.hash.includes("access_token");

  if (!fbUser && !skipRedirect) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 page-bg text-center relative z-50">
        <div className="film-grain" aria-hidden="true" />
        <div
          className="relative z-10 max-w-sm w-full p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center"
          style={{
            background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)",
            border: "1px solid rgba(214,180,119,0.4)",
            boxShadow: "0 25px 60px -15px rgba(13,26,43,0.5), 0 0 0 1px rgba(214,180,119,0.25)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(214,180,119,0.12)" }}
          >
            <AcademicSeal size={48} />
          </div>

          <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "var(--gold)" }}>
            LỄ TỐT NGHIỆP · NIÊN KHÓA 2026
          </p>
          <h1 className="mt-1 text-2xl font-serif italic" style={{ color: "var(--navy)" }}>
            Vy Anh
          </h1>
          <div className="w-12 h-px my-3" style={{ background: "rgba(214,180,119,0.5)" }} />

          <div className="mt-4 flex items-center justify-center gap-2 text-blue-700">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-semibold">
              {isReturningFromOAuth
                ? "Đang xác thực thông tin từ Facebook..."
                : "Đang chuyển hướng sang Facebook..."}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-2">
            Tự động lấy thông tin từ Facebook để cá nhân hóa thiệp mời.
          </p>

          <button
            type="button"
            onClick={handleSkipAuth}
            className="text-xs text-slate-400 hover:text-slate-700 underline mt-6 cursor-pointer"
          >
            Bỏ qua &amp; Xem thiệp với tư cách Khách ›
          </button>
        </div>
      </div>
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
          fbUser={fbUser}
          onFacebookLogin={handleFacebookLogin}
          isLoggingInFb={isLoggingInFb}
        />
      </div>

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

      <AnimatePresence>
        {showCalendarModal && (
          <CalendarModal onClose={() => setShowCalendarModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRsvpModal && (
          <RSVPModal
            isOpen={showRsvpModal}
            onClose={() => setShowRsvpModal(false)}
            recipientName={displayName}
            fbUser={fbUser}
            onSetFbUser={setFbUser}
          />
        )}
      </AnimatePresence>

      {/* Floating upfront Facebook Login Banner (if not logged in and intro finished) */}
      {!fbUser && !showIntro && (
        <aside
          aria-label="Cá nhân hóa thiệp mời"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 entrance-fb-banner flex items-center gap-2.5 px-4 py-2 rounded-full shadow-2xl"
        >
          <span className="text-[11px] font-medium text-slate-200 hidden sm:inline">
            🎓 Nhận thiệp mang tên bạn:
          </span>
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isLoggingInFb}
            className="entrance-fb-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow transition-all hover:brightness-110 active:scale-95"
          >
            <FacebookIcon size={13} />
            <span>{isLoggingInFb ? "Đang kết nối..." : "Đăng nhập Facebook"}</span>
          </button>
        </aside>
      )}
    </div>
  );
}
