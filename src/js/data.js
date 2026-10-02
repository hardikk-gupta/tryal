// All copy, figures and imagery come from hardik-gupta.com.

const A = (p) => `${import.meta.env.BASE_URL}assets/${p}`;
export const asset = A;

export const person = {
  name: 'Hardik Gupta',
  alias: 'Nerdy Designer',
  city: 'Bangalore, India',
  site: 'https://hardik-gupta.com/',
  email: 'admin@hardik-gupta.com',
  mailSubject: "Let's get on a call",
  mailBody: "Hey Hardik,\n\nHere's what I'm building:\n\n",
  call: 'https://cal.com/hardik-gupta/30min',
  instagram: 'https://www.instagram.com/haha.hardikk/',
  linkedin: 'https://www.linkedin.com/in/hardikgupta01/',
  behance: 'https://www.behance.net/hardikg101',
  x: 'https://x.com/nerdy_designerr',
  github: 'https://github.com/hardikk-gupta',
};

// The night shift: each chapter owns a slice of the clock.
export const chapters = [
  { id: 'hero', time: '20:00', label: 'Clock in' },
  { id: 'origin', time: '21:30', label: 'Origin' },
  { id: 'hustle', time: '23:00', label: 'Work history' },
  { id: 'cases', time: '00:30', label: 'Case studies' },
  { id: 'wall', time: '02:45', label: 'Everything else' },
  { id: 'contact', time: '05:30', label: 'Clock out' },
];

// Loader lines, straight from the original site's loading screen.
export const loaderLines = ['cooking something crazy', 'thinking about a problem', 'checking the pixels, one sec', 'and… shipped'];

export const highlights = [
  { value: 2022, from: 2000, label: 'designing since', note: 'visual & graphic first' },
  { value: 4, label: 'apps built in code', note: 'Alter, Track It, Parchi, Hourbit' },
  { value: 5, label: 'brands at IDEX Media', note: 'Flipkart, Cult, Myntra, Amazon, Center Fruit' },
  { value: 33, suffix: '+', label: 'Nerdy Designer posts', note: 'and counting' },
];

export const principles = [
  ['The real problem, not the stated one', 'On the laundry app, the brief was scheduling. The actual problem was that nobody trusts a stranger with their clothes.'],
  ['I’ll push back, once, properly', 'You’re paying for my judgment, not my agreement. But it’s your product, and I won’t relitigate a call you’ve already made.'],
  ['The boring states too', 'Empty, loading, error, offline, first-run, the one where the name is too long. This is the part I’m stubborn about.'],
  ['Something buildable', 'Consistent spacing, components that behave, specified states, motion with real durations in milliseconds.'],
];

export const experience = [
  {
    company: 'Freelance',
    year: '2026',
    role: 'UI/UX & visual design',
    desc: 'Back to working with founders and teams directly.',
    points: [
      'Products that need <b>both the thinking and the screens</b>.',
      'Based in <b>Bangalore</b>, working with people anywhere.',
    ],
    tags: ['Product design', 'Design systems', 'Motion'],
  },
  {
    company: 'IDEX Media',
    year: '2026',
    role: 'Full-time designer',
    desc: 'Full time, often on site at the brands IDEX works for.',
    points: [
      '<b>Flipkart first, now Cult.</b>',
      'Creatives for <b>Myntra, Amazon and Center Fruit</b>, plus the meetings where the brief actually gets decided.',
    ],
    tags: ['Flipkart', 'Cult', 'Myntra · Amazon'],
  },
  {
    company: 'Freelance designer',
    year: '2025',
    role: 'Identity, graphics & product',
    desc: 'Work for my own clients, alongside the internship.',
    points: [
      'Identity, graphics and product work, end to end.',
      'The first time people paid for <b>my thinking and not just my output</b>.',
    ],
    tags: ['Identity', 'Graphics', 'Product'],
  },
  {
    company: 'Velossalabs',
    year: '2025',
    role: 'UI/UX design intern',
    desc: 'A remote internship.',
    points: [
      'Where product design <b>stopped being something I learned from videos</b>…',
      '…and became <b>real work with a team</b>.',
    ],
    tags: ['Remote', 'UI/UX', 'Team'],
  },
];

const S = (dir, files) => files.map(([f, alt]) => [A(`cases/${dir}/${f}.webp`), alt]);

