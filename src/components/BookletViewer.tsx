import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { PageFlip } from "page-flip";
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fireGraduationConfetti, resetGraduationConfetti } from "../lib/celebration";
import { playPageReveal, resetPageReveals } from "../lib/pageReveal";
import { useReducedMotion } from "../hooks/useReducedMotion";

type BookletPage = 0 | 1 | 2 | 3;
const LAST_PAGE = 3;
const PHOTOS = {
  look: "/assets/look.png",
  campus: "/assets/SHHH.jpg",
  diploma: "/assets/SE181832_1.jpg",
};

export type BookletViewerHandle = {
  openCover: () => void;
  goToStart: () => void;
};

type FlipState = "user_fold" | "fold_corner" | "flipping" | "read";

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

const CoverPage = () => (
  <div className="booklet-page booklet-cover">
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
    <div className="cover-gold-sweep" aria-hidden="true">
      <span className="cover-sweep-beam" />
    </div>
  </div>
);

const InvitationPage = ({ displayName }: { displayName: string }) => (
  <div className="booklet-page page-ivory">
    <div className="page-top-line" />
    <div className="flex flex-col items-center h-full px-7 pt-6 pb-5">
      <div className="w-full text-center">
        <div className="reveal-mask reveal-mask--block">
          <p className="page-eyebrow mb-3" data-reveal="mask">TRÂN TRỌNG KÍNH MỜI</p>
        </div>
        <div className="page-gold-rule mb-4" data-reveal="line" />
      </div>
      <div className="reveal-mask reveal-mask--block mb-3">
        <h2 className="recipient-name text-center" data-reveal="mask">{displayName}</h2>
      </div>
      <figure className="photo-frame photo-frame--invite" data-reveal="frame">
        <div className="photo-frame-clip" data-reveal="photo">
          <img src={PHOTOS.look} alt="Vy Anh in graduation attire" decoding="async" draggable={false} fetchPriority="high" style={{ objectPosition: "center 12%" }} />
        </div>
      </figure>
      <p className="invitation-body mt-4" data-reveal="line">
        Cảm ơn bạn đã là một phần trong hành trình của mình. Sự hiện diện của bạn sẽ khiến ngày đặc biệt này trở nên trọn vẹn hơn.
      </p>
      <div className="w-full mt-auto" data-reveal="line">
        <div className="page-gold-rule mt-4" />
        <p className="page-number-label mt-3">01 / 03</p>
      </div>
    </div>
  </div>
);

const EventDetailsPage = ({ onCalendarClick }: { onCalendarClick: () => void }) => (
  <div className="booklet-page page-ivory">
    <div className="page-top-line" />
    <div className="flex flex-col h-full px-7 pt-6 pb-5">
      <div>
        <div className="reveal-mask reveal-mask--block">
          <p className="page-eyebrow mb-3 text-center" data-reveal="mask">THÔNG TIN SỰ KIỆN</p>
        </div>
        <div className="page-gold-rule mb-4" data-reveal="line" />
      </div>
      <figure className="photo-frame photo-frame--campus" data-reveal="frame">
        <div className="photo-frame-clip" data-reveal="photo">
          <img src={PHOTOS.campus} alt="Graduation portrait at the campus gardens" loading="lazy" decoding="async" draggable={false} style={{ objectPosition: "center 35%" }} />
        </div>
      </figure>
      <div className="detail-row mb-4 mt-4" data-reveal="line">
        <div className="detail-icon-wrap">
          <Calendar size={13} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <p className="detail-label-sm">NGÀY</p>
          <p className="detail-date">15.11.2026</p>
          <p className="detail-sub">Chủ Nhật · 08:00 ICT</p>
        </div>
      </div>
      <div className="thin-divider mb-4" />
      <div className="detail-row mb-2" data-reveal="line">
        <div className="detail-icon-wrap">
          <MapPin size={13} style={{ color: "var(--gold)" }} />
        </div>
        <div className="flex-1">
          <p className="detail-label-sm">ĐỊA ĐIỂM</p>
          <p className="detail-venue">Đại học FPT</p>
          <p className="detail-sub">TP. Hồ Chí Minh</p>
        </div>
        <a href="https://www.google.com/maps/search/?api=1&query=FPT+University+HCMC" target="_blank" rel="noopener noreferrer" className="map-link self-end">BẢN ĐỒ ↗</a>
      </div>
      <div className="thin-divider mb-4" />
      <div className="mt-auto" data-reveal="line">
        <button id="btn-confirm-attendance" className="cta-btn w-full mb-2" type="button" onClick={onCalendarClick}>
          <Calendar size={14} style={{ opacity: 0.7 }} />
          Lưu lịch tham dự
        </button>
        <p className="page-number-label text-center mt-2">02 / 03</p>
      </div>
    </div>
  </div>
);

