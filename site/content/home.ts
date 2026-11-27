/**
 * Text of the home page in each language. Vietnamese lives at "/", every other language at
 * "/<code>/" (e.g. /ja/). Topic pages and the blog are Vietnamese only, so the other home pages
 * link straight into the app instead.
 */

export interface SiteChrome {
  /** Nav link to the topic list (/chu-de in Vietnamese, #topics elsewhere). */
  topics: string
  blog: string
  faq: string
  mainNav: string
  footerNav: string
  tagline: string
  signIn: string
  /** Short "try" button in the header. */
  try: string
  share: string
  shareTitle: string
  shareHint: string
  /** Text placed before the link when sharing. */
  shareText: string
  copyLink: string
  copied: string
  more: string
  language: string
  close: string
}

export interface HomeCopy {
  /** Path segment and app language code (?lang=). */
  code: string
  /** BCP 47 tag for <html lang> and hreflang. */
  hreflang: string
  /** Name of the language in itself, shown in the language menu. */
  label: string
  ogLocale: string
  /** Shown to visitors whose browser prefers this language while on another language's page. */
  suggest: string
  title: string
  description: string
  appDescription: string
  pill: string
  h1: string
  lead: string
  tryFree: string
  runs: string
  heroAlt: string
  writeAlt: string
  featuresTitle: string
  features: [string, string][]
  stepsTitle: string
  steps: [string, string][]
  tryReading: string
  topicsTitle: string
  topicsLead: string
  faqTitle: string
  faq: [string, string][]
  ctaTitle: string
  ctaText: string
  chrome: SiteChrome
}

const vi: HomeCopy = {
  code: 'vi',
  hreflang: 'vi',
  label: 'Tiếng Việt',
  ogLocale: 'vi_VN',
  suggest: 'Xem trang này bằng tiếng Việt',
  title: 'English Fun: Luyện đọc, viết tiếng Anh và học từ vựng theo chủ đề',
  description:
    'Học tiếng Anh cho người lớn: luyện đọc hiểu, luyện viết bằng cách dịch Việt sang Anh, tra nghĩa và lưu từ mới vào kho từ để ôn lại. Dùng thử miễn phí, không cần đăng ký.',
  appDescription: 'Ứng dụng luyện đọc, viết tiếng Anh theo chủ đề và xây kho từ vựng cá nhân cho người Việt.',
  pill: 'Dùng thử ngay, không cần đăng ký',
  h1: 'Luyện đọc, viết tiếng Anh và xây kho từ vựng của riêng bạn',
  lead: 'English Fun giúp người lớn học tiếng Anh mỗi ngày 15 phút: đọc đoạn văn theo chủ đề, dịch sang tiếng Anh và lưu từ mới vào kho để ôn lại.',
  tryFree: 'Dùng thử miễn phí',
  runs: 'Chạy trên trình duyệt, máy tính và điện thoại.',
  heroAlt: 'Màn hình luyện đọc của English Fun: đoạn văn tiếng Anh bên trái, bảng tra và lưu từ mới bên phải',
  writeAlt: 'Màn hình luyện viết: đoạn tiếng Việt cần dịch, ô viết bài và danh sách từ cần dùng',
  featuresTitle: 'Mọi thứ bạn cần để tự học mỗi ngày',
  features: [
    [
      'Đọc hiểu theo chủ đề',
      'Đoạn văn ngắn theo chủ đề và trình độ của bạn. Viết bản dịch của mình, rồi so với bản dịch mẫu. Có nút nghe để luyện phát âm.',
    ],
    [
      'Viết và dịch',
      'Dịch một đoạn tiếng Việt sang tiếng Anh, có chèn sẵn từ trong kho của bạn. AI chấm điểm, chỉ lỗi và gợi ý cách viết tự nhiên hơn.',
    ],
    [
      'Kho từ của riêng bạn',
      'Bấm vào một từ để xem nghĩa, phiên âm và lưu kèm câu gốc. Ôn bằng thẻ hoặc gõ lại, từ chưa nhớ được ưu tiên ôn trước.',
    ],
  ],
  stepsTitle: 'Học thế nào?',
  steps: [
    ['Chọn chủ đề và trình độ', 'Công việc, du lịch, công nghệ, sức khỏe hay đời sống, từ A2 đến C1.'],
    ['Đọc hoặc viết', 'Mỗi bài chỉ vài phút. Gặp từ lạ thì bấm vào để tra nghĩa ngay.'],
    ['Lưu và ôn từ mới', 'Từ mới vào kho từ, rồi quay lại trong bài viết và bài ôn của những ngày sau.'],
  ],
  tryReading: 'Thử một bài đọc',
  topicsTitle: 'Từ vựng tiếng Anh theo chủ đề',
  topicsLead: 'Mỗi chủ đề có danh sách từ mẫu kèm phiên âm, câu ví dụ và một đoạn đọc có bản dịch.',
  faqTitle: 'Câu hỏi thường gặp',
  faq: [
    [
      'English Fun có miễn phí không?',
      'Có. Bạn có thể dùng thử ngay không cần tài khoản với các bài đọc và bài viết có sẵn. Tạo tài khoản để đồng bộ kho từ giữa các thiết bị và dùng AI tạo bài mới, chấm bài viết.',
    ],
    [
      'App phù hợp với trình độ nào?',
      'Từ sơ cấp (A2) đến nâng cao (C1). Bạn chọn trình độ trước mỗi bài, và có thể đổi bất cứ lúc nào.',
    ],
    [
      'Kho từ hoạt động thế nào?',
      'Khi đọc, bạn bấm hoặc kéo một từ sang bảng bên cạnh để xem nghĩa, phiên âm và lưu vào kho. Kho từ có chế độ ôn bằng thẻ và gõ lại từ, ưu tiên những từ bạn chưa nhớ.',
    ],
    ['Có cần cài đặt gì không?', 'Không. English Fun chạy ngay trên trình duyệt, cả trên máy tính và điện thoại.'],
    [
      'Luyện viết trong app là gì?',
      'App đưa cho bạn một đoạn tiếng Việt có chứa các từ trong kho từ của bạn. Bạn dịch sang tiếng Anh, so với bản gốc, và khi đăng nhập thì AI chấm điểm và gợi ý cách sửa.',
    ],
  ],
  ctaTitle: 'Bắt đầu bài đọc đầu tiên',
  ctaText: 'Không cần tài khoản. Chọn chủ đề, đọc và lưu từ mới chỉ trong vài phút.',
  chrome: {
    topics: 'Chủ đề từ vựng',
    blog: 'Blog',
    faq: 'Câu hỏi',
    mainNav: 'Điều hướng chính',
    footerNav: 'Liên kết cuối trang',
    tagline: 'Luyện đọc, viết tiếng Anh và xây kho từ vựng của riêng bạn.',
    signIn: 'Đăng nhập',
    try: 'Dùng thử',
    share: 'Chia sẻ',
    shareTitle: 'Chia sẻ trang này',
    shareHint: 'Gửi cho bạn bè cũng đang học tiếng Anh.',
    shareText: 'Luyện đọc, viết tiếng Anh và xây kho từ vựng của riêng bạn với English Fun:',
    copyLink: 'Sao chép link',
    copied: 'Đã sao chép',
    more: 'Khác',
    language: 'Ngôn ngữ',
    close: 'Đóng',
  },
}

