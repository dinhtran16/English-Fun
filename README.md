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

Kho từ được lưu trên **Cloudflare D1** qua API `/api/vocab` (thư mục `worker/`), nên dùng chung được giữa các thiết bị. App luôn giữ một bản sao trong trình duyệt: khi không kết nối được server (mạng chập chờn, hoặc chạy `npm run dev`), app vẫn dùng bình thường và gửi các thay đổi lên ở lần đồng bộ sau. Góc trên bên phải cho biết trạng thái: ☁️ đã đồng bộ, 💾 chỉ lưu trên máy này.

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # kiểm tra kiểu và build ra dist/
npm run lint
```

## Cài đặt trên Cloudflare Workers

App chạy dưới dạng **Worker có static assets**: Worker phục vụ `/api/vocab` từ D1, mọi đường dẫn khác trả về app trong `dist/`. Cấu hình nằm ở `wrangler.jsonc`.

- Tên Worker trong dashboard phải trùng với `name` trong `wrangler.jsonc` (hiện là `english-fun`).
- Build command: `npm run build`. Deploy command: `npx wrangler deploy`. Node 22 (file `.node-version`).
- **D1 được tạo tự động** ở lần deploy đầu tiên (database `english-fun`, binding `DB`). Bảng `vocab` được API tự tạo ở lần gọi đầu tiên.

**Bật đăng nhập bằng Cloudflare Access** (để chỉ bạn đọc/ghi được kho từ)
- Worker → **Settings** → **Domains & Routes** → dòng `workers.dev` → bật **Cloudflare Access**. Hoặc vào **Zero Trust** → **Access** → **Applications** → **Self-hosted**, domain là link `workers.dev` của Worker.
- Policy: **Allow**, Include → **Emails** → email của bạn. Đăng nhập bằng mã gửi qua email.
- (Tùy chọn) Thêm biến `ALLOWED_EMAILS` = email của bạn trong **Settings → Variables and Secrets** để API kiểm tra thêm một lớp.

Nếu thiếu Access, API trả lỗi 401 và app tự chuyển về chế độ 💾 lưu trên máy.

### Chạy thử với Cloudflare trên máy

```bash
npm run cf:dev   # build rồi chạy wrangler dev với D1 cục bộ, http://localhost:8787
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
| `worker/index.ts`, `worker/vocab.ts` | Cloudflare Worker: API kho từ trên D1 và phục vụ app |
| `wrangler.jsonc` | Cấu hình Worker, static assets và D1 |
| `src/dictionary.ts` | Tra từ (dictionaryapi.dev, MyMemory) và phát âm (Web Speech API) |

## Thêm đoạn văn

Thêm một mục vào `PASSAGES` trong `src/data/passages.ts` với `topicId`, `title`, `en` và `vi`. Muốn thêm chủ đề mới thì thêm vào `TOPICS`.
