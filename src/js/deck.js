import { gsap } from 'gsap';
import { internships } from './data.js';
import { play } from './sound.js';

const pad = (n) => String(n).padStart(2, '0');

function cardHTML(item, i, total) {
  return `
    <article class="card" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${total}: ${item.company}">
      <div class="card__top mono"><span>${pad(i + 1)} / ${pad(total)}</span><span>${item.duration}</span></div>
      <h3 class="card__company">${item.company}</h3>
      <p class="card__role">${item.role}</p>
      <p class="card__desc">${item.desc}</p>
      <ul class="card__points">${item.points.map((p) => `<li>${p}</li>`).join('')}</ul>
      <div class="card__stats">${item.stats.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('')}</div>
    </article>`;
}

// A physical stack of index cards: drag the top one off (or use the
// buttons / arrow keys) and it slides to the back of the pile.
export function initDeck({ reduced }) {
  const deck = document.getElementById('deck');
  const count = document.getElementById('deck-count');
  const total = internships.length;
  deck.innerHTML = internships.map((item, i) => cardHTML(item, i, total)).join('');
  deck.tabIndex = 0;

  let order = [...deck.children]; // order[0] is on top
  let busy = false;

  const pose = (depth) => ({
    x: 0,
    y: depth * 16,
    rotation: depth === 0 ? 0 : (depth % 2 ? 1 : -1) * (1.5 + depth),
    scale: 1 - depth * 0.045,
    opacity: depth > 3 ? 0 : 1,
    zIndex: total - depth,
  });

  const layout = (animate = true) => {
    order.forEach((card, depth) => {
      const p = pose(depth);
      card.setAttribute('aria-hidden', depth === 0 ? 'false' : 'true');
      if (animate && !reduced) gsap.to(card, { ...p, duration: 0.7, ease: 'expo.out' });
      else gsap.set(card, p);
    });
    const idx = [...deck.children].indexOf(order[0]);
    count.textContent = `${pad(idx + 1)} / ${pad(total)}`;
  };

  const sendToBack = (dir = -1, fromX = 0) => {
    if (busy) return;
    busy = true;
    const top = order[0];
    play('whoosh');
    gsap.to(top, {
      x: dir * (deck.offsetWidth + 120),
      rotation: dir * 18,
      duration: reduced ? 0 : 0.45,
      ease: 'power2.in',
      startAt: { x: fromX },
      onComplete: () => {
        order = [...order.slice(1), top];
        gsap.set(top, { zIndex: 0 });
        layout();
        busy = false;
      },
    });
  };

  const bringBack = () => {
    if (busy) return;
    busy = true;
    const last = order[order.length - 1];
    order = [last, ...order.slice(0, -1)];
    play('pop');
    gsap.set(last, { zIndex: total + 1, x: -(deck.offsetWidth + 120), rotation: -18, opacity: 1 });
    layout();
    gsap.delayedCall(reduced ? 0 : 0.5, () => (busy = false));
  };

  document.getElementById('deck-next').addEventListener('click', () => sendToBack(-1));
  document.getElementById('deck-prev').addEventListener('click', bringBack);
  deck.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') sendToBack(-1);
    if (e.key === 'ArrowLeft') bringBack();
  });

  // Pointer drag on the top card.
  let drag = null;
  deck.addEventListener('pointerdown', (e) => {
    const card = e.target.closest('.card');
    if (!card || card !== order[0] || busy) return;
    drag = { card, x0: e.clientX, y0: e.clientY, dx: 0, t: performance.now(), id: e.pointerId };
    card.setPointerCapture(e.pointerId);
    gsap.killTweensOf(card);
  });
  deck.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x0;
    const dy = (e.clientY - drag.y0) * 0.25;
    gsap.set(drag.card, { x: drag.dx, y: dy, rotation: drag.dx * 0.05 });
  });
  const release = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { card, dx, t } = drag;
    drag = null;
    const velocity = Math.abs(dx) / Math.max(1, performance.now() - t);
    if (Math.abs(dx) > deck.offsetWidth * 0.28 || velocity > 0.9) {
      sendToBack(Math.sign(dx) || -1, dx);
    } else {
      gsap.to(card, { ...pose(0), duration: 0.6, ease: 'elastic.out(1, 0.6)' });
    }
  };
  deck.addEventListener('pointerup', release);
  deck.addEventListener('pointercancel', release);

  layout(false);

  if (!reduced) {
    gsap.from(order, {
      y: 220,
      rotation: (i) => (i % 2 ? 12 : -12),
      opacity: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: deck, start: 'top 80%' },
      onComplete: () => layout(false),
    });
  }
}