const en: HomeCopy = {
  code: 'en',
  hreflang: 'en',
  label: 'English',
  ogLocale: 'en_US',
  suggest: 'View this page in English',
  title: 'English Fun: Practise English reading, writing and vocabulary by topic',
  description:
    'Learn English as an adult: read short passages by topic, translate from your own language into English, look up new words and save them to your word bank to review. Free to try, no sign-up.',
  appDescription:
    'An app for adults to practise English reading and writing by topic and build a personal word bank, in 10 languages.',
  pill: 'Try it now, no sign-up needed',
  h1: 'Practise English reading and writing, and build your own word bank',
  lead: 'English Fun helps adults learn English in 15 minutes a day: read passages on topics you care about, translate into English and save new words to review later. Explanations come in your own language.',
  tryFree: 'Try it free',
  runs: 'Works in your browser, on computers and phones.',
  heroAlt: 'English Fun reading screen: an English passage on the left, a panel to look up and save new words on the right',
  writeAlt: 'Writing screen: a passage to translate, a box for your answer and the words to use',
  featuresTitle: 'Everything you need to study on your own, every day',
  features: [
    [
      'Reading by topic',
      'Short passages that match your topic and level. Write your own translation, then compare it with a sample. Listen to the passage to practise pronunciation.',
    ],
    [
      'Writing and translation',
      'Translate a short passage from your language into English, with words from your bank already worked in. AI scores your answer, points out mistakes and suggests more natural phrasing.',
    ],
    [
      'Your own word bank',
      'Tap a word to see its meaning and pronunciation, and save it with the sentence you found it in. Review with flashcards or by typing, with the words you forget coming up first.',
    ],
  ],
  stepsTitle: 'How it works',
  steps: [
    ['Pick a topic and level', 'Work, travel, food, sports, technology and more, from A2 to C1.'],
    ['Read or write', 'Each exercise takes a few minutes. Tap any unknown word to see what it means.'],
    ['Save and review new words', 'New words go into your word bank and come back in your writing and review sessions.'],
  ],
  tryReading: 'Try a reading exercise',
  topicsTitle: 'Practise English by topic',
  topicsLead: 'Choose a topic to open a reading exercise right away. Every passage comes with a translation in your language.',
  faqTitle: 'Frequently asked questions',
  faq: [
    [
      'Is English Fun free?',
      'Yes. You can try it right away without an account, with the built-in reading and writing exercises. Create an account to sync your word bank across devices and use AI for new passages and feedback on your writing.',
    ],
    ['What level is it for?', 'From elementary (A2) to advanced (C1). You choose the level before each exercise and can change it any time.'],
    [
      'How does the word bank work?',
      'While reading, tap or drag a word to the side panel to see its meaning and pronunciation, then save it. The word bank has flashcard and typing reviews, and the words you have not learned yet come up first.',
    ],
    ['Do I need to install anything?', 'No. English Fun runs in your browser, on both computers and phones.'],
    [
      'Which languages does it support?',
      'Word meanings, translations and feedback are available in Vietnamese, Spanish, Portuguese, French, German, Indonesian, Japanese, Korean, Chinese and Hindi. You choose your language when you open the app and can change it any time.',
    ],
  ],
  ctaTitle: 'Start your first reading exercise',
  ctaText: 'No account needed. Pick a topic, read, and save new words in just a few minutes.',
  chrome: {
    topics: 'Topics',
    blog: 'Blog',
    faq: 'FAQ',
    mainNav: 'Main navigation',
    footerNav: 'Footer links',
    tagline: 'Practise English reading and writing, and build your own word bank.',
    signIn: 'Sign in',
    try: 'Try it',
    share: 'Share',
    shareTitle: 'Share this page',
    shareHint: 'Send it to friends who are learning English too.',
    shareText: 'Practise English reading and writing and build your own word bank with English Fun:',
    copyLink: 'Copy link',
    copied: 'Copied',
    more: 'More',
    language: 'Language',
    close: 'Close',
  },
}

const es: HomeCopy = {
  code: 'es',
  hreflang: 'es',
  label: 'Español',
  ogLocale: 'es_ES',
  suggest: 'Ver esta página en español',
  title: 'English Fun: practica lectura, escritura y vocabulario en inglés por temas',
  description:
    'Aprende inglés siendo adulto: lee textos cortos por temas, traduce del español al inglés, busca palabras nuevas y guárdalas en tu banco de palabras para repasarlas. Pruébalo gratis, sin registro.',
  appDescription: 'Una app para practicar lectura y escritura en inglés por temas y crear tu propio banco de palabras, en español.',
  pill: 'Pruébalo ya, sin registrarte',
  h1: 'Practica lectura y escritura en inglés y crea tu propio banco de palabras',
  lead: 'English Fun ayuda a los adultos a aprender inglés en 15 minutos al día: lee textos sobre temas que te interesan, tradúcelos al inglés y guarda las palabras nuevas para repasarlas. Todo explicado en español.',
  tryFree: 'Pruébalo gratis',
  runs: 'Funciona en el navegador, en el ordenador y en el móvil.',
  heroAlt: 'Pantalla de lectura de English Fun: un texto en inglés a la izquierda y un panel para buscar y guardar palabras a la derecha',
  writeAlt: 'Pantalla de escritura: un texto para traducir, un cuadro para tu respuesta y las palabras que debes usar',
  featuresTitle: 'Todo lo que necesitas para estudiar por tu cuenta cada día',
  features: [
    [
      'Lectura por temas',
      'Textos cortos según tu tema y tu nivel. Escribe tu propia traducción y compárala con la de ejemplo. Escucha el texto para practicar la pronunciación.',
    ],
    [
      'Escritura y traducción',
      'Traduce un texto corto del español al inglés, con palabras de tu banco ya incluidas. La IA puntúa tu respuesta, señala los errores y sugiere frases más naturales.',
    ],
    [
      'Tu propio banco de palabras',
      'Toca una palabra para ver su significado y pronunciación, y guárdala con la frase donde la encontraste. Repasa con tarjetas o escribiendo, empezando por las que más olvidas.',
    ],
  ],
  stepsTitle: '¿Cómo funciona?',
  steps: [
    ['Elige un tema y un nivel', 'Trabajo, viajes, comida, deporte, tecnología y más, del A2 al C1.'],
    ['Lee o escribe', 'Cada ejercicio dura unos minutos. Toca cualquier palabra desconocida para ver qué significa.'],
    ['Guarda y repasa', 'Las palabras nuevas van a tu banco y vuelven a aparecer en tus ejercicios de escritura y repaso.'],
  ],
  tryReading: 'Probar una lectura',
  topicsTitle: 'Practica inglés por temas',
  topicsLead: 'Elige un tema para abrir un ejercicio de lectura al instante. Cada texto tiene su traducción al español.',
  faqTitle: 'Preguntas frecuentes',
  faq: [
    [
      '¿English Fun es gratis?',
      'Sí. Puedes probarlo ahora mismo sin cuenta, con los ejercicios de lectura y escritura incluidos. Crea una cuenta para sincronizar tu banco de palabras entre dispositivos y usar la IA para textos nuevos y correcciones.',
    ],
    ['¿Para qué nivel es?', 'Desde elemental (A2) hasta avanzado (C1). Eliges el nivel antes de cada ejercicio y puedes cambiarlo cuando quieras.'],
    [
      '¿Cómo funciona el banco de palabras?',
      'Mientras lees, toca o arrastra una palabra al panel lateral para ver su significado y pronunciación, y guárdala. El banco tiene repaso con tarjetas y escribiendo, y primero aparecen las palabras que aún no dominas.',
    ],
    ['¿Tengo que instalar algo?', 'No. English Fun funciona en el navegador, tanto en el ordenador como en el móvil.'],
    [
      '¿En qué idiomas está?',
      'Los significados, las traducciones y las correcciones están en español, vietnamita, portugués, francés, alemán, indonesio, japonés, coreano, chino e hindi. Eliges tu idioma al abrir la app y puedes cambiarlo cuando quieras.',
    ],
  ],
  ctaTitle: 'Empieza tu primera lectura',
  ctaText: 'Sin cuenta. Elige un tema, lee y guarda palabras nuevas en pocos minutos.',
  chrome: {
    topics: 'Temas',
    blog: 'Blog',
    faq: 'Preguntas',
    mainNav: 'Navegación principal',
    footerNav: 'Enlaces del pie de página',
    tagline: 'Practica lectura y escritura en inglés y crea tu propio banco de palabras.',
    signIn: 'Iniciar sesión',
    try: 'Probar',
    share: 'Compartir',
    shareTitle: 'Compartir esta página',
    shareHint: 'Envíala a amigos que también estén aprendiendo inglés.',
    shareText: 'Practica lectura y escritura en inglés y crea tu propio banco de palabras con English Fun:',
    copyLink: 'Copiar enlace',
    copied: 'Copiado',
    more: 'Más',
    language: 'Idioma',
    close: 'Cerrar',
  },
}

