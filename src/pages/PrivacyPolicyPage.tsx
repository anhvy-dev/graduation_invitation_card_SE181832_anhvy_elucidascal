import { useEffect } from "react";
import { LegalLayout } from "../components/LegalLayout";
import {
  ShieldCheck,
  UserCheck,
  Database,
  Lock,
  Clock,
  Share2,
  Settings,
  HelpCircle,
  Mail,
  CheckCircle2,
  Info,
  ExternalLink,
} from "lucide-react";

export function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Chính Sách Quyền Riêng Tư | Vy Anh - Graduation Invitation";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Chính sách quyền riêng tư của ứng dụng Thiệp Mời Tốt Nghiệp Vy Anh. Minh bạch về hai chế độ thiệp mời (Công khai & Cá nhân hóa), dữ liệu RSVP và quyền xóa dữ liệu."
      );
    }
  }, []);

  return (
    <LegalLayout
      activeTab="privacy"
      title="Chính Sách Quyền Riêng Tư"
      subtitle="Chính sách bảo vệ quyền riêng tư và minh bạch dữ liệu cho ứng dụng Thiệp Mời Tốt Nghiệp — Vy Anh (FPT University HCMC)"
      lastUpdated="31/10/2026"
    >
      {/* 1. Introduction Card */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              1. Giới thiệu tổng quan
            </h2>
            <p className="text-xs text-slate-500">Mục đích và phạm vi áp dụng của chính sách</p>
          </div>
        </div>

        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <p>
            Chào mừng bạn đến với ứng dụng web <strong>Thiệp Mời Lễ Tốt Nghiệp — Vy Anh</strong>{" "}
            (tên miền chính thức:{" "}
            <a
              href="https://vy-anh-graduation-invitation-card.vercel.app"
              className="text-[#1769AA] underline hover:text-[#14243A]"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://vy-anh-graduation-invitation-card.vercel.app
            </a>
            ). Đây là website thiệp mời điện tử phi thương mại, được phát triển bởi{" "}
            <strong>Huỳnh Ngọc Vy Anh</strong> (Sinh viên ngành Kỹ thuật Phần mềm, Khóa SE18, Đại học FPT TP. Hồ Chí Minh),
            nhằm gửi lời mời và kỷ niệm Lễ tốt nghiệp đại học Niên khóa 2026 đến bạn bè, thầy cô và người thân.
          </p>
          <p>
            Chúng tôi cam kết tôn trọng và bảo vệ tối đa quyền riêng tư của khách truy cập. Chính sách này
            giải thích rõ ràng, minh bạch những thông tin được thu thập, cách thức sử dụng, vị trí lưu trữ và
            quyền lợi của bạn khi tương tác với trang web và Biểu mẫu xác nhận tham dự (RSVP).
          </p>
        </div>
      </section>

      {/* 2. Two Invitation Modes */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              2. Hai chế độ thiệp mời không yêu cầu đăng nhập
            </h2>
            <p className="text-xs text-slate-500">Trải nghiệm mở hoàn toàn, không bắt buộc tài khoản mạng xã hội</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">
              <strong>Hoàn toàn không yêu cầu đăng nhập (No Authentication):</strong> Trang web không yêu cầu đăng nhập bằng bất kỳ tài khoản mạng xã hội nào. Toàn bộ tính năng Facebook OAuth đã được gỡ bỏ hoàn toàn nhằm bảo vệ tối đa dữ liệu người dùng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30 space-y-2">
              <h3 className="font-serif italic font-bold text-base text-[#14243A]">
                Chế độ 1: Thiệp mời công khai (Public Invitation)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đường dẫn: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">/</code>.
                Dành cho việc chia sẻ công khai trên mạng xã hội. Hiển thị lời chào mặc định <em>&ldquo;Bạn thân mến&rdquo;</em>.
                Khách mời có thể tùy ý bấm nút <em>&ldquo;Ghi tên của bạn ✨&rdquo;</em> để lưu tên tạm thời trên thiết bị của mình mà không bị bắt buộc.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30 space-y-2">
              <h3 className="font-serif italic font-bold text-base text-[#14243A]">
                Chế độ 2: Thiệp mời cá nhân hóa (Personalized Invitation)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đường dẫn dạng: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">/?to=Tên_Người_Nhận</code>.
                Tên người nhận được truyền qua tham số đường dẫn để hiển thị trang trọng trên thiệp mời và tự động điền sẵn trong biểu mẫu RSVP. Tên trong URL có độ ưu tiên cao nhất nhưng không bao giờ ghi đè lên bộ nhớ của chế độ công khai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Data Collection */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              3. Dữ liệu thu thập và Mục đích sử dụng
            </h2>
            <p className="text-xs text-slate-500">Phản ánh chính xác 100% triển khai kỹ thuật trong mã nguồn</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>Ứng dụng chỉ tiếp nhận các thông tin sau:</p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">
                A. Tên người nhận trên đường link URL (?to=...)
              </h4>
              <p className="text-xs text-slate-600">
                Được xử lý như một nhãn hiển thị thuần túy (plain text), không dùng để định danh pháp lý hay xác thực danh tính cá nhân người mở link.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">
                B. Tên tự nhập trên trình duyệt (LocalStorage)
              </h4>
              <p className="text-xs text-slate-600">
                Khi khách mời chủ động dùng chức năng &ldquo;Ghi tên của bạn ✨&rdquo;, tên này chỉ được lưu trong khóa <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">graduation_public_visitor_name</code> trên chính thiết bị của bạn.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
              <h4 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">
                C. Biểu mẫu xác nhận tham dự (RSVP)
              </h4>
              <p className="text-xs text-slate-600">
                Chỉ khi bạn <strong>chủ động bấm nút &ldquo;Gửi xác nhận&rdquo;</strong>, các thông tin bạn điền (Họ tên, Trạng thái tham dự, Số lượng khách, Lời chúc) mới được gửi về bảng tính Google Sheets riêng tư của Vy Anh nhằm chuẩn bị tiếp đón chu đáo trong ngày tốt nghiệp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Storage & Retention */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              4. Nơi lưu trữ và Thời hạn lưu trữ
            </h2>
            <p className="text-xs text-slate-500">Minh bạch về cơ sở hạ tầng lưu trữ</p>
          </div>
        </div>

        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>
              <strong>Trình duyệt của bạn (LocalStorage):</strong> Lưu tạm tên bạn đã ghi cho đến khi bạn tự xóa bộ nhớ cache hoặc bấm &ldquo;Xóa tên đã lưu&rdquo;.
            </li>
            <li>
              <strong>Bảng tính Google Sheets (RSVP):</strong> Dữ liệu phản hồi được lưu trữ bảo mật trong tài khoản Google cá nhân của Vy Anh phục vụ công tác tổ chức Lễ Tốt Nghiệp (diễn ra vào tháng 11/2026). Sau sự kiện, dữ liệu sẽ được xóa bỏ hoặc lưu trữ riêng tư lưu niệm.
            </li>
            <li>
              <strong>Không có cơ sở dữ liệu bên ngoài:</strong> Ứng dụng không lưu giữ mật khẩu, tài khoản hay thông tin nhạy cảm trên bất kỳ máy chủ cơ sở dữ liệu riêng nào.
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Tracking Policy */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              5. Chính sách đo lường lượng truy cập
            </h2>
            <p className="text-xs text-slate-500">Thống kê ẩn danh, bảo vệ quyền riêng tư</p>
          </div>
        </div>

        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <p>
            Website phân biệt số lượt xem thiệp công khai và lượt xem qua liên kết cá nhân hóa nhằm thống kê số lượng khách quan tâm đến sự kiện:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>
              Đối với liên kết cá nhân hóa, tên người nhận trên URL được ghi nhận như một <strong>nhãn liên kết (link label)</strong>, hoàn toàn không khẳng định hay xác minh danh tính người đang thực tế mở liên kết đó.
            </li>
            <li>
              Hệ thống áp dụng cơ chế khử trùng lặp (deduplication) để ngăn chặn việc ghi nhận sai lệch do tải lại trang hay tái hiển thị linh kiện React.
            </li>
          </ul>
        </div>
      </section>

      {/* 6. Third Party Sharing */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              6. Cam kết không chia sẻ dữ liệu cho bên thứ ba
            </h2>
            <p className="text-xs text-slate-500">Bảo mật tuyệt đối và phi thương mại</p>
          </div>
        </div>

        <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
          <p>
            Chúng tôi cam kết <strong>KHÔNG bán, KHÔNG cho thuê, KHÔNG trao đổi, KHÔNG chia sẻ</strong> thông tin cá nhân,
            tên hiển thị hay phản hồi RSVP của bạn cho bất kỳ nhà quảng cáo, đối tác kinh doanh hoặc bên thứ ba nào khác.
          </p>
        </div>
      </section>

      {/* 7. Data Deletion Request Link */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <HelpCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              7. Yêu cầu xóa dữ liệu cá nhân
            </h2>
            <p className="text-xs text-slate-500">Quy trình yêu cầu xóa dữ liệu và bản ghi RSVP</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Bạn có toàn quyền yêu cầu xóa bỏ thông tin cá nhân và bản ghi RSVP của mình khỏi cơ sở dữ liệu (Google Sheets) cũng như thiết bị cục bộ.
            Chúng tôi cung cấp trang hướng dẫn xóa dữ liệu chi tiết kèm các thao tác tự xóa tự động và mẫu gửi email yêu cầu:
          </p>

          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-amber-950 uppercase tracking-wider mb-1">
                TRANG HƯỚNG DẪN XÓA DỮ LIỆU
              </p>
              <p className="text-xs text-amber-900">
                Truy cập để xóa dữ liệu trên trình duyệt ngay lập tức hoặc nhận mẫu email yêu cầu xóa bản ghi RSVP.
              </p>
            </div>
            <a
              href="/data-deletion"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14243A] text-[#FAF8F3] text-xs font-semibold uppercase tracking-wider hover:bg-[#D6B477] hover:text-[#14243A] transition-colors shrink-0 shadow-xs"
            >
              <span>Xem hướng dẫn xóa dữ liệu</span>
              <span>›</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Contact Section */}
      <section className="bg-white/90 rounded-xl p-6 sm:p-8 border border-[#D6B477]/30 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#14243A] text-[#D6B477] flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif italic text-[#14243A]">
              8. Thông tin liên hệ
            </h2>
            <p className="text-xs text-slate-500">Giải đáp thắc mắc về quyền riêng tư và dữ liệu người dùng</p>
          </div>
        </div>

        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D6B477]/30 text-xs sm:text-sm space-y-1.5">
            <p><strong>Người đại diện:</strong> Huỳnh Ngọc Vy Anh</p>
            <p><strong>Vai trò:</strong> Chủ sở hữu ứng dụng · Sinh viên Kỹ thuật Phần mềm (SE181832)</p>
            <p><strong>Đơn vị:</strong> Trường Đại học FPT TP. Hồ Chí Minh</p>
            <p>
              <strong>Email liên hệ:</strong>{" "}
              <a
                href="mailto:anhvse181832@fpt.edu.vn"
                className="text-[#1769AA] font-semibold underline hover:text-[#14243A]"
              >
                anhvse181832@fpt.edu.vn
              </a>
            </p>
            <p><strong>Thời gian phản hồi:</strong> Trong vòng 24 - 48 giờ làm việc.</p>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
