import { gsap } from 'gsap';
import { cases } from './data.js';
import { play } from './sound.js';

// A small, abstract funnel used as the Sinskari folder cover.
const miniFunnel = `
  <svg class="mini-funnel" viewBox="0 0 320 220" role="img" aria-label="Sketch of the email funnel: one entry splitting into four automated lanes">
    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <rect x="120" y="8" width="80" height="26" rx="6" fill="currentColor"/>
      <path d="M160 34v22M160 56H40v20M160 56h-40v20M160 56h40v20M160 56h120v20"/>
      ${[40, 120, 200, 280]
        .map(
          (x, i) => `
        <rect x="${x - 30}" y="76" width="60" height="22" rx="5"/>
        ${Array.from({ length: [1, 2, 4, 3][i] }, (_, j) => `<path d="M${x} ${98 + j * 26}v8"/><rect x="${x - 24}" y="${106 + j * 26}" width="48" height="14" rx="4" fill="currentColor" opacity="${0.85 - j * 0.15}"/>`).join('')}`,
        )
        .join('')}
    </g>
  </svg>`;

function fileHTML(c, i) {
  const media = c.cover
    ? `<img src="${c.cover}" alt="" loading="lazy" decoding="async" />`
    : miniFunnel;
  return `
    <button type="button" class="file" data-index="${i}" data-no="FILE ${c.no}" data-cursor="Open file"
      style="--bg:${c.theme.bg};--fg:${c.theme.fg};--accent:${c.theme.accent}"
      aria-haspopup="dialog" aria-label="Open case file ${c.no}: ${c.title}, ${c.client}">
      <span class="file__head">
        <span class="mono file__client">${c.client}</span>
        ${c.logo ? `<img class="file__logo" src="${c.logo}" alt="" loading="lazy" />` : ''}
      </span>
      <span class="file__title">${c.title}</span>
      <span class="file__tags">${c.tags
        .slice(0, 3)
        .map((t) => `<span>${t}</span>`)
        .join('')}</span>
      <span class="file__media ${c.cover ? '' : 'file__media--diagram'}">${media}</span>
      <span class="file__foot">
        <span class="file__stat"><b>${c.stat[0]}</b><span>${c.stat[1]}</span></span>
        <span class="file__open">Open file →</span>
      </span>
    </button>`;
}