const pt: HomeCopy = {
  code: 'pt',
  hreflang: 'pt',
  label: 'Português',
  ogLocale: 'pt_BR',
  suggest: 'Ver esta página em português',
  title: 'English Fun: pratique leitura, escrita e vocabulário em inglês por temas',
  description:
    'Aprenda inglês na vida adulta: leia textos curtos por tema, traduza do português para o inglês, consulte palavras novas e salve no seu banco de palavras para revisar. Experimente grátis, sem cadastro.',
  appDescription: 'Um app para praticar leitura e escrita em inglês por temas e montar seu próprio banco de palavras, em português.',
  pill: 'Experimente agora, sem cadastro',
  h1: 'Pratique leitura e escrita em inglês e monte seu próprio banco de palavras',
  lead: 'O English Fun ajuda adultos a aprender inglês em 15 minutos por dia: leia textos sobre temas do seu interesse, traduza para o inglês e salve as palavras novas para revisar depois. Tudo explicado em português.',
  tryFree: 'Experimente grátis',
  runs: 'Funciona no navegador, no computador e no celular.',
  heroAlt: 'Tela de leitura do English Fun: um texto em inglês à esquerda e um painel para consultar e salvar palavras à direita',
  writeAlt: 'Tela de escrita: um texto para traduzir, um campo para sua resposta e as palavras que você deve usar',
  featuresTitle: 'Tudo o que você precisa para estudar sozinho todos os dias',
  features: [
    [
      'Leitura por temas',
      'Textos curtos de acordo com o seu tema e nível. Escreva sua própria tradução e compare com a de exemplo. Ouça o texto para treinar a pronúncia.',
    ],
    [
      'Escrita e tradução',
      'Traduza um texto curto do português para o inglês, com palavras do seu banco já incluídas. A IA dá uma nota, aponta os erros e sugere frases mais naturais.',
    ],
    [
      'Seu próprio banco de palavras',
      'Toque em uma palavra para ver o significado e a pronúncia, e salve junto com a frase onde ela apareceu. Revise com cartões ou digitando, começando pelas que você mais esquece.',
    ],
  ],
  stepsTitle: 'Como funciona?',
  steps: [
    ['Escolha um tema e um nível', 'Trabalho, viagens, comida, esportes, tecnologia e mais, do A2 ao C1.'],
    ['Leia ou escreva', 'Cada exercício leva poucos minutos. Toque em qualquer palavra desconhecida para ver o que significa.'],
    ['Salve e revise', 'As palavras novas vão para o seu banco e voltam nos exercícios de escrita e revisão dos próximos dias.'],
  ],
  tryReading: 'Testar uma leitura',
  topicsTitle: 'Pratique inglês por temas',
  topicsLead: 'Escolha um tema para abrir um exercício de leitura na hora. Cada texto vem com tradução para o português.',
  faqTitle: 'Perguntas frequentes',
  faq: [
    [
      'O English Fun é grátis?',
      'Sim. Você pode experimentar agora mesmo sem conta, com os exercícios de leitura e escrita incluídos. Crie uma conta para sincronizar seu banco de palavras entre aparelhos e usar a IA para novos textos e correções.',
    ],
    ['Para qual nível ele serve?', 'Do básico (A2) ao avançado (C1). Você escolhe o nível antes de cada exercício e pode mudar quando quiser.'],
    [
      'Como funciona o banco de palavras?',
      'Durante a leitura, toque ou arraste uma palavra para o painel lateral para ver o significado e a pronúncia, e salve. O banco tem revisão com cartões e digitação, e as palavras que você ainda não domina aparecem primeiro.',
    ],
    ['Preciso instalar alguma coisa?', 'Não. O English Fun funciona no navegador, no computador e no celular.'],
    [
      'Em quais idiomas ele está disponível?',
      'Significados, traduções e correções estão em português, vietnamita, espanhol, francês, alemão, indonésio, japonês, coreano, chinês e hindi. Você escolhe seu idioma ao abrir o app e pode trocar quando quiser.',
    ],
  ],
  ctaTitle: 'Comece sua primeira leitura',
  ctaText: 'Sem conta. Escolha um tema, leia e salve palavras novas em poucos minutos.',
  chrome: {
    topics: 'Temas',
    blog: 'Blog',
    faq: 'Perguntas',
    mainNav: 'Navegação principal',
    footerNav: 'Links do rodapé',
    tagline: 'Pratique leitura e escrita em inglês e monte seu próprio banco de palavras.',
    signIn: 'Entrar',
    try: 'Experimentar',
    share: 'Compartilhar',
    shareTitle: 'Compartilhar esta página',
    shareHint: 'Envie para amigos que também estão aprendendo inglês.',
    shareText: 'Pratique leitura e escrita em inglês e monte seu próprio banco de palavras com o English Fun:',
    copyLink: 'Copiar link',
    copied: 'Copiado',
    more: 'Mais',
    language: 'Idioma',
    close: 'Fechar',
  },
}

