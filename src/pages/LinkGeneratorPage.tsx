import { useState, useMemo } from "react";
import {
  Link,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Users,
  User,
  Trash2,
  Share2,
} from "lucide-react";

export const AcademicSeal = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" stroke="#D6B477" strokeWidth="0.8" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="25" stroke="#D6B477" strokeWidth="0.5" opacity="0.6" />
    <text x="32" y="27" textAnchor="middle" fill="#D6B477" fontSize="7" fontFamily="serif" letterSpacing="1.5" opacity="0.9">FPT</text>
    <text x="32" y="37" textAnchor="middle" fill="#D6B477" fontSize="4.5" fontFamily="serif" letterSpacing="1" opacity="0.7">UNIVERSITY</text>
    <text x="32" y="46" textAnchor="middle" fill="#D6B477" fontSize="4" fontFamily="serif" letterSpacing="0.5" opacity="0.6">2026</text>
    <path d="M20 49 Q32 53 44 49" stroke="#D6B477" strokeWidth="0.5" fill="none" opacity="0.5" />
  </svg>
);

const DEFAULT_PROD_URL = "https://vy-anh-graduation-invitation-card.vercel.app";

export function LinkGeneratorPage() {
  const [baseUrl, setBaseUrl] = useState(() => {
    if (typeof window !== "undefined" && window.location.origin && !window.location.origin.includes("localhost")) {
      return window.location.origin;
    }
    return DEFAULT_PROD_URL;
  });

  const [singleName, setSingleName] = useState("");
  const [copiedSingle, setCopiedSingle] = useState(false);

  const [batchInput, setBatchInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Clean base URL without trailing slash
  const cleanBase = baseUrl.replace(/\/+$/, "");

  // Generate single link
  const singleLink = useMemo(() => {
    const trimmed = singleName.trim();
    if (!trimmed) return "";
    return `${cleanBase}/?to=${encodeURIComponent(trimmed)}`;
  }, [cleanBase, singleName]);

  // Generate batch links
  const batchLinks = useMemo(() => {
    if (!batchInput.trim()) return [];
    const lines = batchInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return lines.map((name) => ({
      name,
      url: `${cleanBase}/?to=${encodeURIComponent(name)}`,
    }));
  }, [cleanBase, batchInput]);

  const copyToClipboard = async (text: string, onSuccess: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess();
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      onSuccess();
    }
  };

  const handleCopySingle = () => {
    if (!singleLink) return;
    copyToClipboard(singleLink, () => {
      setCopiedSingle(true);
      setTimeout(() => setCopiedSingle(false), 2000);
    });
  };

  const handleCopyRow = (url: string, index: number) => {
    copyToClipboard(url, () => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleCopyAll = () => {
    if (batchLinks.length === 0) return;
    const allText = batchLinks.map((b) => `${b.name}: ${b.url}`).join("\n");
    copyToClipboard(allText, () => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    });
  };

  return (
    <div className="min-h-screen w-full page-bg flex flex-col text-slate-800 font-sans selection:bg-amber-200 selection:text-slate-900">
      <div className="film-grain pointer-events-none" aria-hidden="true" />

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#D6B477]/30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#14243A] hover:text-[#B8944F] transition-colors group"
            title="Quay lại thiệp mời tốt nghiệp"
          >
            <span className="w-8 h-8 rounded-full bg-[#14243A]/5 group-hover:bg-[#D6B477]/20 flex items-center justify-center transition-colors">
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span>Về Thiệp Mời</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Công cụ tạo link cá nhân hóa
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 space-y-8">
        {/* Header Hero Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl shadow-xl text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)",
            border: "1px solid rgba(214,180,119,0.4)",
            boxShadow: "0 20px 40px -15px rgba(13,26,43,0.08), 0 0 0 1px rgba(214,180,119,0.2)",
          }}
        >
          <div className="flex justify-center mb-3">
            <AcademicSeal size={48} />
          </div>

          <p className="text-[11px] tracking-[0.25em] font-semibold uppercase text-[#D6B477] mb-1">
            CÔNG CỤ NỘI BỘ · VY ANH 2026
          </p>

          <h1 className="text-2xl sm:text-3xl font-serif italic text-[#14243A] tracking-tight mb-2">
            Tạo Liên Kết Thiệp Mời Cá Nhân Hóa
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Nhập tên người nhận để tạo đường link thiệp mời tùy chỉnh (chứa tham số <code className="bg-amber-100/60 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">?to=...</code>). Khi người nhận mở link, thiệp mời sẽ hiển thị tên trang trọng của họ!
          </p>
        </div>

        {/* Base Domain Setting */}
        <div className="bg-white/90 rounded-xl p-5 border border-[#D6B477]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Tên miền trang web (Base Domain)
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md border text-xs sm:text-sm text-slate-800 bg-[#FAF8F3] focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />
          </div>
          <div className="flex items-center gap-2 pt-2 sm:pt-5">
            <button
              type="button"
              onClick={() => setBaseUrl(DEFAULT_PROD_URL)}
              className="px-2.5 py-1.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Vercel Production
            </button>
            {typeof window !== "undefined" && window.location.origin && (
              <button
                type="button"
                onClick={() => setBaseUrl(window.location.origin)}
                className="px-2.5 py-1.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Tên miền hiện tại
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Single Link Generator */}
        <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif italic text-[#14243A]">
                1. Tạo link cho một người
              </h2>
              <p className="text-xs text-slate-500">Nhập tên người bạn muốn gửi thiệp (hỗ trợ có dấu và khoảng trắng)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Họ và tên người nhận <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  placeholder="Ví dụ: Minh Anh, Thầy Hoàng, Chị Mai Phương..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 bg-[#FAF8F3] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  style={{ borderColor: "rgba(214,180,119,0.5)" }}
                />
                {singleName && (
                  <button
                    type="button"
                    onClick={() => setSingleName("")}
                    className="p-2.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Xóa ô nhập"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {singleLink && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-950">
                    Liên kết thiệp mời được tạo:
                  </span>
                  <span className="text-[11px] text-amber-800 font-medium">
                    encodeURIComponent: ✓
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-amber-200 font-mono text-xs text-slate-800 break-all select-all">
                  {singleLink}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopySingle}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-wider text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                    style={{ background: copiedSingle ? "#059669" : "#14243A" }}
                  >
                    {copiedSingle ? <Check size={14} /> : <Copy size={14} className="text-[#D6B477]" />}
                    <span>{copiedSingle ? "ĐÃ SAO CHÉP!" : "SAO CHÉP LINK"}</span>
                  </button>

                  <a
                    href={singleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs text-slate-700 bg-white border border-amber-300 hover:bg-amber-100/50 transition-colors"
                  >
                    <span>Mở xem thử thiệp</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Batch Generator */}
        <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif italic text-[#14243A]">
                  2. Tạo hàng loạt cho danh sách nhiều người
                </h2>
                <p className="text-xs text-slate-500">Dán danh sách tên bạn bè (mỗi người trên một dòng riêng)</p>
              </div>
            </div>

            {batchLinks.length > 0 && (
              <button
                type="button"
                onClick={handleCopyAll}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-all active:scale-95"
                style={{ background: copiedAll ? "#059669" : "#14243A" }}
              >
                {copiedAll ? <Check size={13} /> : <Share2 size={13} className="text-[#D6B477]" />}
                <span>{copiedAll ? "ĐÃ SAO CHÉP TOÀN BỘ!" : "SAO CHÉP TẤT CẢ"}</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Danh sách tên người nhận (mỗi dòng một tên)
            </label>
            <textarea
              rows={5}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="Minh Anh&#10;Thầy Hoàng&#10;Chị Mai Phương&#10;Cô Nguyễn Thị Bích Loan"
              className="w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-slate-800 bg-[#FAF8F3] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-sans resize-y"
              style={{ borderColor: "rgba(214,180,119,0.5)" }}
            />
          </div>

          {batchLinks.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Đã tạo {batchLinks.length} liên kết:
                </span>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: copiedAll ? "#059669" : "#14243A" }}
                >
                  {copiedAll ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedAll ? "Đã chép tất cả!" : "Chép tất cả"}</span>
                </button>
              </div>

              <div className="divide-y divide-[#D6B477]/20 border border-[#D6B477]/30 rounded-xl overflow-hidden bg-white max-h-96 overflow-y-auto">
                {batchLinks.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 hover:bg-[#FAF8F3]/80 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#14243A]/10 text-[#14243A] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <strong className="text-xs sm:text-sm text-slate-900 truncate">
                          {item.name}
                        </strong>
                      </div>
                      <p className="font-mono text-[11px] text-slate-500 truncate pl-7 mt-0.5 select-all">
                        {item.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pl-7 sm:pl-0 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyRow(item.url, idx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-[#14243A] text-white hover:bg-[#B8944F] transition-colors"
                      >
                        {copiedIndex === idx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedIndex === idx ? "Đã chép!" : "Sao chép"}</span>
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Xem trước thiệp mời"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Security & Privacy Notice */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#D6B477]" />
            Tính bảo mật và an toàn:
          </p>
          <p>
            • Công cụ này xử lý hoàn toàn trong trình duyệt của bạn (Client-side execution). Không lưu trữ hay gửi danh sách khách mời của bạn lên bất kỳ cơ sở dữ liệu công khai nào.
          </p>
          <p>
            • Tên người nhận được mã hóa an toàn bằng chuẩn <code className="font-mono text-slate-800">encodeURIComponent</code> của trình duyệt, tương thích với tất cả các ứng dụng Messenger, Facebook, Instagram và Zalo.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#D6B477]/30 bg-[#FAF8F3] py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p>© 2026 Huỳnh Ngọc Vy Anh · Niên khóa 2026 · Đại học FPT TP. Hồ Chí Minh</p>
        </div>
      </footer>
    </div>
  );
}