const FinalPage = ({ onRestart }: { onRestart: () => void }) => (
  <div className="booklet-page page-navy final-page">
    <div className="page-top-line-gold" />
    <div className="flex flex-col items-center h-full px-7 pt-6 pb-6">
      <div className="w-full text-center" data-reveal="line">
        <AcademicSeal size={40} />
      </div>
      <figure className="photo-frame photo-frame--diploma" data-reveal="frame">
        <div className="photo-frame-clip" data-reveal="photo">
          <img src={PHOTOS.diploma} alt="Vy Anh holding a graduation diploma" loading="lazy" decoding="async" draggable={false} style={{ objectPosition: "center 18%" }} />
        </div>
      </figure>
      <p className="final-quote-vi text-center mt-3" data-reveal="line">
        "Dù bạn đã đồng hành cùng mình ở chặng đường nào, mình luôn trân trọng sự hiện diện của bạn trong hành trình trưởng thành này."
      </p>
      <div className="w-full text-center mt-auto">
        <div className="cover-gold-rule mb-4" style={{ opacity: 0.35 }} data-reveal="line" />
        <div className="reveal-mask reveal-mask--block">
          <p className="final-with-gratitude" data-reveal="mask">WITH GRATITUDE</p>
        </div>
        <div className="signature-glow-wrap">
          <span className="signature-glow" aria-hidden="true" />
          <div className="reveal-mask reveal-mask--block">
            <p className="final-signature" data-reveal="mask">VY ANH</p>
          </div>
        </div>
        <p className="final-class" data-reveal="line">CLASS OF 2026</p>
        <p className="page-number-label-light mt-3" data-reveal="line">03 / 03</p>
        <button onClick={onRestart} className="restart-btn mt-4" type="button" aria-label="Xem lại từ đầu">
          ↺ Xem lại
        </button>
      </div>
    </div>
  </div>
);

type FlipBookEngineProps = {
  displayName: string;
  reducedMotion: boolean;
  onCalendarClick: () => void;
  onRestart: () => void;
  onPage: (page: BookletPage) => void;
  onAnimating: (busy: boolean) => void;
  onBound: (book: PageFlip | null) => void;
};

const FlipBookEngine = memo(function FlipBookEngine({
  displayName,
  reducedMotion,
  onCalendarClick,
  onRestart,
  onPage,
  onAnimating,
  onBound,
}: FlipBookEngineProps) {
  const bookElRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef<Set<number>>(new Set());
  const confettiRef = useRef(false);
  const lastIndexRef = useRef(0);

  useLayoutEffect(() => {
    const el = bookElRef.current;
    if (!el) return;

    // Clean up any stale wrappers if left behind
    el.querySelectorAll(".stf__wrapper, .stf__block").forEach((node) => {
      node.querySelectorAll(".flip-page").forEach((p) => el.appendChild(p));
      node.remove();
    });

    const pages = el.querySelectorAll<HTMLElement>(".flip-page");
    if (!pages || pages.length < 2) return;

    const pageFlip = new PageFlip(el, {
      width: 390,
      height: 560,
      size: "stretch",
      minWidth: 280,
      maxWidth: 440,
      minHeight: 460,
      maxHeight: 640,
      showCover: true,
      drawShadow: true,
      flippingTime: reducedMotion ? 1 : 1000,
      usePortrait: true,
      startZIndex: 2,
      autoSize: true,
      maxShadowOpacity: 0.42,
      mobileScrollSupport: true,
      swipeDistance: 36,
      clickEventForward: true,
      useMouseEvents: true,
      disableFlipByClick: false,
    });

    const settle = (idx: number) => {
      onPage(idx as BookletPage);
      if (idx === 0) {
        revealedRef.current = new Set();
        confettiRef.current = false;
        lastIndexRef.current = 0;
        resetPageReveals(el);
        resetGraduationConfetti();
        return;
      }
      if (revealedRef.current.has(idx)) return;
      revealedRef.current.add(idx);
      const direction = idx >= lastIndexRef.current ? 1 : -1;
      lastIndexRef.current = idx;
      playPageReveal(el, idx, reducedMotion, direction);
      if (idx === LAST_PAGE && !confettiRef.current) {
        confettiRef.current = true;
        if (!reducedMotion) window.setTimeout(() => fireGraduationConfetti(), 680);
      }
    };

    pageFlip.on("changeState", (e) => {
      const state = e.data as FlipState;
      onAnimating(state !== "read");
      if (state === "read") {
        settle(pageFlip.getCurrentPageIndex());
      }
    });

    pageFlip.on("flip", (e) => {
      onPage(Number(e.data) as BookletPage);
    });

    try {
      pageFlip.loadFromHTML(pages);
      onBound(pageFlip);
    } catch (err) {
      console.error("Error loading flip book:", err);
    }

    return () => {
      onBound(null);
      resetPageReveals(el);
      try {
        pages.forEach((p) => {
          if (p && el) el.appendChild(p);
        });
        pageFlip.destroy();
      } catch {
        /* already removed */
      }
    };
  }, [displayName, reducedMotion, onCalendarClick, onRestart, onPage, onAnimating, onBound]);

  return (
    <div className="flip-book-host">
      <div ref={bookElRef} className="flip-book">
        <div className="flip-page" data-density="hard" data-flip-index="0">
          <CoverPage />
        </div>
        <div className="flip-page" data-flip-index="1">
          <InvitationPage displayName={displayName} />
        </div>
        <div className="flip-page" data-flip-index="2">
          <EventDetailsPage onCalendarClick={onCalendarClick} />
        </div>
        <div className="flip-page" data-density="hard" data-flip-index="3">
          <FinalPage onRestart={onRestart} />
        </div>
      </div>
    </div>
  );
}, () => true);

