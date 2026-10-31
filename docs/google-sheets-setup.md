# Hướng dẫn kết nối Google Sheets cho tính năng RSVP

## 1. Lý do cần thiết lập Google Apps Script mới
Qua kiểm tra toàn bộ mã nguồn của dự án (cả mã nguồn client, tệp môi trường `.env`, cấu hình Vercel và git commit), dự án trước đó chỉ có tính năng tạo file lịch `.ics` và mở Google Calendar qua nút "Lưu lịch tham dự". Dự án chưa từng có biểu mẫu RSVP lưu trữ cũng như endpoint nhận dữ liệu Google Sheets nào. Do đó, việc triển khai một Google Apps Script Webhook nhẹ, miễn phí và an toàn là giải pháp chuẩn xác và tinh gọn nhất để lưu danh sách khách mời tham dự.

---

## 2. Các bước thiết lập trong 3 phút

### Bước 1: Tạo Google Sheet mới
1. Truy cập [Google Sheets](https://sheets.new) để tạo một bảng tính mới.
2. Đặt tên bảng tính, ví dụ: `RSVP Lễ Tốt Nghiệp - Vy Anh`.

### Bước 2: Mở trình chỉnh sửa Apps Script
1. Trên thanh menu Google Sheets, chọn **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
2. Xóa toàn bộ nội dung mặc định trong tệp `Code.gs` và dán toàn bộ đoạn mã bên dưới vào:

```javascript
/**
 * Webhook tiếp nhận dữ liệu RSVP từ Graduation Invitation Website
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Tự động tạo hàng tiêu đề nếu trang tính còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian",
        "Tên trên thiệp mời",
        "Họ tên người xác nhận",
        "Trạng thái",
        "Số người",
        "Lời chúc",
        "Xác thực Facebook",
        "Tên Facebook",
        "Facebook User ID"
      ]);
      // Định dạng hàng tiêu đề
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#F3E8D2");
    }

    // Đọc dữ liệu gửi lên
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }

    const row = [
      new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
      data.recipientInvitationName || "",
      data.visitorName || "",
      data.attendance || "Tham dự",
      data.guestCount !== undefined ? data.guestCount : 1,
      data.wishes || "",
      data.facebookVerified ? "Có" : "Không",
      data.facebookName || "",
      data.facebookId ? "'" + data.facebookId : ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Đã lưu RSVP thành công" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("RSVP Webhook is active and running.");
}
```

### Bước 3: Triển khai (Deploy) dưới dạng Web App
1. Ở góc trên bên phải của giao diện Apps Script, bấm nút **Triển khai** (Deploy) -> **Triển khai mới** (New deployment).
2. Bấm biểu tượng bánh răng ⚙️ ở mục "Chọn loại", chọn **Ứng dụng web** (Web app).
3. Điền thông tin:
   - **Mô tả (Description):** `RSVP Webhook v1`
   - **Thực thi dưới dạng (Execute as):** `Tôi (email của bạn)`
   - **Ai có quyền truy cập (Who has access):** Chọn **Bất kỳ ai (Anyone)** *(Rất quan trọng để khách mời có thể gửi dữ liệu lên Google Sheet mà không cần đăng nhập Google)*.
4. Bấm **Triển khai** (Deploy). Nếu được hỏi phân quyền truy cập, bấm "Xem lại quyền" (Review Permissions) -> chọn tài khoản Google của bạn -> bấm "Nâng cao" (Advanced) -> "Đi tới [Tên dự án] (không an toàn)" -> bấm "Cho phép" (Allow).
5. Sau khi triển khai xong, sao chép đường link ở mục **URL của ứng dụng web** (Web app URL), dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## 3. Cấu hình biến môi trường

### Chạy cục bộ (Local Development)
Tạo hoặc mở file `.env.local` ở thư mục gốc của dự án và thêm:
```env
VITE_RSVP_WEBHOOK_URL="https://script.google.com/macros/s/AKfycbxNH-0mFMPjlp6E-7SUICkwHOLWwj5BX6Q4jupbitZnXbgOor05iRipxCSwsRJTeVrTSA/exec"
VITE_FB_APP_ID="1469533411730984"
```

### Triển khai trên Vercel (Production)
1. Truy cập vào Vercel Dashboard -> Chọn dự án của bạn (`vy-anh-graduation-invitation-card`).
2. Vào tab **Settings** -> **Environment Variables**.
3. Thêm các biến sau:
   - `VITE_RSVP_WEBHOOK_URL`: dán URL của Apps Script ở trên.
   - `VITE_FB_APP_ID`: `1469533411730984`
   - `FB_APP_ID`: `1469533411730984`
   - `FB_APP_SECRET`: App Secret lấy từ Meta Developer Console (`App Settings` -> `Basic` -> `App Secret`).
4. Kích hoạt lại Deployment hoặc git push để Vercel nhận diện biến mới.
