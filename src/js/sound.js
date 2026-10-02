// Tiny Web Audio synth. Nothing loads until the visitor opts in, and every
// sound is generated, so there are no audio files to ship.

let ctx = null;
let master = null;
let enabled = false;

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.22;
  master.connect(ctx.destination);
  return ctx;
}

function tone({ freq = 880, type = 'sine', dur = 0.12, gain = 0.5, at = 0, slideTo = null }) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise({ dur = 0.25, from = 400, to = 2400, gain = 0.4 }) {
  const t = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(from, t);
  bp.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
}

const library = {
  tick: () => tone({ freq: 2200, type: 'square', dur: 0.025, gain: 0.08 }),
  pop: () => tone({ freq: 520, slideTo: 1040, dur: 0.09, gain: 0.35 }),
  whoosh: () => noise({ dur: 0.28, from: 300, to: 3000, gain: 0.35 }),
  open: () => {
    tone({ freq: 523.25, dur: 0.18, gain: 0.3 });
    tone({ freq: 783.99, dur: 0.26, gain: 0.26, at: 0.07 });
  },
  close: () => tone({ freq: 660, slideTo: 330, dur: 0.16, gain: 0.25 }),
  chime: () => {
    [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => tone({ freq: f, dur: 0.5, gain: 0.18, at: i * 0.07, type: 'triangle' }));
  },
};

export function play(name) {
  if (!enabled || !ctx) return;
  library[name]?.();
}

export function initSound(button) {
  if (!button) return;
  const label = button.querySelector('.sound-toggle__text');
  button.addEventListener('click', async () => {
    enabled = !enabled;
    if (enabled) {
      ensureContext();
      if (ctx?.state === 'suspended') await ctx.resume();
      play('chime');
    }
    button.setAttribute('aria-pressed', String(enabled));
    if (label) label.textContent = enabled ? 'Sound on' : 'Sound off';
  });

  // Soft ticks on interactive things, throttled so sweeping the mouse isn't noisy.
  let last = 0;
  document.addEventListener('pointerover', (e) => {
    if (!enabled || e.pointerType !== 'mouse') return;
    if (!e.target.closest('a, button, .file, .chip')) return;
    const now = performance.now();
    if (now - last < 70) return;
    last = now;
    play('tick');
  });
}