const fr: HomeCopy = {
  code: 'fr',
  hreflang: 'fr',
  label: 'Français',
  ogLocale: 'fr_FR',
  suggest: 'Voir cette page en français',
  title: 'English Fun : lecture, écriture et vocabulaire anglais par thème',
  description:
    "Apprenez l'anglais à l'âge adulte : lisez de courts textes par thème, traduisez du français vers l'anglais, cherchez les mots nouveaux et enregistrez-les dans votre banque de mots pour les réviser. Essai gratuit, sans inscription.",
  appDescription:
    "Une application pour pratiquer la lecture et l'écriture en anglais par thème et se constituer une banque de mots personnelle, en français.",
  pill: 'Essayez tout de suite, sans inscription',
  h1: "Pratiquez la lecture et l'écriture en anglais, et créez votre propre banque de mots",
  lead: "English Fun aide les adultes à apprendre l'anglais en 15 minutes par jour : lisez des textes sur des thèmes qui vous intéressent, traduisez-les en anglais et enregistrez les mots nouveaux pour les revoir. Tout est expliqué en français.",
  tryFree: 'Essayer gratuitement',
  runs: 'Fonctionne dans le navigateur, sur ordinateur et sur téléphone.',
  heroAlt: "Écran de lecture d'English Fun : un texte en anglais à gauche, un panneau pour chercher et enregistrer les mots à droite",
  writeAlt: "Écran d'écriture : un texte à traduire, une zone pour votre réponse et les mots à utiliser",
  featuresTitle: 'Tout ce dont vous avez besoin pour apprendre seul, chaque jour',
  features: [
    [
      'Lecture par thème',
      'De courts textes adaptés à votre thème et à votre niveau. Écrivez votre propre traduction, puis comparez-la à un modèle. Écoutez le texte pour travailler la prononciation.',
    ],
    [
      'Écriture et traduction',
      "Traduisez un court texte du français vers l'anglais, avec des mots de votre banque déjà intégrés. L'IA note votre réponse, relève les erreurs et propose des tournures plus naturelles.",
    ],
    [
      'Votre propre banque de mots',
      "Touchez un mot pour voir son sens et sa prononciation, et enregistrez-le avec la phrase d'origine. Révisez avec des cartes ou en le tapant, en commençant par les mots que vous oubliez.",
    ],
  ],
  stepsTitle: 'Comment ça marche ?',
  steps: [
    ['Choisissez un thème et un niveau', 'Travail, voyages, cuisine, sport, technologie et plus, du A2 au C1.'],
    ['Lisez ou écrivez', 'Chaque exercice prend quelques minutes. Touchez un mot inconnu pour voir ce qu’il veut dire.'],
    ['Enregistrez et révisez', 'Les mots nouveaux rejoignent votre banque et reviennent dans vos exercices d’écriture et de révision.'],
  ],
  tryReading: 'Essayer une lecture',
  topicsTitle: "Pratiquez l'anglais par thème",
  topicsLead: 'Choisissez un thème pour ouvrir un exercice de lecture tout de suite. Chaque texte est accompagné de sa traduction en français.',
  faqTitle: 'Questions fréquentes',
  faq: [
    [
      'English Fun est-il gratuit ?',
      "Oui. Vous pouvez l'essayer tout de suite sans compte, avec les exercices de lecture et d'écriture intégrés. Créez un compte pour synchroniser votre banque de mots entre vos appareils et utiliser l'IA pour de nouveaux textes et des corrections.",
    ],
    ['Pour quel niveau ?', "Du niveau élémentaire (A2) au niveau avancé (C1). Vous choisissez le niveau avant chaque exercice et pouvez le changer à tout moment."],
    [
      'Comment fonctionne la banque de mots ?',
      "Pendant la lecture, touchez ou faites glisser un mot vers le panneau latéral pour voir son sens et sa prononciation, puis enregistrez-le. La banque propose des révisions par cartes et par saisie, en commençant par les mots que vous ne maîtrisez pas encore.",
    ],
    ['Faut-il installer quelque chose ?', 'Non. English Fun fonctionne dans le navigateur, sur ordinateur comme sur téléphone.'],
    [
      'Quelles langues sont disponibles ?',
      "Les définitions, traductions et corrections existent en français, vietnamien, espagnol, portugais, allemand, indonésien, japonais, coréen, chinois et hindi. Vous choisissez votre langue en ouvrant l'application et pouvez la changer à tout moment.",
    ],
  ],
  ctaTitle: 'Commencez votre première lecture',
  ctaText: 'Sans compte. Choisissez un thème, lisez et enregistrez de nouveaux mots en quelques minutes.',
  chrome: {
    topics: 'Thèmes',
    blog: 'Blog',
    faq: 'Questions',
    mainNav: 'Navigation principale',
    footerNav: 'Liens de bas de page',
    tagline: "Pratiquez la lecture et l'écriture en anglais, et créez votre propre banque de mots.",
    signIn: 'Se connecter',
    try: 'Essayer',
    share: 'Partager',
    shareTitle: 'Partager cette page',
    shareHint: "Envoyez-la à des amis qui apprennent aussi l'anglais.",
    shareText: "Pratiquez la lecture et l'écriture en anglais et créez votre banque de mots avec English Fun :",
    copyLink: 'Copier le lien',
    copied: 'Copié',
    more: 'Plus',
    language: 'Langue',
    close: 'Fermer',
  },
}

const de: HomeCopy = {
  code: 'de',
  hreflang: 'de',
  label: 'Deutsch',
  ogLocale: 'de_DE',
  suggest: 'Diese Seite auf Deutsch ansehen',
  title: 'English Fun: Englisch lesen, schreiben und Vokabeln lernen nach Themen',
  description:
    'Englisch lernen als Erwachsener: kurze Texte nach Themen lesen, aus dem Deutschen ins Englische übersetzen, neue Wörter nachschlagen und in deinem Wortschatz zum Wiederholen speichern. Kostenlos testen, ohne Anmeldung.',
  appDescription: 'Eine App, mit der Erwachsene Englisch lesen und schreiben nach Themen üben und einen eigenen Wortschatz aufbauen, auf Deutsch erklärt.',
  pill: 'Jetzt testen, ohne Anmeldung',
  h1: 'Englisch lesen und schreiben üben und deinen eigenen Wortschatz aufbauen',
  lead: 'English Fun hilft Erwachsenen, mit 15 Minuten am Tag Englisch zu lernen: Texte zu Themen lesen, die dich interessieren, ins Englische übersetzen und neue Wörter zum Wiederholen speichern. Alles auf Deutsch erklärt.',
  tryFree: 'Kostenlos testen',
  runs: 'Läuft im Browser, auf Computer und Smartphone.',
  heroAlt: 'Lesebildschirm von English Fun: links ein englischer Text, rechts ein Bereich zum Nachschlagen und Speichern neuer Wörter',
  writeAlt: 'Schreibbildschirm: ein Text zum Übersetzen, ein Feld für deine Antwort und die Wörter, die du verwenden sollst',
  featuresTitle: 'Alles, was du zum täglichen Selbstlernen brauchst',
  features: [
    [
      'Lesen nach Themen',
      'Kurze Texte passend zu Thema und Niveau. Schreib deine eigene Übersetzung und vergleiche sie mit einer Musterlösung. Lass dir den Text vorlesen, um die Aussprache zu üben.',
    ],
    [
      'Schreiben und Übersetzen',
      'Übersetze einen kurzen Text aus dem Deutschen ins Englische, in den schon Wörter aus deinem Wortschatz eingebaut sind. Die KI bewertet deine Antwort, zeigt Fehler und schlägt natürlichere Formulierungen vor.',
    ],
    [
      'Dein eigener Wortschatz',
      'Tippe auf ein Wort, um Bedeutung und Aussprache zu sehen, und speichere es mit dem Satz, in dem es stand. Wiederhole mit Karteikarten oder durch Eintippen, die vergessenen Wörter kommen zuerst.',
    ],
  ],
  stepsTitle: "So funktioniert's",
  steps: [
    ['Thema und Niveau wählen', 'Arbeit, Reisen, Essen, Sport, Technik und mehr, von A2 bis C1.'],
    ['Lesen oder schreiben', 'Jede Übung dauert nur ein paar Minuten. Tippe auf ein unbekanntes Wort, um seine Bedeutung zu sehen.'],
    ['Speichern und wiederholen', 'Neue Wörter landen in deinem Wortschatz und tauchen in späteren Schreib- und Wiederholungsübungen wieder auf.'],
  ],
  tryReading: 'Leseübung ausprobieren',
  topicsTitle: 'Englisch üben nach Themen',
  topicsLead: 'Wähle ein Thema, um sofort eine Leseübung zu öffnen. Zu jedem Text gibt es eine deutsche Übersetzung.',
  faqTitle: 'Häufige Fragen',
  faq: [
    [
      'Ist English Fun kostenlos?',
      'Ja. Du kannst es sofort ohne Konto mit den eingebauten Lese- und Schreibübungen ausprobieren. Mit einem Konto wird dein Wortschatz zwischen Geräten synchronisiert und du kannst die KI für neue Texte und Korrekturen nutzen.',
    ],
    ['Für welches Niveau ist es?', 'Von Grundstufe (A2) bis fortgeschritten (C1). Du wählst das Niveau vor jeder Übung und kannst es jederzeit ändern.'],
    [
      'Wie funktioniert der Wortschatz?',
      'Beim Lesen tippst oder ziehst du ein Wort in die Seitenleiste, siehst Bedeutung und Aussprache und speicherst es. Der Wortschatz hat Wiederholungen mit Karteikarten und Eintippen, und Wörter, die du noch nicht kannst, kommen zuerst.',
    ],
    ['Muss ich etwas installieren?', 'Nein. English Fun läuft im Browser, auf dem Computer wie auf dem Smartphone.'],
    [
      'Welche Sprachen gibt es?',
      'Bedeutungen, Übersetzungen und Feedback gibt es auf Deutsch, Vietnamesisch, Spanisch, Portugiesisch, Französisch, Indonesisch, Japanisch, Koreanisch, Chinesisch und Hindi. Du wählst deine Sprache beim Öffnen der App und kannst sie jederzeit ändern.',
    ],
  ],
  ctaTitle: 'Starte deine erste Leseübung',
  ctaText: 'Ohne Konto. Thema wählen, lesen und in wenigen Minuten neue Wörter speichern.',
  chrome: {
    topics: 'Themen',
    blog: 'Blog',
    faq: 'Fragen',
    mainNav: 'Hauptnavigation',
    footerNav: 'Links in der Fußzeile',
    tagline: 'Englisch lesen und schreiben üben und deinen eigenen Wortschatz aufbauen.',
    signIn: 'Anmelden',
    try: 'Testen',
    share: 'Teilen',
    shareTitle: 'Diese Seite teilen',
    shareHint: 'Schick sie Freunden, die auch Englisch lernen.',
    shareText: 'Englisch lesen und schreiben üben und den eigenen Wortschatz aufbauen mit English Fun:',
    copyLink: 'Link kopieren',
    copied: 'Kopiert',
    more: 'Mehr',
    language: 'Sprache',
    close: 'Schließen',
  },
}

