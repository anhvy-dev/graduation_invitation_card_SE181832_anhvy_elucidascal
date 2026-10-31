import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, User } from "lucide-react";

type WelcomeNameScreenProps = {
  initialName: string;
  onContinue: (name: string) => void;
  onSkip: () => void;
};

const AcademicSeal = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" stroke="#D6B477" strokeWidth="0.8" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="25" stroke="#D6B477" strokeWidth="0.5" opacity="0.6" />
    <text x="32" y="27" textAnchor="middle" fill="#D6B477" fontSize="7" fontFamily="serif" letterSpacing="1.5" opacity="0.9">FPT</text>
    <text x="32" y="37" textAnchor="middle" fill="#D6B477" fontSize="4.5" fontFamily="serif" letterSpacing="1" opacity="0.7">UNIVERSITY</text>
    <text x="32" y="46" textAnchor="middle" fill="#D6B477" fontSize="4" fontFamily="serif" letterSpacing="0.5" opacity="0.6">2026</text>
    <path d="M20 49 Q32 53 44 49" stroke="#D6B477" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);

export function WelcomeNameScreen({
  initialName,
  onContinue,
  onSkip,
}: WelcomeNameScreenProps) {
  const [nameInput, setNameInput] = useState(initialName || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim().replace(/[<>]/g, "");
    if (!trimmed) {
      setError("Vui lòng nhập tên của bạn để tiếp tục.");
      return;
    }
    if (trimmed.length > 50) {
      setError("Tên không nên vượt quá 50 ký tự.");
      return;
    }
    onContinue(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 page-bg overflow-y-auto">
      <div className="film-grain pointer-events-none" aria-hidden="true" />

      {/* Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #D6B477 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ scale: 0.92, y: 18, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: -16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative z-10 w-full max-w-md p-7 sm:p-9 rounded-2xl shadow-2xl text-center text-slate-800"
        style={{
          background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)",
          border: "1px solid rgba(214,180,119,0.45)",
          boxShadow: "0 25px 60px -15px rgba(13,26,43,0.35), 0 0 0 1px rgba(214,180,119,0.25)",
        }}
      >
        {/* Academic Seal */}
        <div className="flex justify-center mb-3">
          <AcademicSeal size={52} />
        </div>

        <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "var(--gold)" }}>
          LỄ TỐT NGHIỆP · NIÊN KHÓA 2026
        </p>

        <h1 className="mt-1 text-2xl sm:text-3xl font-serif italic text-navy" style={{ color: "var(--navy)" }}>
          Vy Anh
        </h1>

        <div className="w-12 h-px mx-auto my-3" style={{ background: "rgba(214,180,119,0.5)" }} />

        <div className="mb-5 space-y-1">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center justify-center gap-1.5">
            <Sparkles size={14} style={{ color: "var(--gold)" }} />
            <span>Nhận Thiệp Mời Của Riêng Bạn</span>
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Vui lòng nhập họ tên hoặc biệt danh để tên bạn được in trang trọng trên thiệp mời tốt nghiệp:
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={15} />
              </span>
              <input
                type="text"
                autoFocus
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ví dụ: Minh Anh, Hoàng Nam, Chị Mai..."
                maxLength={50}
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                style={{ borderColor: "rgba(214,180,119,0.5)" }}
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 mt-1.5 pl-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-5 rounded-xl font-semibold text-xs uppercase tracking-widest text-white shadow-md flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-98 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #1A365D 0%, #0D1A2B 100%)",
              border: "1px solid rgba(214,180,119,0.45)",
            }}
          >
            <span>VÀO XEM THIỆP MỜI</span>
            <ArrowRight size={14} style={{ color: "var(--gold)" }} />
          </button>
        </form>

        {/* Skip button */}
        <div className="mt-4 pt-2 border-t border-slate-200/60">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
          >
            Bỏ qua &amp; Xem với tư cách Khách ›
          </button>
        </div>
      </motion.div>
    </div>
  );
}
