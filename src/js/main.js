import '../styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { person, loaderLines } from './data.js';
import { initSound, play } from './sound.js';
import { initCursor } from './cursor.js';
import { initChrome, initIstClock } from './chrome.js';
import { initHero, heroIntro } from './hero.js';
import { initOrigin } from './origin.js';
import { initDeck } from './deck.js';
import { initCases } from './cases.js';
import { initWall } from './wall.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Smooth scroll ----------------------------------------------------------
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop(); // held until the loader finishes
}

// In-page links go through Lenis so pinned sections stay in sync.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else target.scrollIntoView();
  if (target.id === 'main' || a.classList.contains('skip-link')) target.focus?.({ preventScroll: true });
});

// --- Contact ------------------------------------------------------------------
function initContact() {
  const mail = document.getElementById('mail-link');
  mail.href = `mailto:${person.email}?subject=${encodeURIComponent(person.mailSubject)}&body=${encodeURIComponent(person.mailBody)}`;

  const toast = document.getElementById('toast');
  let timer;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  };
  document.getElementById('copy-mail').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      say('Email copied — tell me what you’re building');
      play('chime');
    } catch {
      say(person.email);
    }
  });

  if (!reduced) {
    gsap.from('.contact__title', {
      yPercent: 30,
      opacity: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.contact', start: 'top 70%' },
    });
    gsap.fromTo(
      '.contact__sky',
      { yPercent: 35 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } },
    );
  }
}

// --- Loader: tick from 19:00 to 20:00 while the essentials load ---------------
function waitForEssentials() {
  const img = document.querySelector('.hero__portrait img');
  const imgReady = img.complete ? Promise.resolve() : new Promise((r) => img.addEventListener('load', r, { once: true }));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const timeout = new Promise((r) => setTimeout(r, 3500));
  return Promise.race([Promise.all([imgReady, fonts]), timeout]);
}

async function runLoader() {
  const loader = document.getElementById('loader');
  const hh = document.getElementById('loader-hh');
  const mm = document.getElementById('loader-mm');
  const bar = document.getElementById('loader-bar');
  const note = document.getElementById('loader-note');

  if (reduced) {
    await waitForEssentials();
    loader.remove();
    document.body.classList.remove('is-loading');
    return;
  }

  const clock = { m: 0 };
  const tick = gsap.to(clock, {
    m: 60,
    duration: 2,
    ease: 'power1.inOut',
    onUpdate: () => {
      const m = Math.round(clock.m);
      hh.textContent = m === 60 ? '20' : '19';
      mm.textContent = String(m % 60).padStart(2, '0');
      bar.style.transform = `scaleX(${clock.m / 60})`;
      note.textContent = loaderLines[Math.min(loaderLines.length - 1, Math.floor((clock.m / 60) * loaderLines.length))];
    },
  });
  await Promise.all([waitForEssentials(), tick.then()]);

  await gsap
    .timeline()
    .to('.loader__inner', { y: -40, opacity: 0, duration: 0.5, ease: 'power2.in' })
    .to(loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
    .add(() => {
      document.body.classList.remove('is-loading');
      heroIntro();
    }, '-=0.45')
    .then();
  loader.remove();
}

// --- Boot ---------------------------------------------------------------------
initSound(document.getElementById('sound-toggle'));
initCursor();
initIstClock();
initHero({ reduced });
initOrigin({ reduced });
initDeck({ reduced });
initCases({ reduced, lenis });
initWall({ reduced, lenis });
initContact();
initChrome();

runLoader().then(() => {
  lenis?.start();
  ScrollTrigger.refresh();
});

// Late-loading images change section heights; keep triggers honest.
window.addEventListener('load', () => ScrollTrigger.refresh());
