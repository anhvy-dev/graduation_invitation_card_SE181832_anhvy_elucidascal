import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Check, Trash2 } from "lucide-react";

type NameEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
  onClearName: () => void;
};

const AcademicSeal = ({ size = 42 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" stroke="#D6B477" strokeWidth="0.8" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="25" stroke="#D6B477" strokeWidth="0.5" opacity="0.6" />
    <text x="32" y="27" textAnchor="middle" fill="#D6B477" fontSize="7" fontFamily="serif" letterSpacing="1.5" opacity="0.9">FPT</text>
    <text x="32" y="37" textAnchor="middle" fill="#D6B477" fontSize="4.5" fontFamily="serif" letterSpacing="1" opacity="0.7">UNIVERSITY</text>
    <text x="32" y="46" textAnchor="middle" fill="#D6B477" fontSize="4" fontFamily="serif" letterSpacing="0.5" opacity="0.6">2026</text>
    <path d="M20 49 Q32 53 44 49" stroke="#D6B477" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);

export function NameEntryModal({
  isOpen,
  onClose,
  currentName,
  onSaveName,
  onClearName,
}: NameEntryModalProps) {
  const [nameInput, setNameInput] = useState(currentName || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNameInput(currentName || "");
      setError(null);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim().replace(/[<>]/g, "");
    if (!trimmed) {
      setError("Vui lòng nhập tên của bạn.");
      return;
    }
    if (trimmed.length > 50) {
      setError("Tên không nên vượt quá 50 ký tự.");
      return;
    }
    onSaveName(trimmed);
    onClose();
  };

  const handleClear = () => {
    onClearName();
    setNameInput("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="name-entry-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6"
        style={{ background: "rgba(13,26,43,0.78)", backdropFilter: "blur(10px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl text-slate-800"
          style={{
            background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)",
            border: "1px solid rgba(214,180,119,0.4)",
            boxShadow: "0 25px 50px -12px rgba(13,26,43,0.45), 0 0 0 1px rgba(214,180,119,0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="flex justify-center mb-2">
              <AcademicSeal size={42} />
            </div>
            <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "var(--gold)" }}>
              CÁ NHÂN HÓA THIỆP MỜI
            </p>
            <h2 className="text-xl sm:text-2xl font-serif italic text-navy mt-1" style={{ color: "var(--navy)" }}>
              Ghi Tên Của Bạn ✨
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
              Tên bạn sẽ xuất hiện trang trọng trên thiệp mời và được tự động điền sẵn khi bạn gửi xác nhận tham dự (RSVP).
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Họ và tên hoặc biệt danh của bạn
              </label>
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
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                style={{ borderColor: "rgba(214,180,119,0.5)" }}
              />
              {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-widest text-white shadow-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #1A365D 0%, #0D1A2B 100%)",
                  border: "1px solid rgba(214,180,119,0.4)",
                }}
              >
                <Check size={14} style={{ color: "var(--gold)" }} />
                <span>LƯU TÊN CỦA BẠN</span>
              </button>

              {currentName && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Xóa tên đã lưu &amp; Dùng lời chào mặc định</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              Tên được lưu an toàn trên trình duyệt của bạn và có thể chỉnh sửa bất cứ lúc nào.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
