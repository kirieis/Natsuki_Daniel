# Team Kit \u2013 Mẫu nộp bài UI/UX Arena SU26

Bộ file này giúp đội thi hiểu rõ cấu trúc file .zip cần nộp, và tránh các lỗi
kỹ thuật thường gặp khiến BTC không mở/serve được sản phẩm. Đây KHÔNG phải bài
thi mẫu về ý tưởng/thiết kế \u2013 chỉ là ví dụ kỹ thuật về cách đóng gói file.

## 1. Bản ĐÚNG: `00_DUNG_team_kit_mau.zip`

Một trang web tĩnh đơn giản về chủ đề Smart Travel Gia Lai, có đủ:
- `index.html` ngay tại thư mục gốc của zip
- `css/style.css`
- `js/data.js` và `js/app.js`
- `images/*.jpg` (ảnh minh họa, không phải ảnh thật của địa điểm)

Cách tự kiểm tra giống BTC sẽ làm:
1. Giải nén zip ra một thư mục mới.
2. Mở terminal tại thư mục đó, chạy: `npx serve .`
3. Mở địa chỉ hiển thị trên terminal (thường là `http://localhost:3000`).
4. Thử các tương tác: chọn chip sở thích, xem lịch trình, chat với "AI" (đây
   là bản rule-based đơn giản để minh họa, bài thi thật nên gọi API AI thật).

Đội thi có thể copy cấu trúc này làm khung sườn cho bài thi của mình, rồi thay
toàn bộ nội dung/thiết kế/dữ liệu theo ý tưởng riêng.

## 2. Các trường hợp SAI thường gặp

Mỗi file dưới đây minh họa đúng MỘT lỗi kỹ thuật \u2013 đội thi nên tự kiểm tra
bài của mình không rơi vào các trường hợp này trước khi nộp.

### `01_SAI_index_trong_thu_muc_con.zip`
**Lỗi:** Giải nén ra thấy một thư mục `myproject/`, và `index.html` nằm BÊN
TRONG thư mục đó, không nằm ngay gốc zip.
**Hậu quả:** Theo quy định thể lệ, `index.html` phải nằm ngay tại thư mục gốc
của zip. Nếu sai, hệ thống của BTC tìm `index.html` ở gốc sẽ không thấy.
**Cách sửa:** Khi nén zip, hãy chọn (select) toàn bộ các file/thư mục con
(index.html, css/, js/, images/...) rồi nén lại từ đó \u2013 không nén nguyên cả
thư mục project cha.

### `02_SAI_source_code_chua_build.zip`
**Lỗi:** Đây là source code React + Vite chưa build (`package.json`,
`vite.config.js`, file `.jsx`). File `index.html` có nhưng chỉ load
`/src/main.jsx` \u2013 mở trực tiếp sẽ ra trang trắng, không chạy gì cả.
**Hậu quả:** BTC không chạy lệnh `npm install`/`npm run build` khi mở bài. Nếu
nộp nguyên source code chưa build, sản phẩm sẽ không hiển thị được.
**Cách sửa:** Chạy `npm run build` trước khi nộp, rồi nộp đúng thư mục kết quả
build (thường là `/dist`), đảm bảo `index.html` trong thư mục build đó nằm ở
gốc zip khi nộp.

### `03_SAI_duong_dan_tuyet_doi.zip`
**Lỗi:** File CSS/JS/ảnh được gọi bằng đường dẫn tuyệt đối kiểu
`C:/Users/Admin/Desktop/myproject/css/style.css` thay vì đường dẫn tương đối
`css/style.css`.
**Hậu quả:** Đường dẫn đó chỉ tồn tại trên máy cá nhân của người làm ra nó.
Khi BTC giải nén và mở trên máy khác, các file này không tải được, giao diện
vỡ hoàn toàn (mất CSS, ảnh, JS).
**Cách sửa:** Luôn dùng đường dẫn tương đối khi tham chiếu file trong project
(`css/style.css`, `images/photo.jpg`, không có `C:/...` hoặc `/Users/...`).

### `04_SAI_thua_node_modules_va_git.zip`
**Lỗi:** Zip chứa cả thư mục `node_modules/`, `.git/`, file `.DS_Store` \u2013
những file không phục vụ hiển thị trang web.
**Hậu quả:** File nặng không cần thiết, dễ vượt giới hạn 50MB, và làm chậm quá
trình BTC giải nén 39 bài nộp trong thời gian ngắn.
**Cách sửa:** Chỉ nén các file thực sự cần để hiển thị web (HTML, CSS, JS,
ảnh, font). Trước khi nén, kiểm tra lại không có `node_modules`, `.git`, file
cấu hình IDE (`.vscode`, `.idea`...) lẫn trong đó.

### `05_SAI_dinh_dang_khong_phai_zip.rar`
**Lỗi:** Nộp file định dạng `.rar` (hoặc `.7z`, hoặc link Google Drive) thay
vì `.zip`.
**Hậu quả:** Theo thể lệ, hệ thống chỉ nhận định dạng `.zip`. Nộp sai định
dạng có thể bị từ chối ngay từ bước upload.
**Cách sửa:** Luôn nén bằng định dạng `.zip` (Windows: chuột phải \u2192 "Send
to" \u2192 "Compressed (zipped) folder"; Mac: chuột phải \u2192 "Compress").

## 3. Checklist nhanh trước khi nộp thật

- [ ] Giải nén zip ra, thấy `index.html` ngay lập tức (không nằm trong thư mục con).
- [ ] Không có `node_modules/`, `.git/`, file cấu hình IDE trong zip.
- [ ] Mọi đường dẫn CSS/JS/ảnh trong code là đường dẫn tương đối.
- [ ] Đã chạy `npm run build` nếu dùng React/Vite/framework có bước build.
- [ ] Đã tự test bằng `npx serve .` và mở qua `http://localhost`, mọi tương tác hoạt động đúng.
- [ ] File nén đúng định dạng `.zip`, dưới 50MB.
