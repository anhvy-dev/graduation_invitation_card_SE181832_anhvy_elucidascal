import { useState, useEffect, type FormEvent } from "react";
import { motion } from "motion/react";
import { X, CheckCircle, Users, MessageSquare, Send, Sparkles } from "lucide-react";
import { loginWithFacebook, verifyFacebookTokenOnServer } from "../lib/facebookSdk";
import type { FacebookUserProfile } from "../types/facebook";
import { fireGraduationConfetti } from "../lib/celebration";

type RSVPModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  fbUser?: FacebookUserProfile | null;
  onSetFbUser?: (user: FacebookUserProfile | null) => void;
};

type AttendanceStatus = "attending" | "declined";

const AcademicSeal = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" stroke="#D6B477" strokeWidth="0.8" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="25" stroke="#D6B477" strokeWidth="0.5" opacity="0.6" />
    <text x="32" y="27" textAnchor="middle" fill="#D6B477" fontSize="7" fontFamily="serif" letterSpacing="1.5" opacity="0.9">FPT</text>
    <text x="32" y="37" textAnchor="middle" fill="#D6B477" fontSize="4.5" fontFamily="serif" letterSpacing="1" opacity="0.7">UNIVERSITY</text>
    <text x="32" y="46" textAnchor="middle" fill="#D6B477" fontSize="4" fontFamily="serif" letterSpacing="0.5" opacity="0.6">2026</text>
    <path d="M20 49 Q32 53 44 49" stroke="#D6B477" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export function RSVPModal({
  isOpen,
  onClose,
  recipientName,
  fbUser: externalFbUser,
  onSetFbUser,
}: RSVPModalProps) {
  // Use external fbUser if provided, or internal state as fallback
  const [internalFbUser, setInternalFbUser] = useState<FacebookUserProfile | null>(null);
  const fbUser = externalFbUser !== undefined ? externalFbUser : internalFbUser;

  const [visitorName, setVisitorName] = useState(fbUser?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceStatus>("attending");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [wishes, setWishes] = useState("");

  const [isLoggingInFb, setIsLoggingInFb] = useState(false);
  const [fbError, setFbError] = useState<string | null>(null);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync visitor name when fbUser changes or modal opens
  useEffect(() => {
    if (fbUser?.name) {
      setVisitorName(fbUser.name);
    } else if (isOpen && !visitorName && recipientName && recipientName !== "Bạn thân mến") {
      setVisitorName(recipientName);
    }
  }, [fbUser, isOpen, recipientName, visitorName]);

  if (!isOpen) return null;

  // Handle Facebook Login from inside modal (if not logged in upfront)
  const handleFacebookLogin = async () => {
    setIsLoggingInFb(true);
    setFbError(null);

    try {
      const res = await loginWithFacebook();
      if (res.success && res.user) {
        if (onSetFbUser) {
          onSetFbUser(res.user);
        } else {
          setInternalFbUser(res.user);
        }
        try {
          localStorage.setItem("graduation_fb_user", JSON.stringify(res.user));
        } catch {
          // Ignore storage errors
        }
        setVisitorName(res.user.name);
        setIsEditingName(false);

        if (res.accessToken) {
          verifyFacebookTokenOnServer(res.accessToken, res.user.id).catch((err) => {
            console.warn("[FB Verify] Backend check warning:", err);
          });
        }
      } else if (res.error) {
        setFbError(res.error);
      }
    } catch (err) {
      setFbError("Đăng nhập Facebook không thành công. Bạn vẫn có thể nhập tên bên dưới.");
      console.error("[FB Login Error]", err);
    } finally {
      setIsLoggingInFb(false);
    }
  };

  const handleDisconnectFb = () => {
    if (onSetFbUser) {
      onSetFbUser(null);
    } else {
      setInternalFbUser(null);
    }
    try {
      localStorage.removeItem("graduation_fb_user");
    } catch {
      // Ignore
    }
    setIsEditingName(true);
  };

  // Handle RSVP Submit (Explicit user action only - never triggered automatically)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalName = visitorName.trim() || fbUser?.name || "";
    if (!finalName) {
      setSubmitError("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      timestamp: new Date().toISOString(),
      recipientInvitationName: recipientName,
      visitorName: finalName,
      attendance: attendance === "attending" ? "Tham dự" : "Không thể tham dự",
      guestCount: attendance === "attending" ? guestCount : 0,
      wishes: wishes.trim(),
      facebookVerified: !!fbUser,
      facebookName: fbUser?.name || "",
      facebookId: fbUser?.id || "",
    };

    const webhookUrl = import.meta.env.VITE_RSVP_WEBHOOK_URL;

    try {
      if (webhookUrl && webhookUrl.startsWith("http")) {
        // Send to Google Sheets Apps Script Webhook
        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      // Also persist to localStorage for offline cache
      try {
        const existing = JSON.parse(localStorage.getItem("saved_rsvps") || "[]");
        existing.push(payload);
        localStorage.setItem("saved_rsvps", JSON.stringify(existing));
      } catch {
        // Ignore localStorage errors
      }

      setSubmitted(true);
      fireGraduationConfetti();
    } catch (err) {
      console.error("[RSVP Submit Error]", err);
      setSubmitError("Có lỗi xảy ra khi gửi xác nhận. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      key="rsvp-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ background: "rgba(13,26,43,0.78)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative w-full max-w-lg my-auto p-6 sm:p-8 rounded-xl shadow-2xl text-slate-800"
        style={{
          background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)",
          border: "1px solid rgba(214,180,119,0.35)",
          boxShadow: "0 25px 50px -12px rgba(13,26,43,0.45), 0 0 0 1px rgba(214,180,119,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-black/5 transition-colors"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-2">
                <AcademicSeal size={42} />
              </div>
              <p className="text-[10px] tracking-[0.25em] font-medium uppercase" style={{ color: "var(--gold)" }}>
                XÁC NHẬN THAM DỰ · RSVP
              </p>
              <h2 className="text-xl sm:text-2xl font-serif italic text-navy mt-1" style={{ color: "var(--navy)" }}>
                Lễ Tốt Nghiệp · Vy Anh
              </h2>

              {recipientName && (
                <div
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                  style={{ background: "rgba(214,180,119,0.12)", border: "1px solid rgba(214,180,119,0.25)", color: "var(--navy)" }}
                >
                  <span className="opacity-70">Thiệp mời gửi đến:</span>
                  <strong className="font-semibold">{recipientName}</strong>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* User Identity Section */}
              {fbUser ? (
                /* Auto-recognized from Facebook login upfront - NO TYPING NEEDED! */
                <div className="p-3.5 rounded-lg bg-emerald-50/90 border border-emerald-300 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {fbUser.picture?.data?.url ? (
                      <img
                        src={fbUser.picture.data.url}
                        alt={fbUser.name}
                        className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                        {fbUser.name[0]}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900">{fbUser.name}</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-300">
                          ✓ Facebook
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800 font-medium mt-0.5">
                        Tự động nhận diện từ tài khoản Facebook của bạn
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDisconnectFb}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-2 shrink-0"
                  >
                    Đổi tài khoản
                  </button>
                </div>
              ) : (
                /* Not yet logged in upfront: allow 1-click FB login or manual name input */
                <div className="space-y-3">
                  <div
                    className="p-3 rounded-lg text-left"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(214,180,119,0.25)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
                        Điền nhanh với Facebook
                      </span>
                      <Sparkles size={13} style={{ color: "var(--gold)" }} />
                    </div>
                    <button
                      type="button"
                      onClick={handleFacebookLogin}
                      disabled={isLoggingInFb}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-white font-medium text-xs shadow-sm transition-all hover:brightness-105 active:scale-[0.99]"
                      style={{ background: "#1877F2" }}
                    >
                      <FacebookIcon size={15} />
                      <span>{isLoggingInFb ? "Đang kết nối Facebook..." : "Tiếp tục với Facebook"}</span>
                    </button>
                    {fbError && (
                      <p className="text-[11px] text-rose-600 text-center mt-1.5 bg-rose-50 p-1.5 rounded">
                        {fbError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Hoặc nhập họ và tên của bạn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      className="w-full px-3.5 py-2.5 rounded-md border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      style={{ borderColor: "rgba(214,180,119,0.4)" }}
                    />
                  </div>
                </div>
              )}

              {/* Attendance Options */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Bạn có thể tham dự không?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttendance("attending")}
                    className={`py-2.5 px-3 rounded-md text-xs font-medium border text-center transition-all flex items-center justify-center gap-1.5 ${
                      attendance === "attending"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>🎉</span> Sẽ tham dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("declined")}
                    className={`py-2.5 px-3 rounded-md text-xs font-medium border text-center transition-all flex items-center justify-center gap-1.5 ${
                      attendance === "declined"
                        ? "bg-slate-100 border-slate-400 text-slate-900 ring-1 ring-slate-400 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>💌</span> Không thể tham dự
                  </button>
                </div>
              </div>

              {/* Guest Count (only if attending) */}
              {attendance === "attending" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Users size={12} style={{ color: "var(--gold)" }} />
                    Số lượng người tham dự
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${
                          guestCount === num
                            ? "bg-amber-100/70 border-amber-400 text-amber-950 font-bold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {num === 3 ? "3+ người" : `${num} người`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishes / Note */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={12} style={{ color: "var(--gold)" }} />
                  Lời chúc gửi đến Vy Anh (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  placeholder="Gửi đôi dòng chia sẻ hoặc lời chúc mừng tốt đẹp..."
                  className="w-full px-3.5 py-2 rounded-md border text-xs sm:text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                  style={{ borderColor: "rgba(214,180,119,0.4)" }}
                />
              </div>

              {submitError && (
                <div className="p-2.5 rounded bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-md font-semibold text-xs uppercase tracking-widest text-white shadow-md flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #1A365D 0%, #0D1A2B 100%)",
                  border: "1px solid rgba(214,180,119,0.4)",
                }}
              >
                <Send size={13} style={{ color: "var(--gold)" }} />
                <span>{isSubmitting ? "ĐANG GỬI XÁC NHẬN..." : "GỬI XÁC NHẬN"}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              <CheckCircle size={28} />
            </div>

            <h3 className="text-xl font-serif italic mb-1" style={{ color: "var(--navy)" }}>
              Cảm ơn {visitorName || fbUser?.name}!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto mb-5 leading-relaxed">
              {attendance === "attending"
                ? "Vy Anh rất vui và háo hức chờ đón bạn trong ngày lễ tốt nghiệp đặc biệt này!"
                : "Cảm ơn bạn đã gửi lời chúc mừng chân thành đến Vy Anh!"}
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-md font-medium text-xs tracking-wider text-white"
                style={{ background: "var(--navy)" }}
              >
                HOÀN TẤT & ĐÓNG
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Chỉnh sửa phản hồi
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