const id: HomeCopy = {
  code: 'id',
  hreflang: 'id',
  label: 'Bahasa Indonesia',
  ogLocale: 'id_ID',
  suggest: 'Lihat halaman ini dalam Bahasa Indonesia',
  title: 'English Fun: Latihan membaca, menulis, dan kosakata bahasa Inggris per topik',
  description:
    'Belajar bahasa Inggris untuk orang dewasa: baca teks pendek per topik, terjemahkan dari bahasa Indonesia ke bahasa Inggris, cari arti kata baru dan simpan ke bank kata untuk diulang. Coba gratis, tanpa daftar.',
  appDescription: 'Aplikasi untuk berlatih membaca dan menulis bahasa Inggris per topik serta membangun bank kata pribadi, dalam bahasa Indonesia.',
  pill: 'Coba sekarang, tanpa daftar',
  h1: 'Latihan membaca dan menulis bahasa Inggris, dan bangun bank kata milikmu sendiri',
  lead: 'English Fun membantu orang dewasa belajar bahasa Inggris 15 menit sehari: baca teks tentang topik yang kamu suka, terjemahkan ke bahasa Inggris, lalu simpan kata baru untuk diulang. Semua penjelasan dalam bahasa Indonesia.',
  tryFree: 'Coba gratis',
  runs: 'Berjalan di browser, di komputer maupun ponsel.',
  heroAlt: 'Layar membaca English Fun: teks bahasa Inggris di kiri, panel untuk mencari dan menyimpan kata baru di kanan',
  writeAlt: 'Layar menulis: teks untuk diterjemahkan, kotak jawaban, dan daftar kata yang harus dipakai',
  featuresTitle: 'Semua yang kamu perlukan untuk belajar mandiri setiap hari',
  features: [
    [
      'Membaca per topik',
      'Teks pendek sesuai topik dan levelmu. Tulis terjemahanmu sendiri, lalu bandingkan dengan contoh. Dengarkan teksnya untuk melatih pelafalan.',
    ],
    [
      'Menulis dan menerjemahkan',
      'Terjemahkan teks pendek dari bahasa Indonesia ke bahasa Inggris, yang sudah berisi kata-kata dari bank katamu. AI memberi nilai, menunjukkan kesalahan, dan menyarankan kalimat yang lebih alami.',
    ],
    [
      'Bank kata milikmu',
      'Ketuk sebuah kata untuk melihat arti dan pelafalannya, lalu simpan bersama kalimat asalnya. Ulangi dengan kartu atau dengan mengetik, kata yang paling sering lupa muncul lebih dulu.',
    ],
  ],
  stepsTitle: 'Cara kerjanya',
  steps: [
    ['Pilih topik dan level', 'Pekerjaan, perjalanan, makanan, olahraga, teknologi, dan lainnya, dari A2 sampai C1.'],
    ['Membaca atau menulis', 'Setiap latihan hanya beberapa menit. Ketuk kata yang belum kamu tahu untuk langsung melihat artinya.'],
    ['Simpan dan ulangi', 'Kata baru masuk ke bank kata dan muncul lagi di latihan menulis dan pengulangan berikutnya.'],
  ],
  tryReading: 'Coba latihan membaca',
  topicsTitle: 'Latihan bahasa Inggris per topik',
  topicsLead: 'Pilih topik untuk langsung membuka latihan membaca. Setiap teks dilengkapi terjemahan bahasa Indonesia.',
  faqTitle: 'Pertanyaan umum',
  faq: [
    [
      'Apakah English Fun gratis?',
      'Ya. Kamu bisa langsung mencobanya tanpa akun dengan latihan membaca dan menulis bawaan. Buat akun untuk menyinkronkan bank kata antarperangkat dan memakai AI untuk teks baru serta koreksi tulisan.',
    ],
    ['Cocok untuk level apa?', 'Dari dasar (A2) sampai mahir (C1). Kamu memilih level sebelum setiap latihan dan bisa menggantinya kapan saja.'],
    [
      'Bagaimana cara kerja bank kata?',
      'Saat membaca, ketuk atau seret kata ke panel samping untuk melihat arti dan pelafalannya, lalu simpan. Bank kata punya mode ulangan dengan kartu dan mengetik, dan kata yang belum kamu kuasai muncul lebih dulu.',
    ],
    ['Apakah perlu memasang aplikasi?', 'Tidak. English Fun berjalan di browser, di komputer maupun ponsel.'],
    [
      'Bahasa apa saja yang tersedia?',
      'Arti kata, terjemahan, dan koreksi tersedia dalam bahasa Indonesia, Vietnam, Spanyol, Portugis, Prancis, Jerman, Jepang, Korea, Mandarin, dan Hindi. Kamu memilih bahasa saat membuka aplikasi dan bisa menggantinya kapan saja.',
    ],
  ],
  ctaTitle: 'Mulai latihan membaca pertamamu',
  ctaText: 'Tanpa akun. Pilih topik, baca, dan simpan kata baru hanya dalam beberapa menit.',
  chrome: {
    topics: 'Topik',
    blog: 'Blog',
    faq: 'Tanya jawab',
    mainNav: 'Navigasi utama',
    footerNav: 'Tautan bagian bawah',
    tagline: 'Latihan membaca dan menulis bahasa Inggris, dan bangun bank kata milikmu sendiri.',
    signIn: 'Masuk',
    try: 'Coba',
    share: 'Bagikan',
    shareTitle: 'Bagikan halaman ini',
    shareHint: 'Kirim ke teman yang juga sedang belajar bahasa Inggris.',
    shareText: 'Latihan membaca dan menulis bahasa Inggris dan bangun bank kata sendiri dengan English Fun:',
    copyLink: 'Salin tautan',
    copied: 'Tersalin',
    more: 'Lainnya',
    language: 'Bahasa',
    close: 'Tutup',
  },
}

