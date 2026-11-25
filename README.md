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

Kho từ được lưu trong `localStorage` của trình duyệt (chưa đồng bộ giữa các thiết bị).

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # kiểm tra kiểu và build ra dist/
npm run lint
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
| `src/storage.ts` | Lưu kho từ |
| `src/dictionary.ts` | Tra từ (dictionaryapi.dev, MyMemory) và phát âm (Web Speech API) |

## Thêm đoạn văn

Thêm một mục vào `PASSAGES` trong `src/data/passages.ts` với `topicId`, `title`, `en` và `vi`. Muốn thêm chủ đề mới thì thêm vào `TOPICS`.
