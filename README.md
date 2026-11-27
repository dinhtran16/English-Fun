# English Fun ✨

Ứng dụng web luyện **đọc** và **viết** tiếng Anh cho người lớn, kết hợp xây dựng kho từ vựng cá nhân.

## Ngôn ngữ của người học

Người học chọn **ngôn ngữ của mình** trong 10 ngôn ngữ: Việt, Tây Ban Nha, Bồ Đào Nha, Pháp, Đức, Indonesia, Nhật, Hàn, Trung (giản thể), Hindi. Ngôn ngữ này dùng cho giao diện, nghĩa từ khi tra, bản dịch đoạn văn, đề bài ở màn Viết và lời nhận xét của AI.

- Lần đầu vào app, ngôn ngữ được đoán theo trình duyệt; nếu trình duyệt dùng ngôn ngữ khác, app hiện màn chọn ngôn ngữ. Link từ các trang công khai (tiếng Việt) mở app bằng tiếng Việt (`?lang=vi`). Người đã dùng app trước đây giữ tiếng Việt.
- Đổi bất cứ lúc nào ở góc trên (biểu tượng quả địa cầu). Khi đăng nhập, lựa chọn được lưu theo tài khoản (bảng `user_settings`, API `POST /api/auth/settings`) và áp dụng trên mọi thiết bị.
- Chữ giao diện nằm ở `src/i18n/locales/<mã>.ts`, mỗi ngôn ngữ một file, kèm bản dịch 13 bài có sẵn. `en.ts` là bản gốc quy định các khóa; thêm ngôn ngữ mới = thêm một file và một dòng trong `src/i18n/languages.ts`.
- Kho từ cũ giữ nguyên nghĩa đã lưu.

## Luồng sử dụng

1. **Chọn chủ đề** (Công việc, Du lịch, Công nghệ, Sức khỏe, Đời sống) và **kỹ năng**.
2. **Đọc**: app hiển thị một đoạn văn tiếng Anh ngẫu nhiên theo chủ đề.
   - Kéo từ bất kỳ vào **Bảng từ mới** (hoặc bấm vào từ, hoặc gõ từ).
   - App tự tra nghĩa tiếng Anh, phiên âm, ví dụ và gợi ý nghĩa bằng ngôn ngữ của bạn. Bạn sửa nghĩa nếu cần rồi bấm **Thêm vào kho**.
   - Có thể viết bản dịch của riêng mình, và xem bản dịch tham khảo.
   - Từ đã có trong kho được gạch chân xanh.
3. **Viết**: app chọn đoạn văn trong chủ đề có chứa nhiều từ trong kho của bạn nhất, và chọn tối đa 5 từ ít được luyện nhất làm **Từ cần dùng**.
   - Dịch đoạn văn (bằng ngôn ngữ của bạn) sang tiếng Anh, rồi viết thêm vài câu dùng các từ còn thiếu.
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

App chạy dưới dạng **Worker có static assets**: Worker phục vụ `/api/auth/*` và `/api/vocab` từ D1, mọi đường dẫn khác trả về app trong `dist/`. Cấu hình nằm ở `wrangler.jsonc`.

- Tên Worker trong dashboard phải trùng với `name` trong `wrangler.jsonc` (hiện là `english-fun`).
- Build command: `npm run build`. Deploy command: `npx wrangler deploy`. Node 22 (file `.node-version`).
- **D1 được tạo tự động** ở lần deploy đầu tiên (database `english-fun`, binding `DB`). Các bảng `users`, `sessions`, `vocab_words`, `passages`, `ai_usage` được API tự tạo ở lần gọi đầu tiên.

**AI (DeepSeek)**
- Khi đã đăng nhập, màn Đọc và Viết dùng DeepSeek để tạo đoạn văn mới theo chủ đề và trình độ (A2-C1). Bài Viết lồng tối đa 5 từ ít luyện nhất trong kho, và AI chấm bài dịch (điểm, lỗi cần sửa, bản đã sửa).
- Cài key: Worker → **Settings → Variables and Secrets** → **Add** → loại **Secret**, tên `DEEPSEEK_API_KEY`. Không đưa key vào code.
- Mỗi người dùng được tối đa 50 lượt AI mỗi ngày (đổi bằng biến `AI_DAILY_LIMIT`); tài khoản mới chỉ được 10 lượt trong 24 giờ đầu (`AI_NEW_USER_LIMIT`). Cả app có trần chung 1000 lượt mỗi ngày (`AI_GLOBAL_DAILY_LIMIT`), nên hoá đơn không thể tăng vọt. Model mặc định `deepseek-chat` (đổi bằng `DEEPSEEK_MODEL`).
- Nên chỉ nạp ít tiền vào DeepSeek (ví dụ 2-5 USD) để giới hạn thiệt hại nếu key bị lộ.
- Chưa có key, hết lượt hoặc AI lỗi thì app tự dùng 13 bài có sẵn.
- Mọi đoạn văn AI tạo được lưu trong bảng `passages` để tránh lặp chủ đề.

