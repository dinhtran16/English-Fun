import type { Passage, Topic } from '../types'

/** `name` is the English name (sent to the AI); the interface shows the name from the locale files (topics). */
export const TOPICS: Topic[] = [
  { id: 'work', name: 'Work', emoji: '💼', tone: 'blue' },
  { id: 'travel', name: 'Travel', emoji: '✈️', tone: 'cyan' },
  { id: 'technology', name: 'Technology', emoji: '💻', tone: 'violet' },
  { id: 'health', name: 'Health', emoji: '🏃', tone: 'rose' },
  { id: 'daily', name: 'Daily life', emoji: '🏠', tone: 'amber' },
  { id: 'education', name: 'Education', emoji: '🎓', tone: 'indigo' },
  { id: 'food', name: 'Food and drink', emoji: '🍜', tone: 'orange' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', tone: 'teal' },
  { id: 'family', name: 'Family and friends', emoji: '👨‍👩‍👧', tone: 'pink' },
  { id: 'sports', name: 'Sports', emoji: '🏆', tone: 'lime' },
  { id: 'entertainment', name: 'Films and music', emoji: '🎬', tone: 'fuchsia' },
  { id: 'environment', name: 'Environment', emoji: '🌿', tone: 'green' },
]

export const PASSAGES: (Passage & { vi: string })[] = [
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
  {
    id: 'education-1',
    topicId: 'education',
    title: 'Learning as an Adult',
    en: 'Many adults believe they are too old to learn a new skill, but research shows that the brain keeps changing throughout our lives. The biggest obstacle is usually not age but a lack of time and confidence. Setting a small daily goal, such as studying for fifteen minutes, makes progress feel achievable. Adults also have an advantage: they can connect new knowledge to their own experience.',
    vi: 'Nhiều người trưởng thành nghĩ rằng mình đã quá già để học một kỹ năng mới, nhưng nghiên cứu cho thấy bộ não vẫn tiếp tục thay đổi trong suốt cuộc đời. Trở ngại lớn nhất thường không phải là tuổi tác mà là thiếu thời gian và sự tự tin. Đặt ra một mục tiêu nhỏ mỗi ngày, chẳng hạn học mười lăm phút, giúp sự tiến bộ trở nên khả thi. Người trưởng thành cũng có một lợi thế: họ có thể liên hệ kiến thức mới với trải nghiệm của chính mình.',
  },
  {
    id: 'education-2',
    topicId: 'education',
    title: 'Preparing for an Exam',
    en: 'With only two weeks before her final exam, Mai decided to change the way she studied. Instead of reading her notes again and again, she tested herself with questions and explained each topic aloud as if she were teaching a friend. She also took short breaks every hour and went to bed early. On the day of the exam, she felt nervous but well prepared.',
    vi: 'Chỉ còn hai tuần nữa là đến kỳ thi cuối kỳ, Mai quyết định thay đổi cách học của mình. Thay vì đọc đi đọc lại ghi chép, cô tự kiểm tra bằng các câu hỏi và giảng to từng chủ đề như thể đang dạy cho một người bạn. Cô cũng nghỉ ngắn sau mỗi giờ và đi ngủ sớm. Vào ngày thi, cô thấy hồi hộp nhưng đã chuẩn bị kỹ.',
  },
  {
    id: 'food-1',
    topicId: 'food',
    title: 'Street Food Culture',
    en: 'In many Asian cities, street food is part of everyday life. Early in the morning, vendors set up small stalls on the sidewalk and sell steaming bowls of soup, fresh bread and sweet drinks. The prices are low, and the dishes are often cooked in front of customers. For visitors, trying local street food is one of the best ways to understand a culture, as long as they choose busy stalls with fresh ingredients.',
    vi: 'Ở nhiều thành phố châu Á, ẩm thực đường phố là một phần của cuộc sống hằng ngày. Từ sáng sớm, những người bán hàng đã dựng các quầy nhỏ trên vỉa hè và bán những bát súp nóng hổi, bánh mì mới ra lò và đồ uống ngọt. Giá cả rẻ, và các món ăn thường được nấu ngay trước mặt khách. Với du khách, thử món ăn đường phố địa phương là một trong những cách tốt nhất để hiểu một nền văn hóa, miễn là họ chọn những quầy đông khách với nguyên liệu tươi.',
  },
  {
    id: 'food-2',
    topicId: 'food',
    title: 'Eating Less Sugar',
    en: 'Sugar is hidden in many products that we do not think of as sweet, such as sauces, bread and breakfast cereals. Eating too much of it can lead to weight gain and problems with our teeth. Nutritionists suggest reading food labels carefully and replacing soft drinks with water or unsweetened tea. After a few weeks, many people notice that their taste changes and very sweet food no longer seems appealing.',
    vi: 'Đường ẩn trong nhiều sản phẩm mà chúng ta không nghĩ là ngọt, như nước sốt, bánh mì và ngũ cốc ăn sáng. Ăn quá nhiều đường có thể dẫn đến tăng cân và các vấn đề về răng. Các chuyên gia dinh dưỡng khuyên nên đọc kỹ nhãn thực phẩm và thay nước ngọt có ga bằng nước lọc hoặc trà không đường. Sau vài tuần, nhiều người nhận thấy khẩu vị của mình thay đổi và đồ ăn quá ngọt không còn hấp dẫn nữa.',
  },
  {
    id: 'shopping-1',
    topicId: 'shopping',
    title: 'Shopping Online',
    en: 'Online shopping has changed the way people buy almost everything. With a few clicks, customers can compare prices, read reviews and have products delivered to their door. However, it is also easier to spend money on things we do not really need. Before placing an order, it is wise to check the return policy and ask yourself whether you would still want the item next month.',
    vi: 'Mua sắm trực tuyến đã thay đổi cách mọi người mua hầu như mọi thứ. Chỉ với vài cú nhấp chuột, khách hàng có thể so sánh giá, đọc đánh giá và được giao hàng tận nhà. Tuy nhiên, việc tiêu tiền vào những thứ không thật sự cần cũng trở nên dễ dàng hơn. Trước khi đặt hàng, bạn nên kiểm tra chính sách đổi trả và tự hỏi liệu tháng sau mình có còn muốn món đồ đó không.',
  },
  {
    id: 'shopping-2',
    topicId: 'shopping',
    title: 'At the Local Market',
    en: 'Every Saturday, Hoa goes to the local market near her apartment. She prefers it to the supermarket because the vegetables are fresher and the sellers know her by name. Bargaining is common there, but she always does it politely and with a smile. She brings her own cloth bags to reduce plastic waste, and she usually leaves with a basket full of fruit, herbs and flowers.',
    vi: 'Thứ Bảy nào Hoa cũng đi chợ gần căn hộ của mình. Cô thích chợ hơn siêu thị vì rau tươi hơn và những người bán hàng biết tên cô. Mặc cả là chuyện thường ở đó, nhưng cô luôn mặc cả một cách lịch sự và với nụ cười. Cô mang theo túi vải của mình để giảm rác thải nhựa, và thường ra về với một giỏ đầy trái cây, rau thơm và hoa.',
  },
  {
    id: 'family-1',
    topicId: 'family',
    title: 'Sunday Dinner',
    en: 'In Nam’s family, Sunday dinner is a tradition that nobody wants to miss. His grandparents, parents and cousins gather at one house, and everyone helps to prepare the meal. The children set the table while the adults cook and chat in the kitchen. During dinner, they share news from the past week and laugh at old stories. For Nam, these evenings are the most precious part of the week.',
    vi: 'Trong gia đình Nam, bữa tối Chủ nhật là một truyền thống mà không ai muốn bỏ lỡ. Ông bà, bố mẹ và anh chị em họ của anh cùng tụ họp ở một ngôi nhà, và ai cũng phụ chuẩn bị bữa ăn. Bọn trẻ dọn bàn trong khi người lớn nấu nướng và trò chuyện trong bếp. Trong bữa tối, mọi người chia sẻ tin tức của tuần qua và cười vì những câu chuyện cũ. Với Nam, những buổi tối này là khoảng thời gian quý giá nhất trong tuần.',
  },
  {
    id: 'family-2',
    topicId: 'family',
    title: 'Staying in Touch',
    en: 'As we grow older, it becomes harder to keep in touch with old friends. Work, family and moving to new cities leave us with less free time. Yet strong friendships are good for both our mental and physical health. A short message, a phone call on a birthday or a coffee once a month can keep a friendship alive. What matters most is not how often we meet but that we make the effort.',
    vi: 'Khi lớn tuổi hơn, việc giữ liên lạc với bạn cũ trở nên khó hơn. Công việc, gia đình và việc chuyển đến thành phố mới khiến chúng ta có ít thời gian rảnh hơn. Thế nhưng những tình bạn bền chặt lại tốt cho cả sức khỏe tinh thần lẫn thể chất. Một tin nhắn ngắn, một cuộc gọi vào ngày sinh nhật hay một buổi cà phê mỗi tháng có thể giữ cho tình bạn luôn sống động. Điều quan trọng nhất không phải là gặp nhau thường xuyên thế nào, mà là chúng ta có chịu cố gắng hay không.',
  },
  {
    id: 'sports-1',
    topicId: 'sports',
    title: 'My First Race',
    en: 'Six months ago, Tuan could not run for more than ten minutes without stopping. He decided to sign up for a five-kilometer race to give himself a clear goal. He trained three times a week and slowly increased his distance. On race day, thousands of runners filled the streets and the crowd cheered loudly. Tuan did not finish first, but crossing the finish line made him extremely proud.',
    vi: 'Sáu tháng trước, Tuấn không thể chạy quá mười phút mà không dừng lại. Anh quyết định đăng ký một cuộc chạy năm cây số để có một mục tiêu rõ ràng. Anh tập ba lần một tuần và tăng dần quãng đường. Vào ngày đua, hàng nghìn người chạy tràn ngập các con phố và khán giả cổ vũ rất nhiệt tình. Tuấn không về nhất, nhưng việc vượt qua vạch đích khiến anh vô cùng tự hào.',
  },
  {
    id: 'sports-2',
    topicId: 'sports',
    title: 'Why Team Sports Matter',
    en: 'Playing a team sport such as football or volleyball offers much more than physical exercise. Players learn to communicate, trust each other and accept both victory and defeat. Children who join a team often develop stronger social skills and more confidence. For adults, a weekly match can be a great way to relieve stress after work and to make new friends outside the office.',
    vi: 'Chơi một môn thể thao đồng đội như bóng đá hay bóng chuyền mang lại nhiều điều hơn là chỉ rèn luyện thể chất. Người chơi học cách giao tiếp, tin tưởng nhau và chấp nhận cả chiến thắng lẫn thất bại. Trẻ em tham gia một đội thường phát triển kỹ năng xã hội tốt hơn và tự tin hơn. Với người lớn, một trận đấu mỗi tuần có thể là cách tuyệt vời để giải tỏa căng thẳng sau giờ làm và kết bạn mới ngoài văn phòng.',
  },
  {
    id: 'entertainment-1',
    topicId: 'entertainment',
    title: 'Learning From Films',
    en: 'Watching films in English is an enjoyable way to improve your listening skills. At first, it helps to turn on subtitles in your own language so that you can follow the story. Later, you can switch to English subtitles and finally try watching without any. Choosing a film you have already seen makes this easier, because you can focus on the words and expressions instead of the plot.',
    vi: 'Xem phim bằng tiếng Anh là một cách thú vị để cải thiện kỹ năng nghe. Lúc đầu, bật phụ đề bằng ngôn ngữ của bạn sẽ giúp bạn theo kịp câu chuyện. Sau đó, bạn có thể chuyển sang phụ đề tiếng Anh và cuối cùng thử xem không cần phụ đề. Chọn một bộ phim bạn đã từng xem sẽ giúp việc này dễ hơn, vì bạn có thể tập trung vào từ ngữ và cách diễn đạt thay vì cốt truyện.',
  },
  {
    id: 'entertainment-2',
    topicId: 'entertainment',
    title: 'The Streaming Era',
    en: 'Streaming services have changed how we watch television and listen to music. Instead of waiting for a weekly episode, viewers can now watch an entire series in one weekend. This convenience is popular, but some people worry that endless choice makes it harder to decide what to watch. Others miss the excitement of discussing a new episode with friends the day after it was shown.',
    vi: 'Các dịch vụ phát trực tuyến đã thay đổi cách chúng ta xem truyền hình và nghe nhạc. Thay vì chờ đợi một tập phim mỗi tuần, giờ đây người xem có thể xem trọn cả một bộ phim trong một cuối tuần. Sự tiện lợi này được nhiều người ưa chuộng, nhưng một số người lo rằng lựa chọn vô tận khiến việc quyết định xem gì trở nên khó hơn. Những người khác lại nhớ cảm giác háo hức được bàn luận về tập phim mới với bạn bè vào ngày hôm sau khi nó được chiếu.',
  },
  {
    id: 'environment-1',
    topicId: 'environment',
    title: 'Reducing Plastic Waste',
    en: 'Every year, millions of tons of plastic end up in rivers and oceans, where they harm fish, birds and other animals. Plastic can take hundreds of years to break down. Fortunately, small changes in our daily habits can help. Carrying a reusable water bottle, refusing plastic straws and recycling properly are simple steps. When many people make these changes together, the impact on the environment becomes significant.',
    vi: 'Mỗi năm, hàng triệu tấn nhựa trôi ra sông và đại dương, gây hại cho cá, chim và các loài động vật khác. Nhựa có thể mất hàng trăm năm mới phân hủy. May mắn thay, những thay đổi nhỏ trong thói quen hằng ngày có thể giúp ích. Mang theo bình nước dùng lại được, từ chối ống hút nhựa và phân loại rác tái chế đúng cách là những bước đơn giản. Khi nhiều người cùng thay đổi, tác động đến môi trường sẽ trở nên đáng kể.',
  },
  {
    id: 'environment-2',
    topicId: 'environment',
    title: 'A Greener City',
    en: 'Some cities are finding creative ways to become greener. They plant trees along busy roads, build parks on old industrial land and create safe lanes for bicycles. These projects reduce air pollution and help to keep streets cooler during hot summers. Residents also benefit in other ways: green spaces encourage people to exercise, meet their neighbors and spend more time outdoors.',
    vi: 'Một số thành phố đang tìm ra những cách sáng tạo để trở nên xanh hơn. Họ trồng cây dọc các con đường đông đúc, xây công viên trên những khu đất công nghiệp cũ và làm làn đường an toàn cho xe đạp. Những dự án này giúp giảm ô nhiễm không khí và giữ cho đường phố mát hơn trong những mùa hè nóng bức. Cư dân cũng được hưởng lợi theo những cách khác: không gian xanh khuyến khích mọi người tập thể dục, gặp gỡ hàng xóm và dành nhiều thời gian ở ngoài trời hơn.',
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