export const cases = [
  {
    id: 'alter',
    no: '01',
    title: 'Alter',
    kind: 'AI companion · Android',
    sub: 'A personal AI assistant that works like a friend with a good memory. Say a thought, share a screenshot, scan a page, and Alter sorts it into notes, memories and to-dos. Native Android, local-first, powered by Gemini.',
    tags: ['Android', 'Kotlin + Compose', 'Latest Gemini'],
    stat: ['1', 'place to put anything'],
    theme: { bg: '#FFD44E', fg: '#111111', accent: '#111111' },
    cover: A('cases/alter/x_home.webp'),
    story: [
      ['The problem', 'A new AI tool shows up every week and each one does one thing. Notes here, transcription there, chat somewhere else. <b>You end up remembering which tool holds which thought</b>, and none of them remember you.'],
      ['How I got there', 'I sketched every screen on paper, then <b>built the whole component library in Figma</b>, micro-interactions included. Google AI Studio turned that design into native Kotlin and Jetpack Compose.'],
      ['The key decision', '<b>One place to put anything.</b> Voice, screenshot, scan, text, PDF: Alter works out what it is and files it as a note, a memory or a task.'],
      ["What I'd fix", 'It does a lot, and an all-in-one app can quietly become all-in-one for its maker. <b>Next is testing it with people who aren’t me.</b>'],
    ],
    screens: S('alter', [
      ['x_home', 'Home'],
      ['x_chat', 'Alter AI'],
      ['x_memories', 'Memories'],
      ['x_upcoming', 'Upcoming'],
      ['x_notes', 'Notes'],
      ['x_canvas', 'Canvas'],
    ]),
    process: { title: 'Paper first', items: S('alter', [['csk_onboarding', 'Onboarding sketch'], ['csk_home', 'Home sketch'], ['csk_memory', 'Memory sketch'], ['csk_alterai', 'Alter AI sketch']]) },
    link: ['Source on GitHub', 'https://github.com/User01005/alter-ai'],
  },
  {
    id: 'washio',
    no: '02',
    title: 'Washio',
    kind: 'Laundry app · UX/UI case study',
    sub: 'Pick a garment care, fill a bag, choose a pickup slot, and see which stage your clothes are in. Borrowed from delivery apps, rebuilt for a round trip that takes days.',
    tags: ['UX + UI', 'Design system', 'Figma prototype'],
    stat: ['3', 'browse · compare · book'],
    theme: { bg: '#A9DEFF', fg: '#06244A', accent: '#0A2BF5' },
    cover: A('cases/washio/wf_home.webp'),
    story: [
      ['The problem', 'In smaller cities there is no one place to find a laundry. You ask around, or <b>you don’t find one at all</b>.'],
      ['How I got there', 'Research first, then personas, then <b>a full clickable prototype in Figma</b>.'],
      ['The key decision', 'Treat laundries like restaurants: <b>browse, compare, book</b>, all in one list.'],
      ['Being honest', 'This one is a design case study. It hasn’t been built or run with real laundries yet.'],
    ],
    screens: S('washio', [
      ['wf_home', 'Home'],
      ['wf_search', 'Search'],
      ['wf_results', 'Results'],
      ['wf_vendor', 'Laundry page'],
      ['wf_items', 'Fill the bag'],
      ['wf_checkout', 'Checkout'],
      ['wf_booked', 'Booked'],
      ['wf_track', 'Tracking'],
    ]),
    process: {
      title: 'Sketch → low-fi → UI',
      items: S('washio', [['ws_05', 'Paper sketch'], ['ws_07', 'Paper sketch'], ['wl_0', 'Low-fi welcome'], ['wl_1', 'Low-fi login'], ['wl_3', 'Low-fi map']]),
    },
    link: ['Full case study on Notion', 'https://jealous-ghost-a9e.notion.site/Laundry-App-Product-UX-UI-Design-3c87ea0aa24480f8b54ff007f0655dcb'],
  },
  {
    id: 'trackit',
    no: '03',
    title: 'Track It',
    kind: 'Expense tracker · Android',
    sub: 'Voice, receipt scan, and a home-screen widget you can log from without opening the app. Built because every tracker asks you to stop mid-purchase and file paperwork for a ₹40 chai.',
    tags: ['Android', 'Widget', 'Voice input', 'Live'],
    stat: ['₹40', 'chai, logged from the widget'],
    theme: { bg: '#B4F6B8', fg: '#0B2A12', accent: '#0B2A12' },
    cover: A('cases/trackit/t_home.webp'),
    story: [
      ['The problem', 'Every expense app I tried wanted <b>six taps and a category dropdown</b> to log a ₹40 chai. Friction was the product killer, not the feature gap.'],
      ['How I got there', 'I read a year of one-star reviews across the top trackers in India. The complaint was never features. It was always <b>“I stopped logging after a week.”</b>'],
      ['The key decision', 'Logging had to happen <b>without opening the app</b>. That made the home-screen widget the product, and the app the place you go to look back.'],
      ["What I'd fix", 'No onboarding yet, tags are still preset-only. Bank sync was deferred on purpose: <b>trust first, automation later</b>.'],
    ],
    screens: S('trackit', [
      ['t_widget', 'Widget logging'],
      ['t_voice', 'Voice capture'],
      ['t_scan', 'Receipt scan'],
      ['t_analysis', 'Monthly analysis'],
      ['t_home', 'Home'],
      ['t_settings', 'Budget setup'],
    ]),
    process: { title: 'Wireframes', items: S('trackit', [['tw_home', 'Home wireframe'], ['tw_analysis', 'Analysis wireframe'], ['tw_voice', 'Voice wireframe']]) },
    link: ['Source on GitHub', 'https://github.com/User01005/Trackit'],
  },
  {
    id: 'parchi',
    no: '04',
    title: 'Parchi',
    kind: 'Voice billing · Android',
    sub: 'The shopkeeper says the order out loud, in Hindi, Hinglish or English, and Parchi turns it into a receipt: item, quantity, price, total. Then print it, or share it straight to WhatsApp.',
    tags: ['Android', 'Kotlin + Compose', 'Voice billing'],
    stat: ['5', 'versions reshaped'],
    theme: { bg: '#E7BBFF', fg: '#2A0B3D', accent: '#6A1FB0' },
    story: [
      ['The problem', 'At a kirana counter the queue doesn’t wait. <b>Writing a bill by hand, or tapping through a menu, is the slow part.</b>'],
      ['How I got there', 'I designed the flow and directed Google AI Studio to build it in Kotlin and Jetpack Compose, reshaping it across five versions.'],
      ['The key decision', '<b>You talk, the bill writes itself.</b> Gemini reads the sentence when there’s network, and a local phonetic parser takes over when there isn’t.'],
      ['Being honest', 'It’s in daily testing, not yet run by a shopkeeper who isn’t me. Direct thermal printing over Bluetooth isn’t built; printing goes through Android’s own print dialog.'],
    ],
    link: ['Source on GitHub', 'https://github.com/hardikk-gupta/Parchi'],
  },
  {
    id: 'hourbit',
    no: '05',
    title: 'Hourbit',
    kind: 'Focus timer · Android',
    sub: 'A visual focus tracker that turns deep work into falling sand, a daily heatmap and long-term momentum. Built around a 25-minute hourglass that flips and keeps going.',
    tags: ['Android', 'Kotlin + Compose', 'Widget', 'In daily use'],
    stat: ['25', 'minute hourglass'],
    theme: { bg: '#0E140F', fg: '#E9FFE6', accent: '#7CFF6B' },
    cover: A('cases/hourbit/hb_home.webp'),
    story: [
      ['The problem', 'Focus timers ask you to care about <b>this one session</b>. What keeps me going is the streak.'],
      ['How I got there', 'A contribution grid already makes people come back every day. <b>So the grid became the timer.</b>'],
      ['The key decision', 'The grid lives <b>on the home screen</b>, not inside the app. Darker squares mean more time.'],
      ["What I'd fix", 'A missed day looks like failure. I want it to read as <b>pick it back up</b>.'],
    ],
    screens: S('hourbit', [
      ['hb_home', 'Home'],
      ['hb_homerun', 'Session running'],
      ['hb_focus', 'Focus'],
      ['hb_paused', 'Paused'],
      ['hb_day', 'Day view'],
      ['hb_themes', 'Themes'],
    ]),
    process: { title: 'The first build, on my phone', items: S('hourbit', [['hb_v1home', 'v1 home'], ['hb_v1focus', 'v1 focus'], ['hb_v1theme', 'v1 themes'], ['hb_widget', 'The real widget']]) },
    link: ['Source on GitHub', 'https://github.com/User01005/Hourbit'],
  },
];

