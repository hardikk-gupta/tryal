import { gsap } from 'gsap';
import { highlights } from './data.js';

// Wrap every word in a span, keeping inline elements (like <em>) intact.
function splitWords(root) {
  const words = [];
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(part);
          } else {
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.append(span);
            words.push(span);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(root);
  return words;
}

function renderStats() {
  const list = document.getElementById('stats-list');
  list.innerHTML = highlights
    .map(
      (h) => `
      <li>
        <span class="stats__num" data-value="${h.value}" data-prefix="${h.prefix ?? ''}" data-suffix="${h.suffix ?? ''}">${h.prefix ?? ''}${h.value}${h.suffix ?? ''}</span>
        <span class="stats__label">${h.label}</span>
        <span class="stats__note">${h.note}</span>
      </li>`,
    )
    .join('');
  return [...list.querySelectorAll('.stats__num')];
}

export function initOrigin({ reduced }) {
  const nums = renderStats();
  if (reduced) return;

  // Scroll-scrubbed reading: words light up as you move through the line.
  const words = splitWords(document.getElementById('origin-scrub'));
  gsap.to(words, {
    opacity: 1,
    stagger: 0.12,
    ease: 'none',
    scrollTrigger: { trigger: '#origin-scrub', start: 'top 78%', end: 'bottom 40%', scrub: true },
  });

  gsap.from('.polaroid', {
    rotate: 16,
    y: 80,
    opacity: 0,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.polaroid', start: 'top 85%' },
  });

  gsap.utils.toArray('.origin__steps li').forEach((li, i) => {
    gsap.from(li, {
      xPercent: -8,
      opacity: 0,
      duration: 1.2,
      delay: i * 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: li, start: 'top 88%' },
    });
  });

  // Counters roll up once, when the row first comes into view.
  nums.forEach((el) => {
    const target = Number(el.dataset.value);
    const counter = { v: 0 };
    gsap.to(counter, {
      v: target,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = `${el.dataset.prefix}${Math.round(counter.v)}${el.dataset.suffix}`),
    });
  });

  gsap.from('.philosophy__card', {
    rotate: -8,
    y: 60,
    opacity: 0,
    duration: 1.3,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.philosophy', start: 'top 80%' },
  });
}
