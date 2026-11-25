# English Fun ✨

Ứng dụng web luyện **đọc** và **viết** tiếng Anh cho người lớn, kết hợp xây dựng kho từ vựng cá nhân.

## Luồng sử dụng

1. **Chọn chủ đề** (Công việc, Du lịch, Công nghệ, Sức khỏe, Đời sống) và **kỹ năng**.
2. **Đọc**: app hiển thị một đoạn văn tiếng Anh ngẫu nhiên theo chủ đề.
   - Kéo từ bất kỳ vào **Bảng từ mới** (hoặc bấm vào từ, hoặc gõ từ).
   - App tự tra nghĩa tiếng Anh, phiên âm, ví dụ và gợi ý nghĩa tiếng Việt. Bạn sửa nghĩa nếu cần rồi bấm **Thêm vào kho**.
   - Có thể viết bản dịch của riêng mình, và xem bản dịch tham khảo.
   - Từ đã có trong kho được gạch chân xanh.
3. **Viết**: app chọn đoạn văn trong chủ đề có chứa nhiều từ trong kho của bạn nhất, và chọn tối đa 5 từ ít được luyện nhất làm **Từ cần dùng**.
   - Dịch đoạn tiếng Việt sang tiếng Anh, rồi viết thêm vài câu dùng các từ còn thiếu.
   - Bấm **Kiểm tra** để xem đã dùng đủ từ chưa, so với bản gốc, và lưu thêm từ mới.
4. **Kho từ**: tìm kiếm, sửa nghĩa, nghe phát âm, xóa, và ôn tập bằng thẻ lật.

Kho từ được lưu trên **Cloudflare D1** qua API `/api/vocab` (thư mục `functions/`), nên dùng chung được giữa các thiết bị. App luôn giữ một bản sao trong trình duyệt: khi không kết nối được server (mạng chập chờn, hoặc chạy `npm run dev`), app vẫn dùng bình thường và gửi các thay đổi lên ở lần đồng bộ sau. Góc trên bên phải cho biết trạng thái: ☁️ đã đồng bộ, 💾 chỉ lưu trên máy này.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # kiểm tra kiểu và build ra dist/
npm run lint
```

## Cài đặt trên Cloudflare Pages

Cài đặt build: build command `npm run build`, output `dist`, Node 22 (đã có file `.node-version`).

**1. Tạo cơ sở dữ liệu D1**
- Cloudflare dashboard → **Storage & Databases** → **D1** → **Create database**, đặt tên `english-fun`.
- Bảng `vocab` được API tự tạo ở lần gọi đầu tiên, không cần chạy SQL.

**2. Gắn D1 vào project Pages**
- **Workers & Pages** → project → **Settings** → **Bindings** → **Add** → **D1 database**.
- Variable name: `DB`, database: `english-fun`. Làm cho cả Production (và Preview nếu muốn).

**3. Bật đăng nhập bằng Cloudflare Access** (để chỉ bạn đọc/ghi được kho từ)
- **Zero Trust** → **Access** → **Applications** → **Add an application** → **Self-hosted**.
- Domain: tên miền `*.pages.dev` của project (ví dụ `english-fun.pages.dev`).
- Policy: Action **Allow**, Include → **Emails** → email của bạn. Đăng nhập bằng mã gửi qua email (One-time PIN) là đủ.
- (Tùy chọn) Thêm biến môi trường `ALLOWED_EMAILS` = email của bạn trong **Settings → Variables and Secrets** để API kiểm tra thêm một lớp.

**4. Deploy lại** (Deployments → bản mới nhất → **Retry deployment**) để binding có hiệu lực.

Nếu thiếu Access, API trả lỗi 401 và app tự chuyển về chế độ 💾 lưu trên máy.

### Chạy thử với Cloudflare trên máy

```bash
npm run cf:dev   # build rồi chạy wrangler với D1 cục bộ, http://localhost:8788
```

## Cấu trúc

| Đường dẫn | Nội dung |
| --- | --- |
| `src/App.tsx` | Điều hướng: trang chủ, luyện tập, kho từ |
| `src/data/passages.ts` | Danh sách chủ đề và đoạn văn (Anh + Việt) |
| `src/components/ReadingView.tsx` | Màn hình Đọc |
| `src/components/WritingView.tsx` | Màn hình Viết |
| `src/components/WordPanel.tsx` | Bảng kéo thả và tra từ |
| `src/components/VocabView.tsx` | Kho từ và ôn tập thẻ |
| `src/exercise.ts` | Chọn đoạn văn và từ cần luyện cho bài Viết |
| `src/storage.ts` | Kho từ: đồng bộ với server, bản sao trong trình duyệt |
| `functions/api/vocab.ts` | API kho từ trên Cloudflare Pages Functions + D1 |
| `src/dictionary.ts` | Tra từ (dictionaryapi.dev, MyMemory) và phát âm (Web Speech API) |

## Thêm đoạn văn

Thêm một mục vào `PASSAGES` trong `src/data/passages.ts` với `topicId`, `title`, `en` và `vi`. Muốn thêm chủ đề mới thì thêm vào `TOPICS`.