**Tài khoản**
- Người dùng tự đăng ký bằng tên đăng nhập + mật khẩu ngay trong app. Mật khẩu được băm bằng PBKDF2 (SHA-256, salt riêng cho từng người); phiên đăng nhập là cookie HttpOnly giữ 30 ngày.
- Muốn khóa đăng ký sau khi đã tạo tài khoản cho mình: thêm biến `SIGNUP_ENABLED` = `false` trong Worker → **Settings → Variables and Secrets**.
- Có thể dùng thử không cần tài khoản; khi đó kho từ chỉ lưu trên máy (💾).

**Chống tấn công**
- Đăng nhập: tối đa 10 lần mỗi phút mỗi IP; tài khoản bị khoá 15 phút sau 10 lần sai mật khẩu. Đăng ký: tối đa 5 tài khoản mỗi giờ mỗi IP.
- Cloudflare Turnstile (chống bot) ở form đăng ký: tạo widget trong dashboard → **Turnstile → Add widget**, thêm hostname của Worker. Sau đó vào Worker → **Settings → Variables and Secrets**: biến thường `TURNSTILE_SITE_KEY` = site key, và **Secret** `TURNSTILE_SECRET_KEY` = secret key. Chưa có secret thì đăng ký không cần xác minh.
- Kho từ: chỉ nhận các trường đã biết, có giới hạn độ dài, tối đa 5000 từ mỗi người.
- Security headers (CSP, chống nhúng iframe, nosniff...) cho trang ở `public/_headers` và cho API ở `worker/http.ts`. Yêu cầu thay đổi dữ liệu từ trang web khác (Origin lạ) bị chặn.

### Chạy thử với Cloudflare trên máy

```bash
npm run cf:dev   # build rồi chạy wrangler dev với D1 cục bộ, http://localhost:8787 (D1 cục bộ, tạo tài khoản thử thoải mái)
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
| `worker/index.ts` | Cloudflare Worker: định tuyến API và phục vụ app |
| `worker/auth.ts` | Đăng ký, đăng nhập, đăng xuất, phiên |
| `worker/vocab.ts` | API kho từ trên D1 |
| `worker/ai.ts`, `src/ai.ts` | Sinh đoạn văn và chấm bài bằng DeepSeek |
| `src/auth.ts`, `src/components/AuthScreen.tsx` | Phía app: kiểm tra phiên và màn hình đăng nhập |
| `wrangler.jsonc` | Cấu hình Worker, static assets và D1 |
| `src/i18n/` | Ngôn ngữ người học: danh sách ngôn ngữ, chữ giao diện từng ngôn ngữ, bản dịch bài có sẵn |
| `src/dictionary.ts` | Tra từ (dictionaryapi.dev, MyMemory) và phát âm (Web Speech API) |
| `app/index.html` | Trang của app, chạy ở `/app/` |
| `site/` | Trang công khai cho SEO: trang chủ, chủ đề từ vựng, blog, robots.txt, sitemap.xml |
| `worker/site.ts` | Điền địa chỉ trang vào canonical, Open Graph, sitemap; chuyển người đã đăng nhập từ `/` sang `/app/` |

## SEO và trang công khai

- `/` là trang giới thiệu, `/chu-de/...` là trang từ vựng theo chủ đề, `/blog/...` là bài viết. Các trang này là HTML tĩnh được tạo lúc build từ `site/` (plugin `site-pages` trong `vite.config.ts`), nên Google đọc được ngay mà không cần chạy JavaScript.
- App nằm ở `/app/`. Nút "Dùng thử" mở `/app/?guest=1`, có thể kèm `&topic=travel&skill=reading` để vào thẳng bài. Khách dùng thử chỉ dùng bài có sẵn, không gọi AI.
- Địa chỉ trang (canonical, `og:url`, sitemap) lấy theo biến `SITE_URL` của Worker, ví dụ `https://hoctienganh.app`. Nếu không đặt thì dùng địa chỉ đang truy cập. Khi đặt `SITE_URL`, các địa chỉ khác (như `*.workers.dev`) trả về `X-Robots-Tag: noindex` để Google chỉ index tên miền chính.
- Thêm bài blog: thêm một mục vào `POSTS` trong `site/content/posts.ts`. Thêm chủ đề: `site/content/topics.ts`. Sitemap tự cập nhật.
- Ảnh chụp màn hình và ảnh chia sẻ nằm trong `public/img/`.

## Thêm đoạn văn

Thêm một mục vào `PASSAGES` trong `src/data/passages.ts` với `topicId`, `title`, `en` và `vi`. Muốn thêm chủ đề mới thì thêm vào `TOPICS`.
