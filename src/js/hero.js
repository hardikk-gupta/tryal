import { gsap } from 'gsap';
import { monitorSlides } from './data.js';

const pad = (n) => String(Math.floor(n)).padStart(2, '0');

// "I design apps & websites end to end, then build them in code." — the
// words sit slightly off-grid and snap into alignment when you hover (or every few
// seconds on touch screens).
function initClaim(reduced) {
  const claim = document.getElementById('hero-claim');
  if (!claim) return;
  const words = [...claim.querySelectorAll('span')];
  const misalign = () => {
    words.forEach((w) => {
      w.style.transform = `translate(${gsap.utils.random(-3, 3)}px, ${gsap.utils.random(-6, 6)}px) rotate(${gsap.utils.random(-4, 4)}deg)`;
    });
  };
  const align = () => words.forEach((w) => (w.style.transform = 'none'));
  if (reduced) return;
  misalign();

  if (window.matchMedia('(hover: hover)').matches) {
    claim.addEventListener('pointerenter', align);
    claim.addEventListener('pointerleave', misalign);
  } else {
    let aligned = false;
    setInterval(() => ((aligned = !aligned) ? align() : misalign()), 2400);
  }
}

// The hero "monitor" plays a slow slideshow of shipped work with a running
// timecode, like footage from a desk camera.
function initMonitor(reduced) {
  const screen = document.getElementById('monitor');
  if (!screen) return;
  screen.innerHTML =
    monitorSlides
      .map(([src, alt], i) => `<img class="hero__slide${i === 0 ? ' is-on' : ''}" src="${src}" alt="${alt}" ${i ? 'loading="lazy"' : ''} />`)
      .join('') + '<span class="rec mono"><i></i>REC</span><span class="tc mono" id="reel-tc">00:00:00</span>';
  const slides = [...screen.querySelectorAll('.hero__slide')];
  const tc = document.getElementById('reel-tc');
  let i = 0;
  const t0 = performance.now();
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(screen);
  if (!reduced) {
    setInterval(() => {
      if (!visible) return;
      slides[i].classList.remove('is-on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
    }, 3200);
  }
  const tick = () => {
    const t = (performance.now() - t0) / 1000;
    if (visible) tc.textContent = `00:${pad((t / 60) % 60)}:${pad(t % 60)}`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__letter', { yPercent: 110, rotate: 6, duration: 1.4, stagger: 0.08 })
    .from('.hero__portrait', { yPercent: 18, opacity: 0, duration: 1.4 }, 0.25)
    .from('.hero__meta, .hero__roles, .hero__foot', { opacity: 0, y: 16, duration: 1, stagger: 0.08 }, 0.5)
    .from('.hero__claim, .hero__monitor', { opacity: 0, y: 30, duration: 1.1, stagger: 0.1 }, 0.6);
  return tl;
}

export function initHero({ reduced }) {
  initClaim(reduced);
  initMonitor(reduced);
  if (reduced) return;

  // As the hero scrolls away the wordmark splits apart and the portrait sinks.
  // Scroll owns xPercent/rotation/scale; the intro owns yPercent; the pointer
  // owns y — so the three never fight over the same property.
  const letters = gsap.utils.toArray('.hero__letter');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
  letters.forEach((l, i) => {
    const mid = (letters.length - 1) / 2;
    const dir = i < mid ? -1 : 1;
    tl.to(l, { xPercent: dir * (30 + Math.abs(mid - i) * 22), rotation: dir * 4, ease: 'none' }, 0);
  });
  tl.to('.hero__portrait img', { scale: 0.9, transformOrigin: '50% 100%', opacity: 0.4, ease: 'none' }, 0);

  // Pointer parallax on the giant letters — subtle, desktop only.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const setters = letters.map((l) => gsap.quickTo(l, 'y', { duration: 0.8, ease: 'power3.out' }));
    window.addEventListener('pointermove', (e) => {
      if (window.scrollY > window.innerHeight) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const mid = (setters.length - 1) / 2;
      setters.forEach((set, i) => set(nx * (i - mid) * -14));
    });
  }
}