export const monitorSlides = [
  [A('monitor/apps.webp'), 'Alter, Track It, Hourbit and Washio home screens'],
  [A('monitor/fxkit.webp'), 'FXKIT — photo and video effects studio in the browser'],
  [A('monitor/mistline.webp'), 'Mistline — web radio for monsoon road trips'],
];

// Everything else I've made. `r` = height / width, `k` = filter key.
const W = (n, title, k, r) => ({ src: A(`wall/${String(n).padStart(2, '0')}.webp`), title, k, r });
export const wallFilters = [
  ['all', 'Everything'],
  ['brand', 'Branding & packaging'],
  ['graphics', 'Carousels & graphics'],
  ['identity', 'Logos & identity'],
  ['web', 'Websites'],
];
export const wall = [
  W(1, 'Vanorgo — logo', 'identity', 1.19),
  W(2, 'Vanorgo Prana — the difference', 'brand', 1.0),
  W(3, 'Nerdy Designer — brand post', 'graphics', 1.25),
  W(4, 'FXKIT — effects studio in the browser', 'web', 0.52),
  W(5, 'Vanorgo — Pure by Nature', 'brand', 1.49),
  W(6, 'The Man Who Yelled at Clouds — poster', 'graphics', 1.25),
  W(7, 'UI cards — carousel', 'graphics', 1.0),
  W(8, 'Think Beyond Now — scroll-story website', 'web', 1.58),
  W(9, 'Vanorgo — hand-churned process', 'brand', 1.0),
  W(10, 'Bisleri — carousel', 'graphics', 1.25),
  W(11, 'Asian Cadet Cup 2025 — logo', 'identity', 1.27),
  W(12, 'Contour gradient — poster', 'graphics', 1.25),
  W(13, 'Vanorgo — Rooted in Tradition', 'brand', 1.5),
  W(14, 'A Space To — landing concept', 'graphics', 1.0),
  W(15, 'Mistline — monsoon web radio', 'web', 0.51),
  W(16, 'You can do it — type poster', 'graphics', 1.25),
  W(17, 'Vanorgo Prana — product shot', 'brand', 1.0),
  W(18, 'Visual Cortex — light', 'graphics', 1.0),
  W(19, 'Visual Cortex — dark', 'graphics', 1.0),
  W(20, 'Asian Cadet Cup 2025 — key visual', 'identity', 1.27),
  W(21, 'Unconventional-layout website', 'web', 1.61),
  W(22, 'Kinley — carousel', 'graphics', 1.25),
  W(23, 'Vanorgo — Source to Spoon', 'brand', 1.5),
  W(24, 'Design Speaks — mockups', 'graphics', 1.25),
  W(25, 'Velossalabs — card concepts', 'identity', 1.0),
  W(26, 'Invisible Structures — carousel', 'graphics', 1.26),
  W(27, "Vanorgo — what's inside", 'brand', 1.0),
  W(28, 'Wireframe to Design — post', 'graphics', 1.25),
  W(29, 'Isometric website', 'web', 1.61),
  W(30, 'Lollypop.design — card concepts', 'identity', 1.0),
  W(31, 'Vanorgo — Rooted in Tradition, mobile', 'brand', 1.5),
  W(32, 'Alter — launch visual', 'graphics', 1.25),
  W(34, 'Asian Cadet Cup 2025 — event coverage', 'identity', 1.27),
  W(35, 'Yoga — poster', 'graphics', 1.25),
  W(36, 'Vanorgo — Source to Spoon, mobile', 'brand', 1.5),
  W(37, 'Nerdy Designer — card concepts', 'identity', 1.0),
  W(38, 'Alter — desktop concept', 'graphics', 1.25),
  W(39, 'Vanorgo — web banner', 'brand', 0.4),
  W(40, 'Asian Cadet Cup 2025 — design that travelled', 'identity', 1.27),
  W(41, 'Alter — memories, desktop', 'graphics', 1.25),
  W(42, 'Playful-theme website', 'web', 0.39),
  W(43, 'Vanorgo — Pure by Nature, mobile', 'brand', 1.5),
  W(44, 'Hit follow — Nerdy Designer', 'graphics', 1.25),
];