const ja: HomeCopy = {
  code: 'ja',
  hreflang: 'ja',
  label: '日本語',
  ogLocale: 'ja_JP',
  suggest: 'このページを日本語で見る',
  title: 'English Fun：テーマ別に英語のリーディング・ライティング・単語を練習',
  description:
    '大人のための英語学習アプリ。テーマ別の短い英文を読み、日本語から英語に訳し、新しい単語を調べて単語帳に保存して復習できます。登録不要、無料でお試しいただけます。',
  appDescription: 'テーマ別に英語のリーディングとライティングを練習し、自分だけの単語帳を作れる大人向けアプリ。説明は日本語。',
  pill: '登録不要ですぐに試せます',
  h1: '英語のリーディングとライティングを練習して、自分だけの単語帳を作ろう',
  lead: 'English Fun は、1日15分で英語を学びたい大人のためのアプリです。興味のあるテーマの英文を読み、英語に訳し、新しい単語を保存してあとで復習できます。説明はすべて日本語です。',
  tryFree: '無料で試す',
  runs: 'ブラウザで動くので、パソコンでもスマホでも使えます。',
  heroAlt: 'English Fun のリーディング画面。左に英文、右に単語を調べて保存するパネル',
  writeAlt: 'ライティング画面。訳す文章、回答欄、使うべき単語の一覧',
  featuresTitle: '毎日ひとりで学ぶために必要なものがそろっています',
  features: [
    [
      'テーマ別リーディング',
      'テーマとレベルに合った短い英文。自分で訳を書いてから、お手本の訳と比べられます。音声を聞いて発音の練習もできます。',
    ],
    [
      'ライティングと翻訳',
      '単語帳の単語が入った短い日本語の文章を英語に訳します。AI が採点し、間違いを指摘して、より自然な表現を提案します。',
    ],
    [
      '自分だけの単語帳',
      '単語をタップすると意味と発音が表示され、出てきた文と一緒に保存できます。カードやタイピングで復習でき、忘れやすい単語から先に出てきます。',
    ],
  ],
  stepsTitle: '使い方',
  steps: [
    ['テーマとレベルを選ぶ', '仕事、旅行、食べ物、スポーツ、テクノロジーなど。レベルは A2 から C1 まで。'],
    ['読む、または書く', '1回の練習は数分です。わからない単語はタップするだけで意味がわかります。'],
    ['保存して復習する', '新しい単語は単語帳に入り、その後のライティングや復習で繰り返し出てきます。'],
  ],
  tryReading: 'リーディングを試す',
  topicsTitle: 'テーマ別に英語を練習',
  topicsLead: 'テーマを選ぶとすぐにリーディング練習が始まります。どの英文にも日本語訳がついています。',
  faqTitle: 'よくある質問',
  faq: [
    [
      'English Fun は無料ですか？',
      'はい。アカウントなしで、用意されたリーディングとライティングの練習をすぐに試せます。アカウントを作ると、単語帳を端末間で同期でき、AI による新しい英文の作成や添削も使えます。',
    ],
    ['どのレベル向けですか？', '初級（A2）から上級（C1）までです。練習ごとにレベルを選べて、いつでも変更できます。'],
    [
      '単語帳はどう使いますか？',
      '英文を読みながら単語をタップするか横のパネルにドラッグすると、意味と発音が表示され、保存できます。カードとタイピングで復習でき、まだ覚えていない単語が優先して出てきます。',
    ],
    ['インストールは必要ですか？', 'いいえ。English Fun はブラウザで動き、パソコンでもスマホでも使えます。'],
    [
      '対応している言語は？',
      '単語の意味、翻訳、添削は日本語、ベトナム語、スペイン語、ポルトガル語、フランス語、ドイツ語、インドネシア語、韓国語、中国語、ヒンディー語に対応しています。言語はアプリを開くときに選べて、いつでも変更できます。',
    ],
  ],
  ctaTitle: '最初のリーディングを始めよう',
  ctaText: 'アカウントは不要です。テーマを選んで読み、数分で新しい単語を保存できます。',
  chrome: {
    topics: 'テーマ',
    blog: 'ブログ',
    faq: 'よくある質問',
    mainNav: 'メインナビゲーション',
    footerNav: 'フッターのリンク',
    tagline: '英語のリーディングとライティングを練習して、自分だけの単語帳を作ろう。',
    signIn: 'ログイン',
    try: '試す',
    share: '共有',
    shareTitle: 'このページを共有',
    shareHint: '英語を勉強している友だちに送りましょう。',
    shareText: 'English Fun で英語のリーディングとライティングを練習して、自分だけの単語帳を作ろう：',
    copyLink: 'リンクをコピー',
    copied: 'コピーしました',
    more: 'その他',
    language: '言語',
    close: '閉じる',
  },
}

