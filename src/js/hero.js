import { gsap } from 'gsap';

const pad = (n) => String(Math.floor(n)).padStart(2, '0');

// "I intentionally make misalignment look intentional." — the words sit
// slightly off-grid and snap into alignment when you hover (or every few
// seconds on touch screens).
function initClaim(reduced) {
  const claim = document.getElementById('hero-claim');
  if (!claim) return;
  const words = [...claim.querySelectorAll('span')];
  const misalign = () => {
    words.forEach((w) => {
      w.style.transform = `translate(${gsap.utils.random(-5, 5)}px, ${gsap.utils.random(-12, 12)}px) rotate(${gsap.utils.random(-6, 6)}deg)`;
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

function initReel() {
  const video = document.getElementById('hero-reel');
  const tc = document.getElementById('reel-tc');
  if (!video) return;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    },
    { threshold: 0.2 },
  );
  io.observe(video);
  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    tc.textContent = `00:${pad(t)}:${pad((t % 1) * 24)}`;
  });
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
  initReel();
  if (reduced) return;

  // As the hero scrolls away the wordmark splits apart and the portrait sinks.
  // Scroll owns xPercent/rotation/scale; the intro owns yPercent; the pointer
  // owns y — so the three never fight over the same property.
  const letters = gsap.utils.toArray('.hero__letter');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
  letters.forEach((l, i) => {
    const dir = i < 2 ? -1 : 1;
    tl.to(l, { xPercent: dir * (30 + Math.abs(1.5 - i) * 25), rotation: dir * 4, ease: 'none' }, 0);
  });
  tl.to('.hero__portrait img', { scale: 0.9, transformOrigin: '50% 100%', opacity: 0.4, ease: 'none' }, 0);

  // Pointer parallax on the giant letters — subtle, desktop only.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const setters = letters.map((l) => gsap.quickTo(l, 'y', { duration: 0.8, ease: 'power3.out' }));
    window.addEventListener('pointermove', (e) => {
      if (window.scrollY > window.innerHeight) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      setters.forEach((set, i) => set(nx * (i - 1.5) * -18));
    });
  }
}