const block = (inner, cls = '') => `<section class="case__block ${cls}">${inner}</section>`;
const kicker = (t) => `<span class="case__kicker mono">${t}</span>`;
const statement = (s) =>
  `${kicker(s.kicker)}<h3 class="case__head">${s.head}</h3>${s.body ? `<p class="case__body">${s.body}</p>` : ''}${
    s.list ? `<ul class="case__list">${s.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''
  }`;
const moves = (list, title = 'The moves') =>
  block(`${kicker(title)}<ol class="moves">${list.map(([h, p]) => `<li><h4>${h}</h4><p>${p}</p></li>`).join('')}</ol>`);
const metrics = (list, title = 'Impact') =>
  block(
    `${kicker(title)}<ul class="metrics">${list
      .map(([n, l, s]) => `<li><b>${n}</b><span>${l}</span>${s ? `<small>${s}</small>` : ''}</li>`)
      .join('')}</ul>`,
  );
const shots = (list, cls = '') =>
  `<div class="shots ${cls}">${list
    .map(([src, alt]) => `<figure><img src="${src}" alt="${alt}" loading="lazy" decoding="async" /><figcaption>${alt}</figcaption></figure>`)
    .join('')}</div>`;

function caseHTML(c, i) {
  const parts = [];
  parts.push(`
    <header>
      <div class="case__overline mono">
        <span>File ${c.no} / ${String(cases.length).padStart(2, '0')}</span><span>·</span><span>${c.role}</span>
        ${c.logo ? `<img src="${c.logo}" alt="${c.client} logo" />` : ''}
      </div>
      <h2 class="case__title" id="case-title">${c.title}</h2>
      <p class="case__sub">${c.sub}</p>
      <ul class="case__tags">${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
    </header>`);

  if (c.answer) {
    parts.push(block(`<div class="case__split"><div>${statement(c.problem)}</div><div>${statement(c.answer)}</div></div>`));
  } else {
    parts.push(block(statement(c.problem)));
  }

  if (c.episodes) {
    parts.push(
      block(`${kicker('RNTL. Spotlight — ' + c.episodesNote)}
        <div class="episodes">${c.episodes
          .map(
            ([name, meta, src], k) =>
              `<figure><img src="${src}" alt="${name}, RNTL. Spotlight episode ${k + 1}" loading="lazy" /><span class="ep-no mono">EP. ${k + 1}</span><figcaption><b>${name}</b><span>${meta}</span></figcaption></figure>`,
          )
          .join('')}</div>`),
    );
  }

  if (c.funnel) {
    const f = c.funnel;
    parts.push(
      block(`${kicker('Automated email funnel — designed from scratch')}
        <div class="funnel">
          <div class="funnel__entry">${f.entry.map((s) => `<span>${s}</span>`).join('<i>→</i>')}</div>
          <div class="funnel__lanes">${f.lanes
            .map(
              (lane) => `
              <div class="lane">
                <span class="lane__when">${lane.when}</span>
                ${lane.steps.map(([t, s]) => `<div class="lane__step"><b>${t}</b>${s}</div>`).join('')}
                <span class="lane__exit">→ ${lane.exit}</span>
              </div>`,
            )
            .join('')}</div>
        </div>`),
    );
  }

  if (c.moves) parts.push(moves(c.moves, c.id === 'signal' ? 'GTM execution phases' : c.id === 'histrionica' ? 'Executive roles' : 'The moves'));

  if (c.pilot) {
    parts.push(
      block(`${kicker('Paid social')}<h3 class="case__head">${c.pilot.head}</h3><p class="case__body">${c.pilot.body}</p>
        <div class="phases" style="margin-top:28px">${c.pilot.phases
          .map(([p, t, src]) => `<figure><figcaption><span class="mono">${p}</span><span>${t}</span></figcaption><img src="${src}" alt="${t} ad set grid" loading="lazy" /></figure>`)
          .join('')}</div>`),
    );
  }

  if (c.metrics) parts.push(metrics(c.metrics));

  if (c.statics) {
    parts.push(
      block(`${kicker('Visual archive — static campaigns')}${shots(
        c.statics.map(([src, a, b]) => [src, `${a} — ${b}`]),
      )}`),
    );
  }
  if (c.reels) {
    parts.push(
      block(`${kicker('Video campaigns — views captured')}
        <div class="reels">${c.reels
          .map(([src, title, views, href]) => {
            const inner = `<img src="${src}" alt="${title} reel cover" loading="lazy" /><b>${views}</b><span>${title}</span>`;
            return href
              ? `<a href="${href}" target="_blank" rel="noopener noreferrer" data-cursor="Watch">${inner}</a>`
              : `<div>${inner}</div>`;
          })
          .join('')}</div>`),
    );
  }

  if (c.gallery) {
    const title = c.id === 'krishna' ? 'Visual evidence — platform ecosystem' : c.id === 'rntl' ? 'Teardown' : 'Visual evidence — live activation';
    parts.push(block(`${kicker(title)}${shots(c.gallery, c.galleryStyle === 'phones' ? 'shots--phones' : c.id === 'rntl' ? 'shots--wide' : '')}`));
  }

  if (c.link) {
    parts.push(`<a class="case__link" href="${c.link[1]}" target="_blank" rel="noopener noreferrer">${c.link[0]} ↗</a>`);
  }

  const next = cases[(i + 1) % cases.length];
  parts.push(`
    <nav class="case__next" aria-label="Next case">
      <span class="mono">End of file ${c.no}</span>
      <button type="button" data-next="${(i + 1) % cases.length}"><span class="mono">Next file →</span><b>${next.title}</b></button>
    </nav>`);

  return parts.join('');
}

export function initCases({ reduced, lenis }) {
  const track = document.getElementById('cases-track');
  track.insertAdjacentHTML('beforeend', cases.map(fileHTML).join(''));

  // Desktop: pin the section and translate the folder row sideways.
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    if (reduced) {
      track.parentElement.style.overflowX = 'auto';
      return;
    }
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.cases__pin',
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => gsap.set('#cases-progress', { scaleX: progress }),
      },
    });
    gsap.utils.toArray('.file').forEach((file, i) => {
      gsap.from(file, {
        y: 60 + i * 10,
        rotation: i % 2 ? 3 : -3,
        ease: 'none',
        scrollTrigger: { trigger: file, containerAnimation: tween, start: 'left 105%', end: 'left 55%', scrub: true },
      });
    });
  });

  // Dialog
  const dialog = document.getElementById('case-dialog');
  const body = document.getElementById('case-body');
  const scroller = dialog.querySelector('.case-dialog__scroll');
  let opener = null;

  const render = (i) => {
    const c = cases[i];
    dialog.style.setProperty('--bg', c.theme.bg);
    dialog.style.setProperty('--fg', c.theme.fg);
    dialog.style.setProperty('--accent', c.theme.accent);
    body.innerHTML = caseHTML(c, i);
    scroller.scrollTop = 0;
    if (!reduced) {
      gsap.from(body.querySelectorAll('header > *, .case__block'), {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: 'expo.out',
      });
    }
  };

  const open = (i, trigger) => {
    opener = trigger;
    render(i);
    lenis?.stop();
    dialog.showModal();
    document.getElementById('case-close').focus();
    play('open');
  };

  track.addEventListener('click', (e) => {
    const file = e.target.closest('.file');
    if (file) open(Number(file.dataset.index), file);
  });
  body.addEventListener('click', (e) => {
    const next = e.target.closest('[data-next]');
    if (next) {
      play('whoosh');
      render(Number(next.dataset.next));
    }
  });
  document.getElementById('case-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    lenis?.start();
    play('close');
    opener?.focus({ preventScroll: true });
  });
}
