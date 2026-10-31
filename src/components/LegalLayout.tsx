import React from "react";
import { ArrowLeft, Shield, Trash2, ExternalLink } from "lucide-react";

type LegalLayoutProps = {
  activeTab: "privacy" | "deletion";
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
};

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

export function LegalLayout({
  activeTab,
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen w-full page-bg flex flex-col text-slate-800 font-sans selection:bg-amber-200 selection:text-slate-900">
      <div className="film-grain pointer-events-none" aria-hidden="true" />

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#D6B477]/30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="/?guest=true"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#14243A] hover:text-[#B8944F] transition-colors group"
            title="Quay lại trải nghiệm thiệp mời tốt nghiệp"
          >
            <span className="w-8 h-8 rounded-full bg-[#14243A]/5 group-hover:bg-[#D6B477]/20 flex items-center justify-center transition-colors">
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            </span>
            <span className="hidden sm:inline">Về Thiệp Mời</span>
          </a>

          {/* Navigation Switcher */}
          <nav className="flex items-center gap-1.5 p-1 rounded-full bg-[#14243A]/5 border border-[#D6B477]/30">
            <a
              href="/privacy-policy"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "privacy"
                  ? "bg-[#14243A] text-[#FAF8F3] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield size={12} className={activeTab === "privacy" ? "text-[#D6B477]" : ""} />
              <span>Chính sách quyền riêng tư</span>
            </a>
            <a
              href="/data-deletion"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "deletion"
                  ? "bg-[#14243A] text-[#FAF8F3] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Trash2 size={12} className={activeTab === "deletion" ? "text-[#D6B477]" : ""} />
              <span>Hướng dẫn xóa dữ liệu</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Header Hero Card */}
        <div
          className="p-6 sm:p-10 rounded-2xl shadow-xl text-center mb-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)",
            border: "1px solid rgba(214,180,119,0.4)",
            boxShadow: "0 20px 40px -15px rgba(13,26,43,0.08), 0 0 0 1px rgba(214,180,119,0.2)",
          }}
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D6B477]/40 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D6B477]/40 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D6B477]/40 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D6B477]/40 pointer-events-none" />

          <div className="flex justify-center mb-3">
            <AcademicSeal size={52} />
          </div>

          <p className="text-[11px] tracking-[0.25em] font-semibold uppercase text-[#D6B477] mb-1">
            FPT UNIVERSITY HCMC · NIÊN KHÓA 2026
          </p>

          <h1 className="text-2xl sm:text-4xl font-serif italic text-[#14243A] tracking-tight mb-2">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span>Cập nhật lần cuối: <strong>{lastUpdated}</strong></span>
            <span className="hidden sm:inline">·</span>
            <span>Ứng dụng: <strong>Vy Anh - Graduation Invitation</strong></span>
            <span className="hidden sm:inline">·</span>
            <span>Meta App ID: <code className="bg-amber-100/60 px-1.5 py-0.5 rounded text-slate-700">1469533411730984</code></span>
          </div>
        </div>

        {/* Content Body */}
        <article className="space-y-8 text-slate-800 leading-relaxed text-sm sm:text-base">
          {children}
        </article>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#D6B477]/30 bg-[#FAF8F3] py-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/?guest=true" className="hover:text-[#14243A] transition-colors underline">
              Thiệp mời tốt nghiệp
            </a>
            <span>·</span>
            <a href="/privacy-policy" className="hover:text-[#14243A] transition-colors underline">
              Chính sách quyền riêng tư
            </a>
            <span>·</span>
            <a href="/data-deletion" className="hover:text-[#14243A] transition-colors underline">
              Hướng dẫn xóa dữ liệu
            </a>
            <span>·</span>
            <a
              href="https://www.facebook.com/settings?tab=applications"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#14243A] transition-colors underline"
            >
              <span>Quản lý ứng dụng Facebook</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <p className="text-[11px] text-slate-400">
            © 2026 Huỳnh Ngọc Vy Anh · MSSV: SE181832 · Đại học FPT TP. Hồ Chí Minh
          </p>
        </div>
      </footer>
    </div>
  );
}