const ko: HomeCopy = {
  code: 'ko',
  hreflang: 'ko',
  label: '한국어',
  ogLocale: 'ko_KR',
  suggest: '이 페이지를 한국어로 보기',
  title: 'English Fun: 주제별 영어 읽기, 쓰기, 단어 연습',
  description:
    '성인을 위한 영어 학습: 주제별 짧은 글을 읽고, 한국어를 영어로 번역하고, 새 단어를 찾아 단어장에 저장해 복습하세요. 가입 없이 무료로 써 보세요.',
  appDescription: '주제별로 영어 읽기와 쓰기를 연습하고 나만의 단어장을 만드는 성인용 앱. 설명은 한국어로 제공됩니다.',
  pill: '가입 없이 바로 체험',
  h1: '영어 읽기와 쓰기를 연습하고 나만의 단어장을 만드세요',
  lead: 'English Fun은 하루 15분으로 영어를 공부하고 싶은 성인을 위한 앱입니다. 관심 있는 주제의 글을 읽고, 영어로 번역하고, 새 단어를 저장해 나중에 복습하세요. 모든 설명은 한국어로 나옵니다.',
  tryFree: '무료로 시작하기',
  runs: '브라우저에서 바로 실행되며 컴퓨터와 휴대폰 모두 지원합니다.',
  heroAlt: 'English Fun 읽기 화면: 왼쪽에 영어 지문, 오른쪽에 단어를 찾고 저장하는 패널',
  writeAlt: '쓰기 화면: 번역할 글, 답을 쓰는 칸, 사용해야 할 단어 목록',
  featuresTitle: '매일 혼자 공부하는 데 필요한 모든 것',
  features: [
    [
      '주제별 읽기',
      '주제와 수준에 맞는 짧은 글. 직접 번역을 써 본 뒤 예시 번역과 비교하세요. 글을 들으며 발음도 연습할 수 있습니다.',
    ],
    [
      '쓰기와 번역',
      '단어장의 단어가 들어간 짧은 한국어 글을 영어로 번역합니다. AI가 점수를 매기고, 틀린 곳을 짚어 주고, 더 자연스러운 표현을 제안합니다.',
    ],
    [
      '나만의 단어장',
      '단어를 누르면 뜻과 발음이 나오고, 처음 본 문장과 함께 저장됩니다. 카드나 타이핑으로 복습하며, 자주 잊는 단어가 먼저 나옵니다.',
    ],
  ],
  stepsTitle: '이렇게 공부해요',
  steps: [
    ['주제와 수준 고르기', '일, 여행, 음식, 스포츠, 기술 등 다양한 주제. 수준은 A2부터 C1까지.'],
    ['읽거나 쓰기', '한 번에 몇 분이면 충분합니다. 모르는 단어는 누르기만 하면 뜻을 볼 수 있어요.'],
    ['저장하고 복습하기', '새 단어는 단어장에 들어가고 이후 쓰기와 복습에서 다시 나옵니다.'],
  ],
  tryReading: '읽기 연습 해 보기',
  topicsTitle: '주제별 영어 연습',
  topicsLead: '주제를 고르면 바로 읽기 연습이 열립니다. 모든 글에 한국어 번역이 있습니다.',
  faqTitle: '자주 묻는 질문',
  faq: [
    [
      'English Fun은 무료인가요?',
      '네. 계정 없이도 기본 제공되는 읽기와 쓰기 연습을 바로 해 볼 수 있습니다. 계정을 만들면 여러 기기에서 단어장을 동기화하고, AI로 새 글을 만들고 쓰기 첨삭을 받을 수 있습니다.',
    ],
    ['어떤 수준에 맞나요?', '초급(A2)부터 고급(C1)까지입니다. 연습할 때마다 수준을 고를 수 있고 언제든 바꿀 수 있습니다.'],
    [
      '단어장은 어떻게 쓰나요?',
      '글을 읽다가 단어를 누르거나 옆 패널로 끌어오면 뜻과 발음이 나오고 저장할 수 있습니다. 카드와 타이핑으로 복습하며, 아직 외우지 못한 단어가 먼저 나옵니다.',
    ],
    ['설치해야 하나요?', '아니요. English Fun은 브라우저에서 실행되며 컴퓨터와 휴대폰 모두에서 쓸 수 있습니다.'],
    [
      '어떤 언어를 지원하나요?',
      '단어 뜻, 번역, 첨삭은 한국어, 베트남어, 스페인어, 포르투갈어, 프랑스어, 독일어, 인도네시아어, 일본어, 중국어, 힌디어로 제공됩니다. 앱을 열 때 언어를 고르고 언제든 바꿀 수 있습니다.',
    ],
  ],
  ctaTitle: '첫 읽기 연습을 시작하세요',
  ctaText: '계정은 필요 없습니다. 주제를 고르고, 읽고, 몇 분 만에 새 단어를 저장하세요.',
  chrome: {
    topics: '주제',
    blog: '블로그',
    faq: '자주 묻는 질문',
    mainNav: '주요 메뉴',
    footerNav: '하단 링크',
    tagline: '영어 읽기와 쓰기를 연습하고 나만의 단어장을 만드세요.',
    signIn: '로그인',
    try: '체험하기',
    share: '공유',
    shareTitle: '이 페이지 공유',
    shareHint: '영어를 공부하는 친구에게 보내 보세요.',
    shareText: 'English Fun으로 영어 읽기와 쓰기를 연습하고 나만의 단어장을 만들어 보세요:',
    copyLink: '링크 복사',
    copied: '복사됨',
    more: '더 보기',
    language: '언어',
    close: '닫기',
  },
}

const zh: HomeCopy = {
  code: 'zh',
  hreflang: 'zh-Hans',
  label: '简体中文',
  ogLocale: 'zh_CN',
  suggest: '用简体中文查看此页面',
  title: 'English Fun：按主题练习英语阅读、写作和词汇',
  description:
    '面向成年人的英语学习：按主题阅读英语短文，把中文翻译成英语，查询生词并存入你的单词本以便复习。免费试用，无需注册。',
  appDescription: '一款面向成年人的应用，按主题练习英语阅读和写作，建立自己的单词本，讲解使用中文。',
  pill: '无需注册，立即试用',
  h1: '练习英语阅读和写作，建立属于你自己的单词本',
  lead: 'English Fun 帮助成年人每天花 15 分钟学英语：阅读你感兴趣的主题短文，翻译成英语，把生词保存下来以后复习。所有讲解都用中文。',
  tryFree: '免费试用',
  runs: '在浏览器中运行，电脑和手机都能用。',
  heroAlt: 'English Fun 阅读界面：左边是英语短文，右边是查词和保存生词的面板',
  writeAlt: '写作界面：需要翻译的短文、作答框和需要用到的单词',
  featuresTitle: '每天自学所需的一切',
  features: [
    ['按主题阅读', '根据你的主题和水平提供英语短文。先写下自己的译文，再和参考译文对比。还可以听朗读练习发音。'],
    ['写作与翻译', '把一段中文短文翻译成英语，短文里已经用上了你单词本里的词。AI 会打分、指出错误，并建议更地道的表达。'],
    ['你自己的单词本', '点一下单词就能看到释义和发音，并连同原句一起保存。可以用卡片或拼写复习，容易忘的词会优先出现。'],
  ],
  stepsTitle: '怎么学？',
  steps: [
    ['选择主题和水平', '工作、旅行、饮食、运动、科技等，水平从 A2 到 C1。'],
    ['阅读或写作', '每次练习只需几分钟。遇到生词点一下就能看到意思。'],
    ['保存并复习生词', '生词会进入单词本，并在之后的写作和复习中反复出现。'],
  ],
  tryReading: '试试阅读练习',
  topicsTitle: '按主题练习英语',
  topicsLead: '选择一个主题即可马上开始阅读练习。每篇短文都配有中文译文。',
  faqTitle: '常见问题',
  faq: [
    [
      'English Fun 免费吗？',
      '是的。无需账号就能立即试用内置的阅读和写作练习。创建账号后，可以在多台设备间同步单词本，并使用 AI 生成新短文和批改写作。',
    ],
    ['适合什么水平？', '从初级（A2）到高级（C1）。每次练习前都可以选择水平，随时可以更改。'],
    [
      '单词本怎么用？',
      '阅读时点击单词或把它拖到旁边的面板，就能看到释义和发音并保存。单词本支持卡片和拼写复习，还没记住的词会优先出现。',
    ],
    ['需要安装吗？', '不需要。English Fun 在浏览器中运行，电脑和手机都能用。'],
    [
      '支持哪些语言？',
      '单词释义、译文和批改支持中文、越南语、西班牙语、葡萄牙语、法语、德语、印尼语、日语、韩语和印地语。打开应用时选择你的语言，之后随时可以更改。',
    ],
  ],
  ctaTitle: '开始你的第一次阅读练习',
  ctaText: '无需账号。选一个主题，阅读，几分钟就能保存新单词。',
  chrome: {
    topics: '主题',
    blog: '博客',
    faq: '常见问题',
    mainNav: '主导航',
    footerNav: '页脚链接',
    tagline: '练习英语阅读和写作，建立属于你自己的单词本。',
    signIn: '登录',
    try: '试用',
    share: '分享',
    shareTitle: '分享此页面',
    shareHint: '发给同样在学英语的朋友。',
    shareText: '用 English Fun 练习英语阅读和写作，建立自己的单词本：',
    copyLink: '复制链接',
    copied: '已复制',
    more: '更多',
    language: '语言',
    close: '关闭',
  },
}

