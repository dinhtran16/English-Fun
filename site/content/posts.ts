/** Blog posts (Vietnamese). Bodies are trusted HTML written here, not user input. */

export interface Post {
  slug: string
  title: string
  description: string
  /** ISO date (yyyy-mm-dd). */
  date: string
  readMinutes: number
  body: string
}

export const POSTS: Post[] = [
  {
    slug: 'cach-hoc-tu-vung-tieng-anh-nho-lau',
    title: 'Cách học từ vựng tiếng Anh nhớ lâu cho người đi làm',
    description:
      'Học từ vựng tiếng Anh mà không quên sau vài ngày: học từ trong ngữ cảnh, tự xây kho từ, ôn đúng lúc và dùng từ khi viết. Phương pháp đơn giản cho người bận rộn.',
    date: '2026-11-26',
    readMinutes: 6,
    body: `
<p>Nhiều người học tiếng Anh từng chép hàng trăm từ vào sổ, rồi một tuần sau chẳng nhớ được bao nhiêu. Vấn đề không nằm ở trí nhớ của bạn, mà ở cách học. Bài này tóm tắt bốn nguyên tắc giúp từ vựng thật sự ở lại trong đầu, phù hợp với người đi làm chỉ có 15 đến 20 phút mỗi ngày.</p>

<h2>1. Học từ trong ngữ cảnh, không học từ đơn lẻ</h2>
<p>Một từ đứng một mình rất khó nhớ. Nhưng khi bạn gặp nó trong một câu chuyện, não có thêm "móc" để bám vào: tình huống, nhân vật, cảm xúc. Ví dụ, từ <strong>deadline</strong> sẽ dễ nhớ hơn nhiều khi bạn đọc câu: <em>"Her manager has noticed that she rarely misses a deadline."</em></p>
<p>Vì vậy, thay vì học danh sách từ, hãy đọc một đoạn văn ngắn thuộc chủ đề bạn quan tâm và nhặt ra những từ bạn chưa biết. Bạn vừa học từ, vừa học luôn cách người bản xứ dùng nó.</p>

<h2>2. Tự xây kho từ của riêng bạn</h2>
<p>Danh sách "3000 từ thông dụng" hữu ích, nhưng từ bạn tự gặp và tự chọn mới là từ bạn cần. Mỗi khi gặp từ mới khi đọc, hãy lưu lại cùng:</p>
<ul>
  <li>nghĩa tiếng Việt ngắn gọn,</li>
  <li>phiên âm (để đọc đúng ngay từ đầu),</li>
  <li>câu gốc mà bạn đã gặp từ đó.</li>
</ul>
<p>Câu gốc là phần quan trọng nhất. Khi ôn lại, bạn nhớ cả bối cảnh chứ không chỉ một cặp từ và nghĩa.</p>

<h2>3. Ôn lại đúng lúc sắp quên</h2>
<p>Đường cong quên lãng cho thấy chúng ta quên phần lớn thông tin mới chỉ sau vài ngày nếu không ôn. Tin tốt là mỗi lần ôn đúng lúc, khoảng cách đến lần quên tiếp theo dài ra. Một lịch đơn giản:</p>
<ol>
  <li>Ôn ngay hôm sau khi học.</li>
  <li>Ôn lại sau 3 ngày.</li>
  <li>Ôn lại sau 1 tuần, rồi sau 1 tháng.</li>
</ol>
<p>Những từ bạn trả lời sai nên được ôn sớm hơn. Bạn không cần phần mềm phức tạp: chỉ cần ưu tiên ôn những từ mới và những từ lần trước bạn quên.</p>

<h2>4. Dùng từ khi viết, đó là lúc từ trở thành của bạn</h2>
<p>Nhận ra một từ khi đọc (từ vựng thụ động) dễ hơn nhiều so với tự dùng nó (từ vựng chủ động). Cách nhanh nhất để chuyển từ thụ động sang chủ động là <strong>viết</strong>: dịch một đoạn ngắn từ tiếng Việt sang tiếng Anh, và cố dùng 3 đến 5 từ trong kho của bạn.</p>
<p>Khi viết, bạn buộc phải nhớ chính tả, chọn đúng dạng từ và ghép từ với những từ đi kèm. Đó là lý do một từ bạn đã viết đúng một lần thường nhớ lâu hơn một từ bạn đọc lại mười lần.</p>

<h2>Một buổi học 15 phút mẫu</h2>
<ul>
  <li><strong>5 phút:</strong> đọc một đoạn văn ngắn, lưu 3 đến 5 từ mới.</li>
  <li><strong>5 phút:</strong> ôn những từ đến hạn trong kho từ.</li>
  <li><strong>5 phút:</strong> dịch một đoạn ngắn sang tiếng Anh, dùng các từ vừa ôn.</li>
</ul>
<p>Đây cũng chính là cách English Fun được thiết kế: bạn đọc đoạn văn theo chủ đề, bấm vào từ để xem nghĩa và lưu vào kho, rồi luyện viết với bài dịch có chèn sẵn từ trong kho của bạn.</p>
`,
  },
  {
    slug: 'luyen-doc-hieu-tieng-anh-moi-ngay',
    title: 'Luyện đọc hiểu tiếng Anh mỗi ngày: phương pháp 15 phút',
    description:
      'Cách luyện đọc hiểu tiếng Anh hiệu quả cho người lớn: chọn bài đúng trình độ, đọc hai lượt, tự dịch rồi so với bản dịch mẫu, và lưu từ mới vào kho.',
    date: '2026-11-26',
    readMinutes: 5,
    body: `
<p>Đọc là cách rẻ và hiệu quả nhất để tăng vốn từ, làm quen với ngữ pháp và cải thiện cả kỹ năng viết. Nhưng đọc sai cách (bài quá khó, tra từng chữ) rất dễ làm bạn nản. Dưới đây là phương pháp 15 phút mỗi ngày mà bạn có thể duy trì lâu dài.</p>

<h2>Chọn bài đọc đúng trình độ</h2>
<p>Một bài đọc vừa sức là bài mà bạn hiểu được khoảng 90 đến 95% số từ. Nếu phải tra quá nửa câu, bài đó quá khó và bạn sẽ mất động lực. Hãy bắt đầu với những đoạn ngắn 80 đến 120 từ, theo các chủ đề quen thuộc như công việc, du lịch, sức khỏe.</p>
<p>Một mẹo hữu ích: xác định trình độ của bạn theo khung CEFR (A2, B1, B2, C1) và chọn bài ở đúng mức đó. Khi thấy bài quá dễ, tăng lên một bậc.</p>

<h2>Đọc hai lượt</h2>
<ol>
  <li><strong>Lượt 1, đọc lấy ý:</strong> đọc hết đoạn mà không dừng lại tra từ. Đoán nghĩa từ mới qua ngữ cảnh. Sau lượt này, thử tóm tắt đoạn văn trong một câu.</li>
  <li><strong>Lượt 2, đọc kỹ:</strong> lúc này mới tra những từ ảnh hưởng đến ý chính. Không cần tra mọi từ, chỉ những từ bạn thấy sẽ gặp lại.</li>
</ol>

<h2>Tự dịch, rồi so với bản dịch mẫu</h2>
<p>Viết bản dịch tiếng Việt của riêng bạn, kể cả chỉ là vài câu. Sau đó mới mở bản dịch mẫu để so. Bước này giúp bạn phát hiện những chỗ mình "tưởng là hiểu" nhưng thật ra hiểu sai, nhất là với cụm động từ và thành ngữ.</p>

<h2>Lưu từ mới, đừng chỉ đọc qua</h2>
<p>Mỗi bài, chọn 3 đến 5 từ đáng học nhất và lưu lại cùng câu gốc. Đừng lưu quá nhiều: một kho từ nhỏ mà bạn thật sự ôn sẽ hữu ích hơn một danh sách dài mà bạn không bao giờ mở lại.</p>

<h2>Nghe lại đoạn văn</h2>
<p>Nếu có thể, nghe đoạn văn được đọc to sau khi bạn đã hiểu nó. Bạn sẽ học được cách phát âm và nhịp điệu của câu, và lần sau gặp lại các từ đó khi nghe, bạn sẽ nhận ra ngay.</p>

<h2>Tóm tắt phương pháp</h2>
<ul>
  <li>Bài ngắn, đúng trình độ, đúng chủ đề bạn quan tâm.</li>
  <li>Đọc lấy ý trước, tra từ sau.</li>
  <li>Tự dịch rồi so với bản mẫu.</li>
  <li>Lưu 3 đến 5 từ, ôn lại vào những ngày sau.</li>
</ul>
<p>Trong English Fun, mỗi bài đọc đều có nút nghe, ô để viết bản dịch của bạn, nút xem bản dịch mẫu và bảng bên cạnh để tra và lưu từ chỉ với một cú bấm.</p>
`,
  },
  {
    slug: 'luyen-viet-tieng-anh-bang-cach-dich',
    title: 'Luyện viết tiếng Anh bằng cách dịch Việt sang Anh',
    description:
      'Dịch Việt sang Anh là cách luyện viết tiếng Anh hiệu quả cho người tự học: vì sao nó hiệu quả, cách làm từng bước, lỗi thường gặp và cách tự sửa bài.',
    date: '2026-11-26',
    readMinutes: 6,
    body: `
<p>Viết là kỹ năng nhiều người ngại nhất vì không biết bắt đầu từ đâu và không có ai sửa bài. Dịch từ tiếng Việt sang tiếng Anh giải quyết được cả hai vấn đề: bạn đã có sẵn ý để viết, và có một bản gốc tiếng Anh để so sánh.</p>

<h2>Vì sao dịch giúp viết tốt hơn</h2>
<ul>
  <li><strong>Không phải nghĩ ý:</strong> bạn tập trung hoàn toàn vào cách diễn đạt.</li>
  <li><strong>Lộ ra lỗ hổng:</strong> những câu bạn không dịch được chính là những cấu trúc bạn cần học.</li>
  <li><strong>Có đáp án để so:</strong> nếu đoạn văn được dịch ngược từ một bản tiếng Anh, bạn có thể so bài của mình với bản gốc.</li>
</ul>

<h2>Cách làm từng bước</h2>
<ol>
  <li><strong>Chọn đoạn ngắn:</strong> 3 đến 5 câu là đủ. Dịch ít mà kỹ tốt hơn dịch nhiều mà vội.</li>
  <li><strong>Đặt mục tiêu từ vựng:</strong> chọn 3 đến 5 từ trong kho từ của bạn và cố dùng chúng trong bài dịch.</li>
  <li><strong>Dịch ý, không dịch từng chữ:</strong> "Tôi hay quên hạn nộp" không phải "I often forget the submission limit" mà là "I often miss deadlines".</li>
  <li><strong>Tự đọc lại:</strong> kiểm tra thì của động từ, số ít số nhiều và mạo từ a, an, the.</li>
  <li><strong>So với bản gốc hoặc nhờ chấm:</strong> ghi lại những chỗ khác biệt và vì sao.</li>
</ol>

<h2>Những lỗi người Việt hay gặp</h2>
<ul>
  <li><strong>Quên chia động từ:</strong> "He go to work" thay vì "He goes to work". Tiếng Việt không chia động từ nên đây là lỗi phổ biến nhất.</li>
  <li><strong>Thiếu mạo từ:</strong> "I bought car" thay vì "I bought a car".</li>
  <li><strong>Sai thì:</strong> kể chuyện đã xảy ra nhưng dùng thì hiện tại.</li>
  <li><strong>Dịch sát chữ:</strong> "open the light" thay vì "turn on the light".</li>
</ul>
<p>Hãy ghi lại các lỗi của mình. Sau vài tuần, bạn sẽ thấy chúng lặp lại theo một vài kiểu nhất định, và chỉ cần tập trung sửa những kiểu đó.</p>

<h2>Viết thêm vài câu của riêng bạn</h2>
<p>Sau khi dịch xong, viết thêm 2 đến 3 câu dùng những từ mục tiêu mà bạn chưa dùng được. Câu do chính bạn nghĩ ra, về cuộc sống của bạn, là cách tốt nhất để biến từ mới thành từ của mình.</p>

<p>English Fun có sẵn chế độ <strong>Viết và dịch</strong>: app đưa cho bạn một đoạn tiếng Việt có chứa các từ trong kho từ của bạn, bạn dịch sang tiếng Anh, rồi so với bản gốc. Khi đăng nhập, AI còn chấm điểm, chỉ ra lỗi và gợi ý cách sửa.</p>
`,
  },
  {
    slug: 'lo-trinh-tu-hoc-tieng-anh-cho-nguoi-di-lam',
    title: 'Lộ trình tự học tiếng Anh cho người đi làm bận rộn',
    description:
      'Lộ trình tự học tiếng Anh cho người lớn đi làm: mỗi ngày 20 phút, tập trung đọc, viết và từ vựng theo chủ đề công việc, kèm kế hoạch 4 tuần cụ thể.',
    date: '2026-11-26',
    readMinutes: 5,
    body: `
<p>Đi làm cả ngày, về nhà còn việc gia đình, nên rất khó dành ra hàng giờ để học tiếng Anh. Tin tốt là bạn không cần nhiều thời gian, mà cần đều đặn. 20 phút mỗi ngày, duy trì trong vài tháng, hiệu quả hơn nhiều so với một buổi học 3 tiếng mỗi cuối tuần.</p>

<h2>Bắt đầu từ mục tiêu thật của bạn</h2>
<p>Bạn học tiếng Anh để làm gì: đọc tài liệu chuyên môn, viết email cho đối tác, hay đi du lịch? Mục tiêu quyết định bạn nên ưu tiên chủ đề và kỹ năng nào. Với phần lớn người đi làm, <strong>đọc</strong> và <strong>viết</strong> là hai kỹ năng dùng nhiều nhất, và cũng là hai kỹ năng dễ tự luyện nhất.</p>

<h2>Khung 20 phút mỗi ngày</h2>
<ul>
  <li><strong>5 phút ôn từ:</strong> ôn những từ đến hạn trong kho từ của bạn.</li>
  <li><strong>10 phút đọc hoặc viết:</strong> ngày chẵn đọc một đoạn văn, ngày lẻ dịch một đoạn sang tiếng Anh.</li>
  <li><strong>5 phút dùng từ:</strong> viết 2 đến 3 câu về chính ngày hôm nay của bạn, dùng từ mới.</li>
</ul>

<h2>Kế hoạch 4 tuần mẫu</h2>
<ol>
  <li><strong>Tuần 1, Công việc:</strong> từ vựng về lịch làm việc, cuộc họp, deadline. Mục tiêu: lưu 20 từ.</li>
  <li><strong>Tuần 2, Công nghệ:</strong> từ vựng về thiết bị, phần mềm, bảo mật. Bắt đầu dịch đoạn ngắn 3 câu.</li>
  <li><strong>Tuần 3, Sức khỏe và Đời sống:</strong> chủ đề gần gũi để luyện viết về bản thân.</li>
  <li><strong>Tuần 4, Du lịch và ôn tập:</strong> ôn toàn bộ kho từ, viết một đoạn 100 từ về kế hoạch du lịch của bạn.</li>
</ol>

<h2>Giữ động lực lâu dài</h2>
<ul>
  <li><strong>Đo tiến bộ bằng con số:</strong> số từ trong kho, số bài đã đọc, điểm bài viết.</li>
  <li><strong>Học cùng giờ mỗi ngày:</strong> gắn việc học với một thói quen có sẵn, như sau bữa sáng hoặc trên xe buýt.</li>
  <li><strong>Cho phép mình nghỉ:</strong> bỏ một ngày không sao, chỉ đừng bỏ hai ngày liền.</li>
  <li><strong>Tăng độ khó từ từ:</strong> khi thấy bài đọc quá dễ, tăng trình độ lên một bậc.</li>
</ul>

<p>Nếu bạn muốn một công cụ gọn gàng cho đúng lộ trình này, hãy thử English Fun: chọn chủ đề, chọn trình độ, đọc hoặc viết, và mọi từ mới đều được gom vào kho từ để ôn lại.</p>
`,
  },
]
