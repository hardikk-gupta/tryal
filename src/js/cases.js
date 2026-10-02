import { gsap } from 'gsap';
import { cases } from './data.js';
import { play } from './sound.js';

// Parchi has no screenshots on the source site, so its cover is drawn: a
// spoken order on top, the receipt it becomes underneath.
const receipt = `
  <span class="receipt" role="img" aria-label="Illustration: a spoken order turning into a printed receipt">
    <span class="receipt__voice"><i></i><i></i><i></i><i></i><i></i><b>Listening…</b></span>
    <span class="receipt__paper">
      <span class="receipt__head">PARCHI · bill</span>
      <span class="receipt__row"><span>Item</span><span>Qty</span><span>₹</span></span>
      <span class="receipt__row"><span>— — — —</span><span>2</span><span>— —</span></span>
      <span class="receipt__row"><span>— — —</span><span>1</span><span>— —</span></span>
      <span class="receipt__row"><span>— — — — —</span><span>3</span><span>— —</span></span>
      <span class="receipt__total"><span>Total</span><span>— — —</span></span>
      <span class="receipt__share">Print · WhatsApp</span>
    </span>
  </span>`;

function fileHTML(c, i) {
  const media = c.cover ? `<img src="${c.cover}" alt="" loading="lazy" decoding="async" />` : receipt;
  return `
    <button type="button" class="file" data-index="${i}" data-no="FILE ${c.no}" data-cursor="Open file"
      style="--bg:${c.theme.bg};--fg:${c.theme.fg};--accent:${c.theme.accent}"
      aria-haspopup="dialog" aria-label="Open case study ${c.no}: ${c.title}, ${c.kind}">
      <span class="file__head"><span class="mono file__client">${c.kind}</span></span>
      <span class="file__title">${c.title}</span>
      <span class="file__tags">${c.tags
        .slice(0, 3)
        .map((t) => `<span>${t}</span>`)
        .join('')}</span>
      <span class="file__media ${c.cover ? 'file__media--phone' : 'file__media--drawn'}">${media}</span>
      <span class="file__foot">
        <span class="file__stat"><b>${c.stat[0]}</b><span>${c.stat[1]}</span></span>
        <span class="file__open">Read the case →</span>
      </span>
    </button>`;
}

const block = (inner, cls = '') => `<section class="case__block ${cls}">${inner}</section>`;
const kicker = (t) => `<span class="case__kicker mono">${t}</span>`;
const screensRail = (list, cls = '') =>
  `<div class="rail ${cls}">${list
    .map(([src, alt]) => `<figure><img src="${src}" alt="${alt}" loading="lazy" decoding="async" /><figcaption class="mono">${alt}</figcaption></figure>`)
    .join('')}</div>`;

function caseHTML(c, i) {
  const parts = [];
  parts.push(`
    <header>
      <div class="case__overline mono">
        <span>File ${c.no} / ${String(cases.length).padStart(2, '0')}</span><span>·</span><span>${c.kind}</span>
      </div>
      <h2 class="case__title" id="case-title">${c.title}</h2>
      <p class="case__sub">${c.sub}</p>
      <ul class="case__tags">${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
    </header>`);

  // Problem → route → decision → regret, as four numbered panels.
  parts.push(
    block(`<ol class="story">${c.story
      .map(([h, p], k) => `<li class="story__item${k === 2 ? ' is-key' : ''}"><span class="mono">0${k + 1}</span><h3>${h}</h3><p>${p}</p></li>`)
      .join('')}</ol>`),
  );

  if (c.screens) parts.push(block(`${kicker('The screens')}${screensRail(c.screens)}`));
  else parts.push(block(`${kicker('The flow')}<div class="case__drawn">${receipt}</div>`));

  if (c.process) parts.push(block(`${kicker(c.process.title)}${screensRail(c.process.items, 'rail--process')}`));

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
