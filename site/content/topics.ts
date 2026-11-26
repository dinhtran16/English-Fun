/** Public topic pages: sample vocabulary and phrases per topic (static, no AI). */

export interface Word {
  word: string
  ipa: string
  pos: string
  vi: string
  example: string
}

export interface TopicContent {
  /** Matches the topic id used inside the app (src/data/passages.ts). */
  id: string
  slug: string
  name: string
  h1: string
  title: string
  description: string
  intro: string
  words: Word[]
  phrases: [string, string][]
  tips: string[]
}

export const TOPIC_PAGES: TopicContent[] = [
  {
    id: 'work',
    slug: 'tu-vung-tieng-anh-chu-de-cong-viec',
    name: 'Công việc',
    h1: 'Từ vựng tiếng Anh chủ đề công việc',
    title: 'Từ vựng tiếng Anh chủ đề công việc, văn phòng (kèm phiên âm, ví dụ)',
    description:
      'Học từ vựng tiếng Anh chủ đề công việc và văn phòng: deadline, colleague, promotion... có phiên âm, nghĩa tiếng Việt, câu ví dụ và một đoạn đọc mẫu có bản dịch.',
    intro:
      'Đây là những từ bạn gặp hằng ngày trong email, cuộc họp và buổi phỏng vấn. Mỗi từ có phiên âm, nghĩa và một câu ví dụ ngắn. Cuối trang có đoạn đọc mẫu để bạn thấy các từ này được dùng trong ngữ cảnh thật.',
    words: [
      { word: 'colleague', ipa: '/ˈkɒliːɡ/', pos: 'n', vi: 'đồng nghiệp', example: 'My colleagues helped me finish the report.' },
      { word: 'deadline', ipa: '/ˈdedlaɪn/', pos: 'n', vi: 'hạn chót', example: 'The deadline for this project is Friday.' },
      { word: 'schedule', ipa: '/ˈʃedjuːl/', pos: 'n', vi: 'lịch làm việc', example: 'Let me check my schedule for next week.' },
      { word: 'priority', ipa: '/praɪˈɒrəti/', pos: 'n', vi: 'việc ưu tiên', example: 'Customer safety is our top priority.' },
      { word: 'urgent', ipa: '/ˈɜːdʒənt/', pos: 'adj', vi: 'khẩn cấp', example: 'I have an urgent email to answer.' },
      { word: 'manager', ipa: '/ˈmænɪdʒə(r)/', pos: 'n', vi: 'người quản lý', example: 'Her manager approved the plan.' },
      { word: 'interview', ipa: '/ˈɪntəvjuː/', pos: 'n', vi: 'buổi phỏng vấn', example: 'He prepared carefully for the interview.' },
      { word: 'achievement', ipa: '/əˈtʃiːvmənt/', pos: 'n', vi: 'thành tựu', example: 'Winning the contract was a big achievement.' },
      { word: 'challenge', ipa: '/ˈtʃælɪndʒ/', pos: 'n', vi: 'thử thách', example: 'Learning a new system is a real challenge.' },
      { word: 'conflict', ipa: '/ˈkɒnflɪkt/', pos: 'n', vi: 'mâu thuẫn', example: 'They solved the conflict by talking openly.' },
      { word: 'salary', ipa: '/ˈsæləri/', pos: 'n', vi: 'tiền lương', example: 'The job offers a good salary.' },
      { word: 'promotion', ipa: '/prəˈməʊʃn/', pos: 'n', vi: 'sự thăng chức', example: 'She got a promotion after two years.' },
      { word: 'commute', ipa: '/kəˈmjuːt/', pos: 'v', vi: 'đi lại (giữa nhà và nơi làm)', example: 'I commute to work by bus.' },
      { word: 'remote', ipa: '/rɪˈməʊt/', pos: 'adj', vi: 'từ xa', example: 'Many companies now allow remote work.' },
      { word: 'flexibility', ipa: '/ˌfleksəˈbɪləti/', pos: 'n', vi: 'sự linh hoạt', example: 'Working from home gives me more flexibility.' },
      { word: 'discipline', ipa: '/ˈdɪsəplɪn/', pos: 'n', vi: 'tính kỷ luật', example: 'Remote work requires a lot of discipline.' },
      { word: 'responsibility', ipa: '/rɪˌspɒnsəˈbɪləti/', pos: 'n', vi: 'trách nhiệm', example: 'Training new staff is my responsibility.' },
    ],
    phrases: [
      ['meet a deadline', 'kịp hạn chót'],
      ['work overtime', 'làm thêm giờ'],
      ['take a day off', 'nghỉ một ngày'],
      ['be in charge of', 'phụ trách việc gì'],
      ['apply for a job', 'nộp đơn xin việc'],
      ['run a meeting', 'chủ trì cuộc họp'],
    ],
    tips: [
      'Dùng ngay các từ này khi viết email công việc, dù chỉ một câu.',
      'Học theo cụm: "meet a deadline" dễ nhớ và dùng đúng hơn chỉ học "deadline".',
      'Đọc một đoạn ngắn về công việc mỗi ngày và lưu những từ bạn chưa chắc.',
    ],
  },
  {
    id: 'travel',
    slug: 'tu-vung-tieng-anh-chu-de-du-lich',
    name: 'Du lịch',
    h1: 'Từ vựng tiếng Anh chủ đề du lịch',
    title: 'Từ vựng tiếng Anh chủ đề du lịch, sân bay, khách sạn (có ví dụ)',
    description:
      'Từ vựng tiếng Anh chủ đề du lịch: flight, boarding pass, itinerary, accommodation... có phiên âm, nghĩa tiếng Việt, câu ví dụ và đoạn đọc mẫu có bản dịch.',
    intro:
      'Bộ từ cho mọi chặng của chuyến đi: đặt vé, làm thủ tục ở sân bay, nhận phòng khách sạn và đi tham quan. Học xong, hãy đọc đoạn mẫu ở cuối trang để ôn lại trong ngữ cảnh.',
    words: [
      { word: 'flight', ipa: '/flaɪt/', pos: 'n', vi: 'chuyến bay', example: 'Our flight leaves at six in the morning.' },
      { word: 'depart', ipa: '/dɪˈpɑːt/', pos: 'v', vi: 'khởi hành', example: 'The train departs from platform 3.' },
      { word: 'delay', ipa: '/dɪˈleɪ/', pos: 'v', vi: 'làm trễ, hoãn', example: 'Heavy rain delayed our flight.' },
      { word: 'check-in counter', ipa: '/ˈtʃek ɪn ˌkaʊntə(r)/', pos: 'n', vi: 'quầy làm thủ tục', example: 'Please go to the check-in counter first.' },
      { word: 'boarding pass', ipa: '/ˈbɔːdɪŋ pɑːs/', pos: 'n', vi: 'thẻ lên máy bay', example: 'Show your boarding pass at the gate.' },
      { word: 'gate', ipa: '/ɡeɪt/', pos: 'n', vi: 'cửa ra máy bay', example: 'The gate closes twenty minutes before departure.' },
      { word: 'luggage', ipa: '/ˈlʌɡɪdʒ/', pos: 'n', vi: 'hành lý', example: 'I only have one piece of luggage.' },
      { word: 'destination', ipa: '/ˌdestɪˈneɪʃn/', pos: 'n', vi: 'điểm đến', example: 'Da Nang is a popular destination.' },
      { word: 'itinerary', ipa: '/aɪˈtɪnərəri/', pos: 'n', vi: 'lịch trình chuyến đi', example: 'Our itinerary includes three cities.' },
      { word: 'accommodation', ipa: '/əˌkɒməˈdeɪʃn/', pos: 'n', vi: 'chỗ ở', example: 'We booked our accommodation online.' },
      { word: 'reservation', ipa: '/ˌrezəˈveɪʃn/', pos: 'n', vi: 'sự đặt chỗ', example: 'I have a reservation under the name Linh.' },
      { word: 'sightseeing', ipa: '/ˈsaɪtsiːɪŋ/', pos: 'n', vi: 'việc tham quan', example: 'We spent the afternoon sightseeing.' },
      { word: 'souvenir', ipa: '/ˌsuːvəˈnɪə(r)/', pos: 'n', vi: 'quà lưu niệm', example: 'She bought a lantern as a souvenir.' },
      { word: 'ancient', ipa: '/ˈeɪnʃənt/', pos: 'adj', vi: 'cổ, cổ kính', example: 'Hoi An is an ancient town.' },
      { word: 'crowded', ipa: '/ˈkraʊdɪd/', pos: 'adj', vi: 'đông đúc', example: 'The market was crowded with tourists.' },
      { word: 'local', ipa: '/ˈləʊkl/', pos: 'adj', vi: 'thuộc địa phương', example: 'Try the local food when you travel.' },
      { word: 'currency', ipa: '/ˈkʌrənsi/', pos: 'n', vi: 'tiền tệ', example: 'You can exchange currency at the airport.' },
    ],
    phrases: [
      ['book a flight', 'đặt vé máy bay'],
      ['pack your bags', 'xếp hành lý'],
      ['go sightseeing', 'đi tham quan'],
      ['travel light', 'đi du lịch gọn nhẹ'],
      ['get lost', 'bị lạc đường'],
      ['check out of a hotel', 'trả phòng khách sạn'],
    ],
    tips: [
      'Tập nói to các câu ví dụ, vì ở sân bay và khách sạn bạn sẽ cần nói nhiều hơn viết.',
      'Trước chuyến đi, viết lịch trình của bạn bằng tiếng Anh với các từ trên.',
      'Đọc review khách sạn bằng tiếng Anh: rất nhiều từ ở đây xuất hiện lặp lại.',
    ],
  },
  {
    id: 'technology',
    slug: 'tu-vung-tieng-anh-chu-de-cong-nghe',
    name: 'Công nghệ',
    h1: 'Từ vựng tiếng Anh chủ đề công nghệ',
    title: 'Từ vựng tiếng Anh chủ đề công nghệ, internet, bảo mật (có ví dụ)',
    description:
      'Từ vựng tiếng Anh chủ đề công nghệ: device, notification, password, artificial intelligence... có phiên âm, nghĩa tiếng Việt, câu ví dụ và đoạn đọc mẫu.',
    intro:
      'Bạn dùng điện thoại, máy tính và ứng dụng mỗi ngày, nên đây là nhóm từ rất đáng học. Trang này gồm những từ về thiết bị, internet, bảo mật và trí tuệ nhân tạo.',
    words: [
      { word: 'device', ipa: '/dɪˈvaɪs/', pos: 'n', vi: 'thiết bị', example: 'You can use the app on any device.' },
      { word: 'notification', ipa: '/ˌnəʊtɪfɪˈkeɪʃn/', pos: 'n', vi: 'thông báo', example: 'I turned off notifications at night.' },
      { word: 'password', ipa: '/ˈpɑːswɜːd/', pos: 'n', vi: 'mật khẩu', example: 'Use a long and unique password.' },
      { word: 'account', ipa: '/əˈkaʊnt/', pos: 'n', vi: 'tài khoản', example: 'Create an account to save your progress.' },
      { word: 'security', ipa: '/sɪˈkjʊərəti/', pos: 'n', vi: 'sự bảo mật, an ninh', example: 'Online security is everyone’s responsibility.' },
      { word: 'hack', ipa: '/hæk/', pos: 'v', vi: 'xâm nhập trái phép', example: 'His email account was hacked.' },
      { word: 'artificial intelligence', ipa: '/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/', pos: 'n', vi: 'trí tuệ nhân tạo', example: 'Artificial intelligence can explain difficult ideas.' },
      { word: 'software', ipa: '/ˈsɒftweə(r)/', pos: 'n', vi: 'phần mềm', example: 'Update your software regularly.' },
      { word: 'update', ipa: '/ˌʌpˈdeɪt/', pos: 'v', vi: 'cập nhật', example: 'The app updates automatically.' },
      { word: 'download', ipa: '/ˌdaʊnˈləʊd/', pos: 'v', vi: 'tải xuống', example: 'Download the file before the meeting.' },
      { word: 'data', ipa: '/ˈdeɪtə/', pos: 'n', vi: 'dữ liệu', example: 'Never share personal data with strangers.' },
      { word: 'screen', ipa: '/skriːn/', pos: 'n', vi: 'màn hình', example: 'Avoid screens for an hour before bed.' },
      { word: 'convenient', ipa: '/kənˈviːniənt/', pos: 'adj', vi: 'tiện lợi', example: 'Online banking is very convenient.' },
      { word: 'concentration', ipa: '/ˌkɒnsnˈtreɪʃn/', pos: 'n', vi: 'sự tập trung', example: 'Phone alerts break my concentration.' },
      { word: 'suspicious', ipa: '/səˈspɪʃəs/', pos: 'adj', vi: 'đáng ngờ', example: 'Do not click suspicious links.' },
      { word: 'authentication', ipa: '/ɔːˌθentɪˈkeɪʃn/', pos: 'n', vi: 'sự xác thực', example: 'Turn on two-factor authentication.' },
      { word: 'replacement', ipa: '/rɪˈpleɪsmənt/', pos: 'n', vi: 'sự thay thế', example: 'AI is a guide, not a replacement for effort.' },
    ],
    phrases: [
      ['log in to', 'đăng nhập vào'],
      ['back up your files', 'sao lưu dữ liệu'],
      ['turn off notifications', 'tắt thông báo'],
      ['run out of battery', 'hết pin'],
      ['keep up with', 'theo kịp'],
      ['go viral', 'lan truyền rộng rãi'],
    ],
    tips: [
      'Đổi ngôn ngữ điện thoại sang tiếng Anh trong một tuần: bạn sẽ học được rất nhiều từ ở trên.',
      'Khi gặp thông báo lỗi bằng tiếng Anh, đọc kỹ trước khi đóng, rồi lưu từ mới.',
      'Đọc tin công nghệ ngắn mỗi ngày, vì từ vựng lặp lại rất nhiều.',
    ],
  },
  {
    id: 'health',
    slug: 'tu-vung-tieng-anh-chu-de-suc-khoe',
    name: 'Sức khỏe',
    h1: 'Từ vựng tiếng Anh chủ đề sức khỏe',
    title: 'Từ vựng tiếng Anh chủ đề sức khỏe, thể thao, giấc ngủ (có ví dụ)',
    description:
      'Từ vựng tiếng Anh chủ đề sức khỏe: immune system, symptom, nutrition, work out... có phiên âm, nghĩa tiếng Việt, câu ví dụ và đoạn đọc mẫu có bản dịch.',
    intro:
      'Những từ dùng khi nói về giấc ngủ, ăn uống, luyện tập và đi khám bệnh. Đây là chủ đề hay gặp trong bài đọc IELTS và trong các cuộc trò chuyện hằng ngày.',
    words: [
      { word: 'immune system', ipa: '/ɪˈmjuːn ˌsɪstəm/', pos: 'n', vi: 'hệ miễn dịch', example: 'Sleep helps your immune system.' },
      { word: 'exercise', ipa: '/ˈeksəsaɪz/', pos: 'n', vi: 'sự tập thể dục', example: 'Regular exercise improves your mood.' },
      { word: 'strengthen', ipa: '/ˈstreŋkθn/', pos: 'v', vi: 'làm khỏe, tăng cường', example: 'Walking strengthens your heart.' },
      { word: 'mood', ipa: '/muːd/', pos: 'n', vi: 'tâm trạng', example: 'A short walk puts me in a better mood.' },
      { word: 'memory', ipa: '/ˈmeməri/', pos: 'n', vi: 'trí nhớ', example: 'Lack of sleep affects your memory.' },
      { word: 'diet', ipa: '/ˈdaɪət/', pos: 'n', vi: 'chế độ ăn', example: 'A balanced diet includes vegetables.' },
      { word: 'nutrition', ipa: '/njuˈtrɪʃn/', pos: 'n', vi: 'dinh dưỡng', example: 'Good nutrition is important for children.' },
      { word: 'weight', ipa: '/weɪt/', pos: 'n', vi: 'cân nặng', example: 'He wants to maintain a healthy weight.' },
      { word: 'maintain', ipa: '/meɪnˈteɪn/', pos: 'v', vi: 'duy trì', example: 'It is hard to maintain a new habit.' },
      { word: 'habit', ipa: '/ˈhæbɪt/', pos: 'n', vi: 'thói quen', example: 'Drinking water is a good habit.' },
      { word: 'symptom', ipa: '/ˈsɪmptəm/', pos: 'n', vi: 'triệu chứng', example: 'A sore throat is a common symptom.' },
      { word: 'recover', ipa: '/rɪˈkʌvə(r)/', pos: 'v', vi: 'hồi phục', example: 'She recovered quickly after the flu.' },
      { word: 'appointment', ipa: '/əˈpɔɪntmənt/', pos: 'n', vi: 'cuộc hẹn (khám bệnh)', example: 'I have a doctor’s appointment at ten.' },
      { word: 'prescription', ipa: '/prɪˈskrɪpʃn/', pos: 'n', vi: 'đơn thuốc', example: 'You need a prescription for this medicine.' },
      { word: 'stress', ipa: '/stres/', pos: 'n', vi: 'sự căng thẳng', example: 'Exercise is a good way to reduce stress.' },
      { word: 'quality', ipa: '/ˈkwɒləti/', pos: 'n', vi: 'chất lượng', example: 'Sleep quality matters more than hours.' },
      { word: 'membership', ipa: '/ˈmembəʃɪp/', pos: 'n', vi: 'thẻ hội viên', example: 'A gym membership can be expensive.' },
    ],
    phrases: [
      ['stay fit', 'giữ dáng, giữ sức khỏe'],
      ['work out', 'tập luyện'],
      ['get enough sleep', 'ngủ đủ giấc'],
      ['catch a cold', 'bị cảm lạnh'],
      ['cut down on', 'cắt giảm (đường, cà phê...)'],
      ['see a doctor', 'đi khám bác sĩ'],
    ],
    tips: [
      'Viết nhật ký sức khỏe ngắn bằng tiếng Anh: hôm nay ngủ mấy tiếng, ăn gì, tập gì.',
      'Học theo cặp động từ và danh từ, ví dụ "maintain a habit", "reduce stress".',
      'Nghe một podcast sức khỏe khi đi bộ để vừa luyện nghe vừa luyện tập.',
    ],
  },
  {
    id: 'daily',
    slug: 'tu-vung-tieng-anh-chu-de-doi-song',
    name: 'Đời sống',
    h1: 'Từ vựng tiếng Anh chủ đề đời sống hằng ngày',
    title: 'Từ vựng tiếng Anh chủ đề đời sống hằng ngày, nấu ăn, chi tiêu',
    description:
      'Từ vựng tiếng Anh về đời sống hằng ngày: recipe, ingredient, budget, housework... có phiên âm, nghĩa tiếng Việt, câu ví dụ và đoạn đọc mẫu có bản dịch.',
    intro:
      'Từ vựng cho những việc bạn làm mỗi ngày: nấu ăn, mua sắm, làm việc nhà và quản lý chi tiêu. Đây là nhóm từ dễ áp dụng nhất vì bạn có thể nói về chính cuộc sống của mình.',
    words: [
      { word: 'recipe', ipa: '/ˈresəpi/', pos: 'n', vi: 'công thức nấu ăn', example: 'I followed a simple recipe for pho.' },
      { word: 'ingredient', ipa: '/ɪnˈɡriːdiənt/', pos: 'n', vi: 'nguyên liệu', example: 'Fresh ingredients make food taste better.' },
      { word: 'homemade', ipa: '/ˌhəʊmˈmeɪd/', pos: 'adj', vi: 'tự làm ở nhà', example: 'Nothing beats a homemade meal.' },
      { word: 'hobby', ipa: '/ˈhɒbi/', pos: 'n', vi: 'sở thích', example: 'Cooking has become my favourite hobby.' },
      { word: 'routine', ipa: '/ruːˈtiːn/', pos: 'n', vi: 'nếp sinh hoạt hằng ngày', example: 'Reading is part of my morning routine.' },
      { word: 'housework', ipa: '/ˈhaʊswɜːk/', pos: 'n', vi: 'việc nhà', example: 'We share the housework at weekends.' },
      { word: 'laundry', ipa: '/ˈlɔːndri/', pos: 'n', vi: 'quần áo cần giặt', example: 'I do the laundry on Sunday.' },
      { word: 'grocery', ipa: '/ˈɡrəʊsəri/', pos: 'n', vi: 'cửa hàng tạp hóa', example: 'There is a small grocery near my house.' },
      { word: 'neighbour', ipa: '/ˈneɪbə(r)/', pos: 'n', vi: 'hàng xóm', example: 'Our neighbours are very friendly.' },
      { word: 'budget', ipa: '/ˈbʌdʒɪt/', pos: 'n', vi: 'ngân sách', example: 'Set a realistic budget for each month.' },
      { word: 'spending', ipa: '/ˈspendɪŋ/', pos: 'n', vi: 'khoản chi tiêu', example: 'Track your spending for a month.' },
      { word: 'emergency', ipa: '/iˈmɜːdʒənsi/', pos: 'n', vi: 'trường hợp khẩn cấp', example: 'Keep some money for emergencies.' },
      { word: 'afford', ipa: '/əˈfɔːd/', pos: 'v', vi: 'đủ khả năng chi trả', example: 'We can’t afford a new car this year.' },
      { word: 'rent', ipa: '/rent/', pos: 'n', vi: 'tiền thuê nhà', example: 'The rent is due on the first day of the month.' },
      { word: 'bill', ipa: '/bɪl/', pos: 'n', vi: 'hóa đơn', example: 'Did you pay the electricity bill?' },
      { word: 'realistic', ipa: '/ˌriːəˈlɪstɪk/', pos: 'adj', vi: 'thực tế', example: 'Make realistic plans for the weekend.' },
      { word: 'relaxing', ipa: '/rɪˈlæksɪŋ/', pos: 'adj', vi: 'thư giãn', example: 'Cooking at home feels relaxing.' },
    ],
    phrases: [
      ['do the housework', 'làm việc nhà'],
      ['eat out', 'ăn ở ngoài'],
      ['save up for', 'để dành tiền cho'],
      ['run errands', 'chạy việc vặt'],
      ['make ends meet', 'xoay xở đủ sống'],
      ['take out the rubbish', 'đổ rác'],
    ],
    tips: [
      'Tự kể một ngày của bạn bằng tiếng Anh trong 5 câu, dùng ít nhất 3 từ ở trên.',
      'Dán giấy ghi tên tiếng Anh lên đồ vật trong nhà trong một tuần.',
      'Viết danh sách đi chợ bằng tiếng Anh thay vì tiếng Việt.',
    ],
  },
]
