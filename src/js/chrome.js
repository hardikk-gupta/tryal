import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters } from './data.js';

const SHIFT_START = 20 * 60; // 20:00
const SHIFT_END = 30 * 60; // 06:00 the next morning
const DARK = new Set(['origin', 'cases', 'wall', 'contact']);

const pad = (n) => String(n).padStart(2, '0');
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const mins = h * 60 + m;
  return mins < SHIFT_START ? mins + 24 * 60 : mins; // past midnight
};
const formatMinutes = (mins) => {
  const m = Math.round(mins) % (24 * 60);
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

// The HUD reads scroll position as a time of night. It is piecewise: each
// chapter starts exactly at the time printed on its header, and time runs
// linearly between chapters, finishing at 06:00 at the very bottom.
export function initChrome() {
  const hud = document.getElementById('hud');
  const time = document.getElementById('hud-time');
  const label = document.getElementById('hud-label');
  const fill = document.getElementById('hud-fill');
  const moon = document.getElementById('hud-moon');
  const topbar = document.getElementById('topbar');
  const navLinks = [...document.querySelectorAll('.nav a')];

  let stops = [];
  const measure = () => {
    const max = ScrollTrigger.maxScroll(window);
    stops = chapters
      .map((c) => {
        const el = document.getElementById(c.id);
        // ScrollTrigger pin spacers shift layout, so read live positions.
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return { y: Math.min(top, max), t: toMinutes(c.time) };
      })
      .concat({ y: max, t: SHIFT_END });
  };
  const timeAt = (y) => {
    for (let i = stops.length - 2; i >= 0; i--) {
      const a = stops[i];
      const b = stops[i + 1];
      if (y >= a.y) {
        const span = Math.max(1, b.y - a.y);
        return a.t + (b.t - a.t) * Math.min(1, (y - a.y) / span);
      }
    }
    return stops[0]?.t ?? SHIFT_START;
  };

  ScrollTrigger.addEventListener('refresh', measure);
  measure();

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const mins = timeAt(self.scroll());
      const progress = (mins - SHIFT_START) / (SHIFT_END - SHIFT_START);
      time.textContent = formatMinutes(mins);
      fill.style.strokeDashoffset = String(100 - progress * 100);
      moon.style.transform = `rotate(${progress * 360}deg)`;
    },
  });

  chapters.forEach(({ id, label: text }) => {
    const section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top top+=34',
      end: 'bottom top+=34',
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        label.textContent = text;
        hud.classList.toggle('is-hidden', id === 'hero');
        topbar.classList.toggle('is-dark', DARK.has(id));
        navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${id}`));
      },
    });
  });
}

export function initIstClock() {
  const el = document.getElementById('ist-clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const tick = () => (el.textContent = `Delhi ${fmt.format(new Date())} IST`);
  tick();
  setInterval(tick, 1000);
}
