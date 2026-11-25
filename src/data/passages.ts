import type { Passage, Topic } from '../types'

export const TOPICS: Topic[] = [
  { id: 'work', name: 'Công việc', emoji: '💼' },
  { id: 'travel', name: 'Du lịch', emoji: '✈️' },
  { id: 'technology', name: 'Công nghệ', emoji: '💻' },
  { id: 'health', name: 'Sức khỏe', emoji: '🏃' },
  { id: 'daily', name: 'Đời sống', emoji: '🏠' },
]

export const PASSAGES: Passage[] = [
  {
    id: 'work-1',
    topicId: 'work',
    title: 'A Productive Morning',
    en: 'Every morning, Linh arrives at the office before her colleagues. She uses the quiet time to review her schedule and answer urgent emails. By nine o’clock, she has a clear list of priorities for the day. Her manager has noticed that she rarely misses a deadline. Linh believes that preparation is the secret to staying calm when unexpected problems appear during a busy week.',
    vi: 'Mỗi sáng, Linh đến văn phòng trước các đồng nghiệp. Cô tận dụng khoảng thời gian yên tĩnh để xem lại lịch làm việc và trả lời các email khẩn. Đến chín giờ, cô đã có một danh sách ưu tiên rõ ràng cho ngày hôm đó. Quản lý của cô nhận thấy rằng cô hiếm khi trễ hạn. Linh tin rằng sự chuẩn bị là bí quyết để giữ bình tĩnh khi những vấn đề bất ngờ xuất hiện trong một tuần bận rộn.',
  },
  {
    id: 'work-2',
    topicId: 'work',
    title: 'The Job Interview',
    en: 'Before the interview, Minh researched the company carefully. He learned about its products, its customers and its recent achievements. During the meeting, the interviewer asked him to describe a challenge he had overcome. Minh explained how he had solved a conflict within his team by listening to everyone’s opinion. At the end, he asked thoughtful questions about the role, which left a positive impression.',
    vi: 'Trước buổi phỏng vấn, Minh đã tìm hiểu kỹ về công ty. Anh tìm hiểu về sản phẩm, khách hàng và những thành tựu gần đây của công ty. Trong buổi gặp, người phỏng vấn yêu cầu anh mô tả một thử thách mà anh đã vượt qua. Minh giải thích cách anh giải quyết một mâu thuẫn trong nhóm bằng cách lắng nghe ý kiến của mọi người. Cuối buổi, anh đặt những câu hỏi sâu sắc về vị trí công việc, điều này để lại ấn tượng tích cực.',
  },
  {
    id: 'work-3',
    topicId: 'work',
    title: 'Working From Home',
    en: 'Working from home offers flexibility, but it also requires discipline. Without a commute, people can save time and money. However, it is easy to become distracted by household tasks or social media. Many remote workers create a dedicated workspace and set fixed hours. They also schedule regular video calls to stay connected with their teams and avoid feeling isolated.',
    vi: 'Làm việc tại nhà mang lại sự linh hoạt, nhưng cũng đòi hỏi tính kỷ luật. Không phải di chuyển, mọi người có thể tiết kiệm thời gian và tiền bạc. Tuy nhiên, rất dễ bị phân tâm bởi việc nhà hoặc mạng xã hội. Nhiều người làm việc từ xa tạo ra một góc làm việc riêng và đặt giờ làm cố định. Họ cũng lên lịch các cuộc gọi video thường xuyên để giữ kết nối với nhóm và tránh cảm giác bị cô lập.',
  },
  {
    id: 'travel-1',
    topicId: 'travel',
    title: 'A Weekend in Hoi An',
    en: 'Last weekend, we took a short trip to Hoi An. The ancient town was crowded with tourists, but it still felt peaceful in the early morning. We wandered through narrow streets lined with yellow houses and colorful lanterns. In the evening, we released paper lanterns on the river and made a wish. The local food was delicious, especially the noodles we bought from a small stall near the market.',
    vi: 'Cuối tuần trước, chúng tôi có một chuyến đi ngắn đến Hội An. Phố cổ đông nghịt khách du lịch, nhưng vào sáng sớm vẫn mang lại cảm giác yên bình. Chúng tôi lang thang qua những con phố hẹp với hai bên là những ngôi nhà vàng và đèn lồng nhiều màu sắc. Buổi tối, chúng tôi thả đèn hoa đăng trên sông và ước một điều. Đồ ăn địa phương rất ngon, đặc biệt là món mì chúng tôi mua ở một quầy nhỏ gần chợ.',
  },
  {
    id: 'travel-2',
    topicId: 'travel',
    title: 'A Missed Flight',
    en: 'Our flight was scheduled to depart at six in the morning, but heavy traffic delayed us on the way to the airport. When we finally reached the check-in counter, the gate had already closed. The airline staff were sympathetic and helped us book a seat on the next available flight. Although we lost half a day, the experience taught us to always leave extra time when we travel.',
    vi: 'Chuyến bay của chúng tôi dự kiến khởi hành lúc sáu giờ sáng, nhưng tắc đường nghiêm trọng đã làm chúng tôi bị chậm trên đường ra sân bay. Khi cuối cùng đến được quầy làm thủ tục, cửa lên máy bay đã đóng. Nhân viên hãng bay rất thông cảm và giúp chúng tôi đặt chỗ trên chuyến bay gần nhất còn trống. Dù mất nửa ngày, trải nghiệm này dạy chúng tôi luôn dành thêm thời gian khi đi du lịch.',
  },
  {
    id: 'travel-3',
    topicId: 'travel',
    title: 'Traveling Light',
    en: 'More travelers are choosing to pack only a small backpack. Traveling light makes it easier to move between cities, use public transport and avoid baggage fees. The key is to bring versatile clothes that can be combined in different ways. Many people also discover that they need far fewer things than they expected, which gives them a sense of freedom.',
    vi: 'Ngày càng nhiều du khách chọn chỉ mang theo một chiếc ba lô nhỏ. Du lịch gọn nhẹ giúp việc di chuyển giữa các thành phố, sử dụng phương tiện công cộng và tránh phí hành lý trở nên dễ dàng hơn. Bí quyết là mang theo quần áo đa năng có thể phối theo nhiều cách khác nhau. Nhiều người cũng nhận ra rằng họ cần ít đồ hơn nhiều so với dự tính, điều đó mang lại cho họ cảm giác tự do.',
  },
  {
    id: 'technology-1',
    topicId: 'technology',
    title: 'Smartphones and Attention',
    en: 'Smartphones have made our lives more convenient, but they also compete for our attention. Notifications constantly interrupt our work and conversations. Some researchers argue that this habit reduces our ability to focus for long periods. To protect their concentration, many people now turn off unnecessary alerts and keep their phones out of the bedroom at night.',
    vi: 'Điện thoại thông minh đã làm cuộc sống của chúng ta tiện lợi hơn, nhưng chúng cũng tranh giành sự chú ý của chúng ta. Thông báo liên tục làm gián đoạn công việc và các cuộc trò chuyện. Một số nhà nghiên cứu cho rằng thói quen này làm giảm khả năng tập trung trong thời gian dài. Để bảo vệ sự tập trung, nhiều người hiện nay tắt các cảnh báo không cần thiết và để điện thoại ngoài phòng ngủ vào ban đêm.',
  },
  {
    id: 'technology-2',
    topicId: 'technology',
    title: 'Learning With AI',
    en: 'Artificial intelligence is changing the way people learn. Students can ask an AI assistant to explain a difficult concept in simple words or to generate practice questions. However, teachers warn that relying on these tools too much may prevent learners from developing their own thinking skills. The most effective approach is to use AI as a guide rather than a replacement for effort.',
    vi: 'Trí tuệ nhân tạo đang thay đổi cách con người học tập. Học sinh có thể nhờ trợ lý AI giải thích một khái niệm khó bằng lời lẽ đơn giản hoặc tạo câu hỏi luyện tập. Tuy nhiên, giáo viên cảnh báo rằng phụ thuộc quá nhiều vào những công cụ này có thể ngăn người học phát triển kỹ năng tư duy của riêng mình. Cách hiệu quả nhất là dùng AI như một người hướng dẫn thay vì thay thế cho sự nỗ lực.',
  },
  {
    id: 'technology-3',
    topicId: 'technology',
    title: 'Online Security',
    en: 'Every year, millions of accounts are hacked because of weak passwords. Security experts recommend using a password manager to create long, unique passwords for each website. They also suggest enabling two-factor authentication, which adds an extra layer of protection. Being careful with suspicious links in emails is another simple habit that can prevent serious damage.',
    vi: 'Mỗi năm, hàng triệu tài khoản bị tấn công vì mật khẩu yếu. Các chuyên gia bảo mật khuyên nên dùng trình quản lý mật khẩu để tạo mật khẩu dài và riêng biệt cho từng trang web. Họ cũng đề xuất bật xác thực hai lớp, giúp thêm một lớp bảo vệ. Cẩn thận với các đường link đáng ngờ trong email là một thói quen đơn giản khác có thể ngăn ngừa thiệt hại nghiêm trọng.',
  },
  {
    id: 'health-1',
    topicId: 'health',
    title: 'The Power of Sleep',
    en: 'Sleep is one of the most important factors for good health, yet many adults do not get enough of it. A lack of sleep can weaken the immune system and affect our mood and memory. Experts recommend going to bed at the same time every night and avoiding screens for an hour before sleeping. Even small improvements in sleep quality can make a noticeable difference.',
    vi: 'Giấc ngủ là một trong những yếu tố quan trọng nhất cho sức khỏe, vậy mà nhiều người trưởng thành lại ngủ không đủ. Thiếu ngủ có thể làm suy yếu hệ miễn dịch và ảnh hưởng đến tâm trạng cũng như trí nhớ. Các chuyên gia khuyên nên đi ngủ vào cùng một giờ mỗi tối và tránh dùng màn hình một tiếng trước khi ngủ. Ngay cả những cải thiện nhỏ về chất lượng giấc ngủ cũng có thể tạo ra khác biệt rõ rệt.',
  },
  {
    id: 'health-2',
    topicId: 'health',
    title: 'Walking Every Day',
    en: 'You do not need an expensive gym membership to stay fit. Walking for thirty minutes a day can strengthen your heart, improve your mood and help you maintain a healthy weight. It is also a great opportunity to clear your mind or listen to a podcast. Many people find it easier to build this habit by walking with a friend or taking the stairs instead of the elevator.',
    vi: 'Bạn không cần thẻ thành viên phòng tập đắt tiền để giữ dáng. Đi bộ ba mươi phút mỗi ngày có thể làm tim khỏe hơn, cải thiện tâm trạng và giúp bạn duy trì cân nặng hợp lý. Đó cũng là cơ hội tuyệt vời để thư giãn đầu óc hoặc nghe podcast. Nhiều người thấy dễ xây dựng thói quen này hơn khi đi bộ cùng bạn bè hoặc đi cầu thang bộ thay vì thang máy.',
  },
  {
    id: 'daily-1',
    topicId: 'daily',
    title: 'Cooking at Home',
    en: 'Cooking at home has become a popular hobby for many young people. It allows them to control the ingredients and eat more healthily. It is also cheaper than eating out every day. At first, following a recipe can feel complicated, but with practice it becomes relaxing. Sharing a homemade meal with friends or family is one of life’s simple pleasures.',
    vi: 'Nấu ăn tại nhà đã trở thành sở thích phổ biến của nhiều người trẻ. Nó giúp họ kiểm soát nguyên liệu và ăn uống lành mạnh hơn. Việc này cũng rẻ hơn so với ăn ngoài mỗi ngày. Lúc đầu, làm theo công thức có thể thấy phức tạp, nhưng luyện tập nhiều sẽ thấy thư giãn. Chia sẻ một bữa ăn tự nấu với bạn bè hoặc gia đình là một trong những niềm vui giản dị của cuộc sống.',
  },
  {
    id: 'daily-2',
    topicId: 'daily',
    title: 'Saving Money',
    en: 'Saving money is not always easy, especially when prices keep rising. A good first step is to track your spending for a month to see where your money goes. Many people are surprised by how much they spend on small items like coffee and snacks. Once you understand your habits, you can set a realistic budget and put aside a fixed amount each month for emergencies.',
    vi: 'Tiết kiệm tiền không phải lúc nào cũng dễ, nhất là khi giá cả liên tục tăng. Bước đầu tiên tốt là theo dõi chi tiêu trong một tháng để xem tiền của bạn đi đâu. Nhiều người ngạc nhiên vì họ chi nhiều cho những thứ nhỏ như cà phê và đồ ăn vặt. Khi đã hiểu thói quen của mình, bạn có thể đặt ra ngân sách thực tế và để dành một khoản cố định mỗi tháng cho những trường hợp khẩn cấp.',
  },
]

export function passagesFor(topicId: string): Passage[] {
  return PASSAGES.filter((p) => p.topicId === topicId)
}

export function randomPassage(topicId: string, excludeId?: string): Passage {
  const list = passagesFor(topicId)
  const pool = list.length > 1 ? list.filter((p) => p.id !== excludeId) : list
  return pool[Math.floor(Math.random() * pool.length)]
}
