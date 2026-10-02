# After Hours — a night-shift portfolio

A from-scratch rebuild of [bajkamalsingh.me](https://bajkamalsingh.me/) (Bajkamal Singh, "Baaz").
The content and imagery come from the original site. The concept, layout, code and interactions are new.

> **Concept.** Baaz's line is *"creative by night, more creative by midnight."* So the whole site is one shift,
> from **20:00 to 06:00**. Each chapter is stamped with a time. A HUD dial in the corner turns scroll position into
> the time of night, and the page ends on a dawn gradient when you "clock out".

| Time  | Chapter         | Interaction |
|-------|-----------------|-------------|
| 20:00 | Hero            | Split-letter wordmark that parts on scroll. The headline "I intentionally make misalignment look intentional" sits off-grid and snaps into alignment on hover. A showreel "monitor" with a live timecode. A live Delhi clock. |
| 21:30 | Origin          | Scroll-scrubbed word reveal, taped polaroid, count-up stats, philosophy card |
| 23:00 | Hustle          | A physical card deck of internships. Fling the top card away (pointer/touch), or use the buttons or arrow keys. |
| 00:30 | Best work       | Five case files on a pinned horizontal track. Each one opens a full-screen themed dossier (problem → moves → metrics → evidence), with next-file navigation. The Sinskari email funnel is redrawn as four automated lanes. |
| 02:45 | Insomniac work  | An endless, draggable poster wall with inertia and idle drift. It uses modulo-wrapped columns, so it never runs out. Category filters, keyboard panning, and a lightbox. |
| 05:30 | Contact         | Dawn sky, pre-filled mailto, copy-to-clipboard |

## Stack

- **Vite** (vanilla ES modules, no framework)
- **GSAP + ScrollTrigger** for the pinned track, scrubs, the deck physics and the intro
- **Lenis** for smooth scroll, synced to the GSAP ticker
- **Web Audio**, opt-in: every sound is synthesized, with no audio files
- Fonts: Big Shoulders Display, Instrument Serif, Inter Tight, JetBrains Mono, Caveat

## Details worth noting

- **Performance.** I re-encoded the original ~140 MB of PNG, JPEG and MP4 to about 6 MB of WebP and H.264. The wall makes one `transform` write per tile per frame, and its loop sleeps while it's off-screen.
- **Accessibility.** Native `<dialog>` with focus return, a skip link, and keyboard support for the deck, wall and lightbox. `prefers-reduced-motion` turns off pinning, scrubs, smooth scroll and the intro.
- **Responsive.** On phones the case files stack vertically instead of pinning. On touch, the wall pans horizontally while vertical swipes still scroll the page.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static output in dist/ (relative base, deploys anywhere)
```

## Structure

```
index.html            semantic skeleton for every chapter
src/js/data.js        all copy, metrics and asset paths
src/js/main.js        boot: Lenis ↔ ScrollTrigger, loader, contact
src/js/chrome.js      piecewise night-clock HUD, top bar theming, IST clock
src/js/hero.js        wordmark, misalignment headline, reel timecode
src/js/origin.js      word scrub, counters
src/js/deck.js        draggable card stack
src/js/cases.js       case-file cards, pinned track, dossier dialog
src/js/wall.js        infinite poster wall + lightbox
src/js/sound.js       Web Audio synth
src/styles/main.css   design tokens + all styles
public/assets/        optimised imagery (work, gallery, brand, media)
```

_All work, imagery and copy belong to Bajkamal Singh. This repo is a study rebuild._
