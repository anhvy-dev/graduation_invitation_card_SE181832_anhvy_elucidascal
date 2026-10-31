import { useState, useEffect } from "react";
import { LegalLayout } from "../components/LegalLayout";
import {
  Trash2,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  Laptop,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export function DataDeletionPage() {
  const [clearedLocal, setClearedLocal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  useEffect(() => {
    document.title = "Hướng Dẫn Xóa Dữ Liệu | Vy Anh - Graduation Invitation";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Hướng dẫn xóa dữ liệu người dùng và bản ghi RSVP cho ứng dụng Thiệp Mời Tốt Nghiệp Vy Anh. Cung cấp quy trình xóa trên thiết bị và yêu cầu xóa qua email."
      );
    }
  }, []);

  const handleClearLocalData = () => {
    try {
      localStorage.removeItem("graduation_public_visitor_name");
      localStorage.removeItem("saved_rsvps");
      localStorage.removeItem("graduation_fb_user");
      sessionStorage.removeItem("fb_skip_auth");
      setClearedLocal(true);
      setTimeout(() => {
        setClearedLocal(false);
      }, 5000);
    } catch (err) {
      console.warn("[Data Deletion] Error clearing storage:", err);
    }
  };

  const contactEmail = "anhvse181832@fpt.edu.vn";
  const emailSubject = encodeURIComponent("[Yêu cầu xóa dữ liệu RSVP] - Họ và tên");
  const emailBody = encodeURIComponent(
    `Kính gửi Vy Anh,\n\nTôi muốn yêu cầu xóa toàn bộ thông tin cá nhân và dữ liệu xác nhận tham dự (RSVP) của tôi khỏi hệ thống lưu trữ của thiệp mời tốt nghiệp.\n\nThông tin của tôi:\n- Họ và tên người xác nhận: [Nhập tên của bạn]\n- Tên trên thiệp mời nhận được: [Nhập tên nếu có]\n- Thời gian gửi RSVP ước tính: [Tùy chọn]\n\nXin cảm ơn!`
  );
  const mailtoUrl = `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`;

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(contactEmail).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  const copyTemplateToClipboard = () => {
    const text = `Kính gửi Vy Anh,

Tôi muốn yêu cầu xóa toàn bộ thông tin cá nhân và dữ liệu xác nhận tham dự (RSVP) của tôi khỏi hệ thống lưu trữ của thiệp mời tốt nghiệp.

Thông tin của tôi:
- Họ và tên người xác nhận: [Nhập tên của bạn]
- Tên trên thiệp mời nhận được: [Nhập tên nếu có]
- Thời gian gửi RSVP ước tính: [Tùy chọn]

Xin cảm ơn!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    });
  };

  return (
    <LegalLayout
      activeTab="deletion"
      title="Hướng Dẫn Xóa Dữ Liệu"
      subtitle="Quy trình minh bạch và các phương thức thực tế để yêu cầu xóa toàn bộ dữ liệu cá nhân hoặc bản ghi RSVP của bạn"
      lastUpdated="31/10/2026"
    >
      {/* Overview Card */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              1. Quyền tự chủ dữ liệu của người dùng
            </h2>
            <p className="text-xs text-slate-500">Minh bạch về cơ chế lưu trữ và quyền xóa bỏ</p>
          </div>
        </div>

        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <p>
            Ứng dụng <strong>Thiệp Mời Lễ Tốt Nghiệp — Vy Anh</strong> tôn trọng tuyệt đối quyền kiểm soát dữ liệu của bạn.
            Chúng tôi cung cấp phương thức rõ ràng, khả thi để bạn xóa dữ liệu cá nhân đã từng tương tác với ứng dụng.
          </p>
          <p>
            Ứng dụng hoạt động hoàn toàn không yêu cầu đăng nhập mạng xã hội và chỉ có 2 vị trí lưu trữ:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30">
              <strong className="text-xs text-[#14243A] block mb-1">1. Bộ nhớ trình duyệt (LocalStorage):</strong>
              <span className="text-xs text-slate-600">
                Lưu tên bạn tự nhập tạm thời trên chính thiết bị của bạn để hiển thị thiệp.
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30">
              <strong className="text-xs text-[#14243A] block mb-1">2. Bảng tính Google Sheets (RSVP):</strong>
              <span className="text-xs text-slate-600">
                Chỉ lưu khi bạn chủ động bấm gửi biểu mẫu xác nhận tham dự lễ tốt nghiệp.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Method 1: Self-service Local Clearance */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Laptop size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              Cách 1: Xóa dữ liệu tức thì trên thiết bị của bạn (Tự phục vụ)
            </h2>
            <p className="text-xs text-slate-500">Xóa sạch tên đã lưu và bản sao RSVP lưu cục bộ trên máy</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Nếu bạn muốn xóa tên bạn đã lưu và lịch sử phản hồi RSVP đang lưu trong bộ nhớ máy của bạn,
            bạn có thể thực hiện <strong>ngay lập tức với một thao tác duy nhất</strong>:
          </p>

          <div className="p-5 rounded-xl bg-[#FAF8F3] border border-[#D6B477]/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-xs sm:text-sm text-[#14243A] mb-1">
                Công cụ xóa bộ nhớ trình duyệt của ứng dụng
              </p>
              <p className="text-xs text-slate-500">
                Sẽ xóa các khóa: <code className="text-slate-800">graduation_public_visitor_name</code>, <code className="text-slate-800">saved_rsvps</code>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearLocalData}
              className="px-5 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider text-white shadow-sm transition-all hover:brightness-110 active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
              style={{ background: clearedLocal ? "#059669" : "#14243A" }}
            >
              {clearedLocal ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>ĐÃ XÓA THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Trash2 size={15} className="text-[#D6B477]" />
                  <span>XÓA DỮ LIỆU TRÊN TRÌNH DUYỆT NÀY</span>
                </>
              )}
            </button>
          </div>

          {clearedLocal && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>
                Toàn bộ dữ liệu phiên làm việc và tên lưu trên trình duyệt của bạn đã được xóa hoàn tất.
              </span>
            </div>
          )}

          <p className="text-xs text-slate-500">
            <em>Mẹo:</em> Bạn cũng có thể xóa thủ công bằng cách mở Cài đặt trình duyệt &gt; Xóa dữ liệu duyệt web (Cookies &amp; Site Data) cho tên miền <code className="bg-slate-100 px-1 py-0.5 rounded">vy-anh-graduation-invitation-card.vercel.app</code>.
          </p>
        </div>
      </section>

      {/* Method 2: Contact-based Google Sheets Deletion */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              Cách 2: Quy trình yêu cầu xóa bản ghi RSVP đã gửi
            </h2>
            <p className="text-xs text-slate-500">Xóa vĩnh viễn thông tin phản hồi của bạn khỏi bảng tính Google Sheets của sự kiện</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Nếu bạn đã từng bấm <strong>&ldquo;Gửi xác nhận&rdquo;</strong> trên biểu mẫu RSVP và hiện muốn hủy hoặc xóa vĩnh viễn
            dòng thông tin của mình (bao gồm Họ tên, Trạng thái tham dự, Số lượng khách, Lời chúc) khỏi danh sách khách mời trong Google Sheets, vui lòng làm theo quy trình đơn giản 3 bước sau:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#14243A] text-[#D6B477] text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h4 className="font-semibold text-xs sm:text-sm text-[#14243A]">
                  Bước 1: Gửi email yêu cầu xóa dữ liệu
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Gửi một email đến hộp thư tiếp nhận:{" "}
                <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-900">
                  {contactEmail}
                </code>{" "}
                với tiêu đề: <strong>[Yêu cầu xóa dữ liệu RSVP] - [Họ tên của bạn]</strong>.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#14243A] text-[#D6B477] text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h4 className="font-semibold text-xs sm:text-sm text-[#14243A]">
                  Bước 2: Đối chiếu và xử lý yêu cầu
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Chủ sở hữu sự kiện (Huỳnh Ngọc Vy Anh) sẽ trực tiếp kiểm tra và đối chiếu thông tin trong bảng tính Google Sheets lưu trữ RSVP, sau đó thực hiện xóa vĩnh viễn dòng thông tin tương ứng.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#14243A] text-[#D6B477] text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <h4 className="font-semibold text-xs sm:text-sm text-[#14243A]">
                  Bước 3: Xác nhận hoàn tất qua email
                </h4>
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Bạn sẽ nhận được email phản hồi xác nhận bản ghi đã được xóa vĩnh viễn trong vòng <strong>24 đến 48 giờ làm việc</strong>.
              </p>
            </div>
          </div>

          {/* Email Actions Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
            <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              CÔNG CỤ HỖ TRỢ GỬI YÊU CẦU NHANH
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={mailtoUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14243A] text-[#FAF8F3] text-xs font-semibold uppercase tracking-wider hover:bg-[#D6B477] hover:text-[#14243A] transition-colors shadow-xs"
              >
                <Mail size={14} />
                <span>Soạn email ngay (Mailto)</span>
              </a>

              <button
                type="button"
                onClick={copyEmailToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-amber-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedEmail ? "Đã chép email!" : "Sao chép địa chỉ email"}</span>
              </button>

              <button
                type="button"
                onClick={copyTemplateToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-amber-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedTemplate ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedTemplate ? "Đã chép nội dung mẫu!" : "Sao chép mẫu email"}</span>
              </button>
            </div>

            {/* Template Preview */}
            <div className="mt-2 p-3 bg-white/90 rounded border border-amber-200 text-xs font-mono text-slate-700 whitespace-pre-line">
              {`Kính gửi Vy Anh,

Tôi muốn yêu cầu xóa toàn bộ thông tin cá nhân và dữ liệu xác nhận tham dự (RSVP) của tôi khỏi hệ thống lưu trữ của thiệp mời tốt nghiệp.

Thông tin của tôi:
- Họ và tên người xác nhận: [Nhập tên của bạn]
- Tên trên thiệp mời nhận được: [Nhập tên nếu có]
- Thời gian gửi RSVP ước tính: [Tùy chọn]

Xin cảm ơn!`}
            </div>
          </div>
        </div>
      </section>

      {/* Return to Invitation CTA */}
      <div className="text-center pt-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14243A] text-[#FAF8F3] text-xs font-semibold uppercase tracking-widest hover:bg-[#D6B477] hover:text-[#14243A] transition-all shadow-md active:scale-95"
        >
          <span>Quay lại trải nghiệm thiệp mời</span>
          <ArrowRight size={14} />
        </a>
      </div>
    </LegalLayout>
  );
}