type BookletViewerProps = {
  displayName: string;
  onCalendarClick: () => void;
  onRestartExperience: () => void;
  interactive?: boolean;
};

export const BookletViewer = forwardRef<BookletViewerHandle, BookletViewerProps>(
  function BookletViewer(
    { displayName, onCalendarClick, onRestartExperience, interactive = true },
    ref
  ) {
    const reducedMotion = useReducedMotion();
    const flipRef = useRef<PageFlip | null>(null);
    const [page, setPage] = useState<BookletPage>(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const onPage = useCallback((next: BookletPage) => setPage(next), []);
    const onAnimating = useCallback((busy: boolean) => setIsAnimating(busy), []);
    const onBound = useCallback((book: PageFlip | null) => {
      flipRef.current = book;
    }, []);

    useImperativeHandle(ref, () => ({
      openCover: () => {
        const book = flipRef.current;
        if (!book) return;
        if (book.getCurrentPageIndex() === 0) book.flipNext();
      },
      goToStart: () => {
        setPage(0);
        flipRef.current?.flip(0);
      },
    }), []);

    const goNext = useCallback(() => {
      if (!interactive || isAnimating || page >= LAST_PAGE) return;
      flipRef.current?.flipNext();
    }, [interactive, isAnimating, page]);

    const goPrev = useCallback(() => {
      if (!interactive || isAnimating || page <= 0) return;
      flipRef.current?.flipPrev();
    }, [interactive, isAnimating, page]);

    const goTo = useCallback((target: BookletPage) => {
      if (!interactive || isAnimating || target === page) return;
      flipRef.current?.flip(target);
    }, [interactive, isAnimating, page]);

    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [goNext, goPrev]);

    return (
      <div className="booklet-scene" aria-label="Graduation invitation booklet">
        <div className="flip-book-shell">
          <FlipBookEngine
            displayName={displayName}
            reducedMotion={reducedMotion}
            onCalendarClick={onCalendarClick}
            onRestart={onRestartExperience}
            onPage={onPage}
            onAnimating={onAnimating}
            onBound={onBound}
          />
        </div>

        <div className="booklet-nav" role="navigation" aria-label="Điều hướng thiệp">
          <button
            className={`nav-btn nav-btn--prev ${page === 0 ? "nav-btn--hidden" : ""}`}
            onClick={goPrev}
            disabled={!interactive || isAnimating || page === 0}
            aria-label="Trang trước"
            type="button"
          >
            <ChevronLeft size={16} />
            <span className="nav-label">TRANG TRƯỚC</span>
          </button>

          <div className="page-indicator" aria-live="polite">
            <span className="page-ind-text">
              {page === 0 ? "BÌA" : `${String(page).padStart(2, "0")} / 03`}
            </span>
            <div className="page-dots">
              {([0, 1, 2, 3] as BookletPage[]).map((i) => (
                <button
                  key={i}
                  className={`page-dot ${page === i ? "page-dot--active" : ""}`}
                  onClick={() => goTo(i)}
                  disabled={!interactive}
                  aria-label={`Trang ${i === 0 ? "bìa" : i}`}
                  type="button"
                />
              ))}
            </div>
          </div>

          <button
            className={`nav-btn nav-btn--next ${page === LAST_PAGE ? "nav-btn--hidden" : ""}`}
            onClick={goNext}
            disabled={!interactive || isAnimating || page === LAST_PAGE}
            aria-label="Trang tiếp"
            type="button"
          >
            <span className="nav-label">TRANG TIẾP</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }
);
