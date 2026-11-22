# Thiệp mời sinh nhật lần 12 - CLB TNTN Marketing - TCT

Trang thiệp mời tĩnh (HTML/CSS/JS), không cần build.

## Chỉnh nội dung
Mở `script.js`, sửa object `CONFIG` ở đầu file (tên CLB, ngày giờ, địa điểm, ban tổ chức, chương trình, album).
Ảnh bỏ vào thư mục `assets/` rồi khai báo đường dẫn trong `album` / `hosts[].photo`.

## Gửi thiệp theo tên từng người
Thêm `?ten=` vào link: `https://<user>.github.io/<repo>/?ten=Em%20Thương`

## Nhận xác nhận tham dự
Dán link Formspree hoặc Google Apps Script vào `rsvpEndpoint`. Nếu để trống, nút gửi sẽ mở email tới `rsvpEmail`.

## Đưa lên GitHub Pages
1. Tạo repo mới, upload toàn bộ file trong thư mục này.
2. Settings → Pages → Source: `Deploy from a branch` → Branch `main` / `(root)` → Save.
3. Sau 1–2 phút trang chạy tại `https://<user>.github.io/<repo>/`.

## Mã QR chuyển tiền
Lưu ảnh QR ngân hàng vào `assets/qr.png`, sửa dòng `qrInfo` trong `script.js` (tên chủ tài khoản, ngân hàng, số tài khoản).
