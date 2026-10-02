import { gsap } from 'gsap';

// A dot that trails the pointer and reveals a verb ("Drag", "Open"…) over
// anything tagged with data-cursor. Fine pointers only.
export function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const el = document.getElementById('cursor');
  const label = document.getElementById('cursor-label');
  if (!el) return;

  document.documentElement.classList.add('has-cursor');
  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

  let seen = false;
  window.addEventListener('pointermove', (e) => {
    if (!seen) {
      seen = true;
      gsap.set(el, { x: e.clientX, y: e.clientY });
      gsap.to(el, { opacity: 1, duration: 0.3 });
    }
    xTo(e.clientX);
    yTo(e.clientY);
  });

  document.addEventListener('pointerover', (e) => {
    const target = e.target.closest('[data-cursor]');
    if (target) {
      label.textContent = target.dataset.cursor;
      el.classList.add('is-active');
    } else {
      el.classList.remove('is-active');
    }
  });
  document.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.2 }));
  document.addEventListener('pointerenter', () => seen && gsap.to(el, { opacity: 1, duration: 0.2 }));
}
