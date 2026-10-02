import { gsap } from 'gsap';
import { wall, wallFilters } from './data.js';
import { play } from './sound.js';

const wrap = (v, m) => ((v % m) + m) % m;

// An endless, draggable pin-board of posters. Columns of varying-height
// tiles tile the plane in both directions; positions wrap with modulo so
// the wall never runs out. Rendering is one transform per tile per frame,
// and the loop sleeps while the wall is off-screen.
export function initWall({ reduced, lenis }) {
  const root = document.getElementById('wall-canvas');
  const inner = document.getElementById('wall-inner');
  const filtersEl = document.getElementById('wall-filters');

  let tiles = [];
  let cols = [];
  let pitchX = 0;
  let totalW = 0;
  let maxTileH = 0;
  let filter = 'all';

  const state = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, drift: reduced ? 0 : 0.35 };

  function build() {
    const W = root.clientWidth;
    const H = root.clientHeight;
    const colW = W < 760 ? 150 : W < 1200 ? 210 : 250;
    const gap = W < 760 ? 12 : 18;
    pitchX = colW + gap;
    const nCols = Math.max(Math.ceil(W / pitchX) + 2, 6);
    totalW = nCols * pitchX;
    maxTileH = colW * 1.8;

    inner.innerHTML = '';
    tiles = [];
    cols = [];
    let cursor = 0;
    for (let c = 0; c < nCols; c++) {
      const col = { x: c * pitchX, factor: c % 2 ? 0.86 : 1, stagger: (c % 3) * colW * 0.37, height: 0, tiles: [] };
      // Fill each column until it comfortably exceeds the viewport, so
      // wrapping never exposes a gap.
      while (col.height < H + maxTileH * 1.5 || col.tiles.length < 3) {
        const index = cursor++ % wall.length;
        const item = wall[index];
        const h = Math.round(colW * Math.min(item.r, 1.8));
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'tile';
        el.tabIndex = -1;
        el.dataset.index = String(index);
        el.style.width = `${colW}px`;
        el.style.height = `${h}px`;
        el.setAttribute('aria-label', item.title);
        el.innerHTML = `<img src="${item.src}" alt="" loading="lazy" decoding="async" draggable="false" />`;
        inner.append(el);
        const tile = { el, y: col.height, h, index, col };
        col.tiles.push(tile);
        tiles.push(tile);
        col.height += h + gap;
      }
      // Rotate the starting point between columns so neighbours differ.
      cursor += 3;
      cols.push(col);
    }
    applyFilter(false);
    render();
  }

  function render() {
    const scrollShift = reduced ? 0 : window.scrollY * -0.18;
    for (const col of cols) {
      const x = wrap(col.x + state.x, totalW) - pitchX;
      const oy = (state.y + scrollShift) * col.factor + col.stagger;
      for (const t of col.tiles) {
        const y = wrap(t.y + oy, col.height) - maxTileH;
        t.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }
  }

  // --- Animation loop: eased follow + inertia + idle drift -------------
  let running = false;
  let dragging = false;
  const loop = () => {
    if (!dragging) {
      state.tx += state.vx - state.drift;
      state.ty += state.vy;
      state.vx *= 0.92;
      state.vy *= 0.92;
    }
    state.x += (state.tx - state.x) * 0.14;
    state.y += (state.ty - state.y) * 0.14;
    render();
  };
  const start = () => {
    if (running) return;
    running = true;
    gsap.ticker.add(loop);
  };
  const stop = () => {
    running = false;
    gsap.ticker.remove(loop);
  };
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(root);

  // --- Pointer: drag to pan, tap to open -------------------------------
  // On touch, vertical swipes keep scrolling the page (touch-action: pan-y);
  // horizontal swipes pan the wall.
  let p = null;
  root.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    p = { id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: 0, type: e.pointerType };
    dragging = true;
    state.vx = state.vy = 0;
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', (e) => {
    if (!p || e.pointerId !== p.id) return;
    const dx = e.clientX - p.lx;
    const dy = p.type === 'touch' ? 0 : e.clientY - p.ly;
    p.lx = e.clientX;
    p.ly = e.clientY;
    p.moved += Math.abs(dx) + Math.abs(dy);
    if (p.moved > 6) root.classList.add('is-dragging');
    state.tx += dx * 1.15;
    state.ty += dy * 1.15;
    state.vx = dx * 0.9;
    state.vy = dy * 0.9;
  });
  const end = (e) => {
    if (!p || e.pointerId !== p.id) return;
    const wasTap = p.moved < 6;
    p = null;
    dragging = false;
    root.classList.remove('is-dragging');
    if (wasTap) {
      const tile = document.elementFromPoint(e.clientX, e.clientY)?.closest('.tile');
      if (tile && !tile.classList.contains('is-dim')) openLightbox(Number(tile.dataset.index));
    }
  };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', (e) => {
    if (p && e.pointerId === p.id) {
      p = null;
      dragging = false;
      root.classList.remove('is-dragging');
    }
  });

  // Keyboard: arrows pan, Enter opens the piece closest to the centre.
  root.addEventListener('keydown', (e) => {
    const step = 140;
    const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[e.key]) {
      e.preventDefault();
      state.tx += moves[e.key][0];
      state.ty += moves[e.key][1];
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let best = null;
      let bestD = Infinity;
      tiles.forEach((t) => {
        if (t.el.classList.contains('is-dim')) return;
        const b = t.el.getBoundingClientRect();
        const d = Math.hypot(b.left + b.width / 2 - cx, b.top + b.height / 2 - cy);
        if (d < bestD) {
          bestD = d;
          best = t;
        }
      });
      if (best) openLightbox(best.index);
    }
  });

  // --- Filters ----------------------------------------------------------
  filtersEl.innerHTML = wallFilters
    .map(([key, name]) => `<button type="button" class="chip" data-filter="${key}" aria-pressed="${key === 'all'}">${name}</button>`)
    .join('');
  function applyFilter(withSound = true) {
    tiles.forEach((t) => t.el.classList.toggle('is-dim', filter !== 'all' && wall[t.index].k !== filter));
    filtersEl.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
    if (withSound) play('pop');
  }
  filtersEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filter = chip.dataset.filter;
    applyFilter();
  });

  // --- Lightbox -----------------------------------------------------------
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbCount = document.getElementById('lb-count');
  let current = 0;
  const visible = () => wall.map((w, i) => i).filter((i) => filter === 'all' || wall[i].k === filter);

  function show(index) {
    current = index;
    const list = visible();
    const item = wall[index];
    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbCount.textContent = `${list.indexOf(index) + 1} / ${list.length}`;
    if (!reduced) gsap.fromTo(lbImg, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
  }
  function step(dir) {
    const list = visible();
    const pos = list.indexOf(current);
    show(list[wrap(pos + dir, list.length)]);
    play('tick');
  }
  function openLightbox(index) {
    show(index);
    lenis?.stop();
    lb.showModal();
    play('open');
  }
  document.getElementById('lb-prev').addEventListener('click', () => step(-1));
  document.getElementById('lb-next').addEventListener('click', () => step(1));
  document.getElementById('lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox__fig')) lb.close();
  });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  lb.addEventListener('close', () => {
    lenis?.start();
    root.focus({ preventScroll: true });
  });

  build();
  let rw = root.clientWidth;
  window.addEventListener('resize', () => {
    if (Math.abs(root.clientWidth - rw) < 40) return;
    rw = root.clientWidth;
    build();
  });
}
