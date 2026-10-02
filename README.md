# Hardik Gupta — After Hours

The portfolio of **Hardik Gupta**, UI/UX and visual designer in Bangalore. He designs apps and websites end to end, then builds them in code.
All copy, project data and imagery come from [hardik-gupta.com](https://hardik-gupta.com/). The layout, motion and code here are new.

> **Concept.** The whole site is one night shift, from **20:00 to 06:00**. Each chapter is stamped with a time. A HUD dial in the corner turns scroll position into the time of night, matching each chapter's timestamp exactly, and the page ends on a dawn gradient when you "clock out".

| Time  | Chapter         | Interaction |
|-------|-----------------|-------------|
| 20:00 | Hero            | A split "HARDIK" wordmark that parts on scroll, behind a sticker-outlined cutout portrait. The headline "I design apps & websites end to end, then build them in code" sits off-grid and snaps into alignment on hover. A desk-cam "monitor" cycles through shipped work with a running timecode. A live Bangalore clock. |
| 21:30 | Origin          | Commerce degree → designing products: a scroll-scrubbed word reveal, a taped polaroid, count-up stats, the "boring states" card, and four working principles |
| 23:00 | Work history    | A physical card deck: Freelance, IDEX Media, Freelance designer, Velossalabs. Fling the top card away, or use the buttons or arrow keys. |
| 00:30 | Case studies    | Alter, Washio, Track It, Parchi and Hourbit on a pinned horizontal track. Each opens a full-screen dossier in that app's colour: problem → route → key decision → what I'd fix, then the screens, the process (sketches/wireframes) and the source link. Parchi's voice-to-receipt flow is drawn. |
| 02:45 | Everything else | An endless, draggable wall of branding, carousels, logos and websites, with inertia, idle drift, filters, keyboard panning and a lightbox |
| 05:30 | Contact         | Dawn sky, mailto, a cal.com link, socials, copy-to-clipboard |

## Stack

- **Vite** (vanilla ES modules, no framework)
- **GSAP + ScrollTrigger** for the pinned track, scrubs, the deck physics and the intro
- **Lenis** for smooth scroll, synced to the GSAP ticker
- **Web Audio**, opt-in: every sound is synthesized, with no audio files
- Fonts: Big Shoulders Display, Instrument Serif, Inter Tight, JetBrains Mono, Caveat

## Details worth noting

- **Assets.** The portrait cutout was made with a BiRefNet segmentation model, plus a dilated-alpha "sticker" outline. The wall pieces were sliced automatically out of the collage boards on hardik-gupta.com by finding connected components in the alpha channel. Everything is WebP, about 2.5 MB in total.
- **Performance.** The wall makes one `transform` write per tile per frame, and its loop sleeps while it's off-screen.
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
src/js/data.js        all copy, case studies, wall items and asset paths
src/js/main.js        boot: Lenis ↔ ScrollTrigger, loader, contact
src/js/chrome.js      piecewise night-clock HUD, top bar theming, IST clock
src/js/hero.js        wordmark, misalignment headline, monitor slideshow
src/js/origin.js      word scrub, counters, principles
src/js/deck.js        draggable work-history cards
src/js/cases.js       case-study cards, pinned track, dossier dialog
src/js/wall.js        infinite visuals wall + lightbox
src/js/sound.js       Web Audio synth
src/styles/main.css   design tokens + all styles
public/assets/        me/, cases/, wall/, monitor/
```