const hi: HomeCopy = {
  code: 'hi',
  hreflang: 'hi',
  label: 'हिन्दी',
  ogLocale: 'hi_IN',
  suggest: 'यह पेज हिन्दी में देखें',
  title: 'English Fun: विषय के अनुसार अंग्रेज़ी पढ़ना, लिखना और शब्दावली सीखें',
  description:
    'वयस्कों के लिए अंग्रेज़ी: विषय के अनुसार छोटे पाठ पढ़ें, हिन्दी से अंग्रेज़ी में अनुवाद करें, नए शब्दों का अर्थ देखें और उन्हें दोहराने के लिए अपने शब्द-कोश में सहेजें। मुफ़्त में आज़माएँ, साइन-अप की ज़रूरत नहीं।',
  appDescription: 'वयस्कों के लिए एक ऐप, जिसमें विषय के अनुसार अंग्रेज़ी पढ़ने-लिखने का अभ्यास करें और अपना शब्द-कोश बनाएँ, हिन्दी में समझाया गया।',
  pill: 'अभी आज़माएँ, साइन-अप की ज़रूरत नहीं',
  h1: 'अंग्रेज़ी पढ़ने और लिखने का अभ्यास करें, और अपना शब्द-कोश बनाएँ',
  lead: 'English Fun वयस्कों को रोज़ 15 मिनट में अंग्रेज़ी सीखने में मदद करता है: अपनी पसंद के विषयों पर पाठ पढ़ें, अंग्रेज़ी में अनुवाद करें और नए शब्द बाद में दोहराने के लिए सहेजें। सब कुछ हिन्दी में समझाया जाता है।',
  tryFree: 'मुफ़्त में आज़माएँ',
  runs: 'ब्राउज़र में चलता है, कंप्यूटर और फ़ोन दोनों पर।',
  heroAlt: 'English Fun की पढ़ने वाली स्क्रीन: बाईं ओर अंग्रेज़ी पाठ, दाईं ओर नए शब्द देखने और सहेजने का पैनल',
  writeAlt: 'लिखने वाली स्क्रीन: अनुवाद के लिए पाठ, जवाब लिखने का बॉक्स और इस्तेमाल करने वाले शब्द',
  featuresTitle: 'रोज़ खुद पढ़ाई करने के लिए ज़रूरी सब कुछ',
  features: [
    [
      'विषय के अनुसार पढ़ना',
      'आपके विषय और स्तर के अनुसार छोटे पाठ। अपना अनुवाद लिखें, फिर नमूना अनुवाद से मिलाएँ। उच्चारण के अभ्यास के लिए पाठ सुनें।',
    ],
    [
      'लिखना और अनुवाद',
      'हिन्दी के एक छोटे पाठ का अंग्रेज़ी में अनुवाद करें, जिसमें आपके शब्द-कोश के शब्द पहले से शामिल हैं। AI अंक देता है, गलतियाँ बताता है और ज़्यादा स्वाभाविक वाक्य सुझाता है।',
    ],
    [
      'आपका अपना शब्द-कोश',
      'किसी शब्द पर टैप करें, उसका अर्थ और उच्चारण देखें, और उसे मूल वाक्य के साथ सहेजें। कार्ड या टाइप करके दोहराएँ, जो शब्द भूल जाते हैं वे पहले आते हैं।',
    ],
  ],
  stepsTitle: 'कैसे सीखें?',
  steps: [
    ['विषय और स्तर चुनें', 'काम, यात्रा, खाना, खेल, तकनीक और भी बहुत कुछ, A2 से C1 तक।'],
    ['पढ़ें या लिखें', 'हर अभ्यास बस कुछ मिनट का है। किसी अनजान शब्द पर टैप करें और तुरंत अर्थ देखें।'],
    ['सहेजें और दोहराएँ', 'नए शब्द आपके शब्द-कोश में जाते हैं और आगे के लिखने और दोहराने के अभ्यास में फिर आते हैं।'],
  ],
  tryReading: 'पढ़ने का अभ्यास आज़माएँ',
  topicsTitle: 'विषय के अनुसार अंग्रेज़ी का अभ्यास',
  topicsLead: 'कोई विषय चुनें और तुरंत पढ़ने का अभ्यास शुरू करें। हर पाठ के साथ हिन्दी अनुवाद है।',
  faqTitle: 'अक्सर पूछे जाने वाले सवाल',
  faq: [
    [
      'क्या English Fun मुफ़्त है?',
      'हाँ। आप बिना अकाउंट के तुरंत पहले से दिए गए पढ़ने और लिखने के अभ्यास आज़मा सकते हैं। अकाउंट बनाने पर आपका शब्द-कोश सभी डिवाइस पर सिंक होता है और आप नए पाठ और लेखन की जाँच के लिए AI का इस्तेमाल कर सकते हैं।',
    ],
    ['यह किस स्तर के लिए है?', 'शुरुआती (A2) से उन्नत (C1) तक। हर अभ्यास से पहले आप स्तर चुनते हैं और कभी भी बदल सकते हैं।'],
    [
      'शब्द-कोश कैसे काम करता है?',
      'पढ़ते समय किसी शब्द पर टैप करें या उसे बगल के पैनल में खींचें, उसका अर्थ और उच्चारण देखें और सहेजें। शब्द-कोश में कार्ड और टाइपिंग से दोहराने की सुविधा है, और जो शब्द अभी याद नहीं हुए वे पहले आते हैं।',
    ],
    ['क्या कुछ इंस्टॉल करना होगा?', 'नहीं। English Fun ब्राउज़र में चलता है, कंप्यूटर और फ़ोन दोनों पर।'],
    [
      'कौन-कौन सी भाषाएँ उपलब्ध हैं?',
      'शब्दों के अर्थ, अनुवाद और सुझाव हिन्दी, वियतनामी, स्पैनिश, पुर्तगाली, फ़्रेंच, जर्मन, इंडोनेशियाई, जापानी, कोरियाई और चीनी में मिलते हैं। ऐप खोलते समय अपनी भाषा चुनें और कभी भी बदलें।',
    ],
  ],
  ctaTitle: 'अपना पहला पढ़ने का अभ्यास शुरू करें',
  ctaText: 'अकाउंट की ज़रूरत नहीं। विषय चुनें, पढ़ें और कुछ ही मिनटों में नए शब्द सहेजें।',
  chrome: {
    topics: 'विषय',
    blog: 'ब्लॉग',
    faq: 'सवाल-जवाब',
    mainNav: 'मुख्य नेविगेशन',
    footerNav: 'फ़ुटर लिंक',
    tagline: 'अंग्रेज़ी पढ़ने और लिखने का अभ्यास करें, और अपना शब्द-कोश बनाएँ।',
    signIn: 'साइन इन',
    try: 'आज़माएँ',
    share: 'शेयर करें',
    shareTitle: 'यह पेज शेयर करें',
    shareHint: 'उन दोस्तों को भेजें जो अंग्रेज़ी सीख रहे हैं।',
    shareText: 'English Fun के साथ अंग्रेज़ी पढ़ने और लिखने का अभ्यास करें और अपना शब्द-कोश बनाएँ:',
    copyLink: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया',
    more: 'और',
    language: 'भाषा',
    close: 'बंद करें',
  },
}

/** Vietnamese first (the original site at "/"), then English, then the app's language order. */
export const HOMES: HomeCopy[] = [vi, en, es, pt, fr, de, id, ja, ko, zh, hi]

export const VI = vi

/** Address of a language's home page. */
export const homePath = (h: HomeCopy) => (h.code === 'vi' ? '/' : `/${h.code}/`)

/** The app in guest mode, opened in this language. English has no app language, so the app asks. */
export const tryUrl = (h: HomeCopy) => (h.code === 'en' ? '/app/?guest=1' : `/app/?guest=1&lang=${h.code}`)
