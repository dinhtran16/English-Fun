// Takes the app screenshots used on the home pages (public/img/doc-hieu-<lang>.jpg, viet-dich-<lang>.jpg).
// Usage: npm run cf:dev (in another terminal), then: node scripts/app-screenshots.cjs <out-dir> [lang]
// Shots are 1360x850 so long menu labels fit; resize them to 1280x800 JPEG before copying into public/img/
// (vi keeps the plain names doc-hieu.jpg / viet-dich.jpg). Dictionary and translation calls are mocked.
const { chromium } = require('playwright');
const OUT = process.argv[2];
const ONLY = process.argv[3];
// Meanings of the sample word bank in each language.
const M = {
  vi: { delay: 'làm trễ', experience: 'trải nghiệm', available: 'còn trống', versatile: 'đa năng', crowded: 'đông đúc', ancient: 'cổ kính', colleague: 'đồng nghiệp', peaceful: 'yên bình' },
  es: { delay: 'retrasar', experience: 'experiencia', available: 'disponible', versatile: 'versátil', crowded: 'abarrotado', ancient: 'antiguo', colleague: 'compañero de trabajo', peaceful: 'tranquilo' },
  pt: { delay: 'atrasar', experience: 'experiência', available: 'disponível', versatile: 'versátil', crowded: 'lotado', ancient: 'antigo', colleague: 'colega de trabalho', peaceful: 'tranquilo' },
  fr: { delay: 'retarder', experience: 'expérience', available: 'disponible', versatile: 'polyvalent', crowded: 'bondé', ancient: 'ancien', colleague: 'collègue', peaceful: 'paisible' },
  de: { delay: 'verzögern', experience: 'Erfahrung', available: 'verfügbar', versatile: 'vielseitig', crowded: 'überfüllt', ancient: 'uralt', colleague: 'Kollege', peaceful: 'friedlich' },
  id: { delay: 'menunda', experience: 'pengalaman', available: 'tersedia', versatile: 'serbaguna', crowded: 'ramai', ancient: 'kuno', colleague: 'rekan kerja', peaceful: 'damai' },
  ja: { delay: '遅らせる', experience: '経験', available: '空いている', versatile: '多用途の', crowded: '混雑した', ancient: '古代の', colleague: '同僚', peaceful: '穏やかな' },
  ko: { delay: '지연시키다', experience: '경험', available: '이용 가능한', versatile: '다재다능한', crowded: '붐비는', ancient: '고대의', colleague: '동료', peaceful: '평화로운' },
  zh: { delay: '延误', experience: '经历', available: '可用的', versatile: '多用途的', crowded: '拥挤的', ancient: '古老的', colleague: '同事', peaceful: '宁静的' },
  hi: { delay: 'देर करना', experience: 'अनुभव', available: 'उपलब्ध', versatile: 'बहुमुखी', crowded: 'भीड़भाड़ वाला', ancient: 'प्राचीन', colleague: 'सहकर्मी', peaceful: 'शांत' },
};
const TOPIC = { delay: 'travel', experience: 'travel', available: 'travel', versatile: 'travel', crowded: 'travel', ancient: 'travel', colleague: 'work' };
const ANSWER = 'Our flight was planned to leave at six in the morning, but heavy traffic caused a delay on our way to the airport. When we finally got to the check-in counter, the gate had already closed. The airline staff were kind and helped us book a seat on the next available flight. Although we lost half a day, this experience taught us to always leave extra time when we travel.';

(async () => {
  const b = await chromium.launch();
  for (const lang of Object.keys(M)) {
    if (ONLY && lang !== ONLY) continue;
    const ctx = await b.newContext({ viewport: { width: 1360, height: 850 }, deviceScaleFactor: 1, locale: 'en-US' });
    const now = Date.now();
    const bank = Object.keys(TOPIC).map((w, i) => ({ word: w, meaning: M[lang][w], topicId: TOPIC[w], addedAt: now - i * 60000, practiceCount: w === 'ancient' || w === 'colleague' ? 2 : 0 }));
    await ctx.addInitScript(([lang, bank]) => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.clear();
        localStorage.setItem('english-fun:lang', lang);
        localStorage.setItem('english-fun:vocab', JSON.stringify(bank));
        localStorage.setItem('english-fun:level', 'B1');
        sessionStorage.setItem('seeded', '1');
      }
    }, [lang, bank]);
    await ctx.route('https://api.dictionaryapi.dev/**', (r) => r.fulfill({ json: [{ phonetic: '/ˈpiːsfl/', meanings: [{ partOfSpeech: 'adjective', definitions: [{ definition: 'Calm and quiet, without worry or trouble.', example: 'a peaceful morning by the river' }] }] }] }));
    await ctx.route('https://api.mymemory.translated.net/**', (r) => r.fulfill({ json: { responseData: { translatedText: M[lang].peaceful } } }));
    const p = await ctx.newPage();
    p.on('pageerror', (e) => console.log(lang, 'pageerror', e.message));

    // Reading: "A Weekend in Hoi An", look up "peaceful", start a translation.
    await p.goto('http://localhost:8787/app/?guest=1&topic=travel&skill=reading');
    for (let i = 0; i < 12; i++) {
      await p.waitForSelector('.passage', { timeout: 10000 });
      if ((await p.textContent('.practice-head h1, .practice-head h2')).includes('Hoi An')) break;
      await p.locator('.practice-head .row button').nth(1).click();
      await p.waitForTimeout(300);
    }
    await p.locator('.passage span', { hasText: /^peaceful$/ }).first().click();
    await p.waitForTimeout(600);
    await p.locator('.toolbar button').click();
    const ref = (await p.textContent('.reference p, .reference div:not(.eyebrow)')).trim();
    await p.locator('.toolbar button').click();
    await p.locator('.toolbar input[type=checkbox]').check();
    const stop = /[.。।!?！？]/g;
    let m, cut = 0, n = 0;
    while ((m = stop.exec(ref)) && n < 2) { cut = m.index + 1; n++; }
    await p.locator('.stack textarea').fill(ref.slice(0, cut || 80).trim().replace(/[.]$/, '') + (lang === 'ja' || lang === 'zh' ? '…' : '...'));
    await p.mouse.move(0, 0);
    await p.locator('.stack textarea').blur();
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/doc-hieu-${lang}.jpg`, type: 'jpeg', quality: 85 });

    // Writing: "A Missed Flight" with five words to use.
    await p.goto('http://localhost:8787/app/?guest=1&topic=travel&skill=writing');
    await p.waitForSelector('.source-vi', { timeout: 10000 });
    await p.locator('textarea').first().fill(ANSWER);
    await p.locator('textarea').first().focus();
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${OUT}/viet-dich-${lang}.jpg`, type: 'jpeg', quality: 85 });
    await ctx.close();
    console.log('done', lang);
  }
  await b.close();
})();
